/**
 * 审计 pnpm-lock.yaml：找出所有"发布时间太新"的包。
 *
 * 背景：Cloudflare 的构建环境启用了 pnpm 的 minimumReleaseAge 策略
 * （默认 1440 分钟 = 24 小时），任何发布时间晚于 (现在 - 24h) 的依赖
 * 都会让 `pnpm install --frozen-lockfile` 直接失败：
 *   ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION: N lockfile entries failed verification
 *
 * 用法：node scripts/audit-release-age.mjs [最小年龄小时数，默认 24]
 */
import { readFile } from "node:fs/promises";

const MIN_AGE_HOURS = Number(process.argv[2] ?? 24);
const CUTOFF = new Date(Date.now() - MIN_AGE_HOURS * 3600 * 1000);
const REGISTRY = "https://registry.npmjs.org";
const BATCH = 128;

/** lockfile 里形如 `  '@scope/name@1.2.3':` 或 `  name@1.2.3:` 的键。
 *  只认带 resolution 的条目——workspace/link 包没必要查发布时间。 */
function parseLockfile(text) {
  const found = new Map();
  const blocks = text.split(/\n(?= {2}'?[@\w])/);
  for (const block of blocks) {
    const header = /^ {2}'?(@[^\s@'\/]+\/[^\s@']+|[^\s@'\/][^\s@']*)@([0-9][^\s:()']*)'?:/.exec(block);
    if (!header) continue;
    if (!/^\s+resolution:\s/m.test(block)) continue; // workspace / link 包跳过
    found.set(`${header[1]}@${header[2]}`, { name: header[1], version: header[2] });
  }
  return [...found.values()];
}

async function fetchBatch(names) {
  // 批量接口要求 scoped 包名里的 / 保持原样（不能 %2F 转义）
  const url = `${REGISTRY}/${names.join(",")}`;
  const res = await fetch(url, {
    headers: { accept: "application/vnd.npm.install-v1+json" },
  });
  if (!res.ok) throw new Error(`registry ${res.status} for batch of ${names.length}`);
  return res.json();
}

async function fetchOne(name) {
  const res = await fetch(`${REGISTRY}/${name}`, {
    headers: { accept: "application/vnd.npm.install-v1+json" },
  });
  if (!res.ok) throw new Error(`registry ${res.status}`);
  return res.json();
}

const lock = await readFile(new URL("../pnpm-lock.yaml", import.meta.url), "utf8");
const entries = parseLockfile(lock);
const uniqueNames = [...new Set(entries.map((e) => e.name))];

console.log(`锁文件条目: ${entries.length}   不重复包名: ${uniqueNames.length}`);
console.log(`截止时间: ${CUTOFF.toISOString()}  （早于此时间发布的才允许）\n`);

/** name -> { version: publishDate } */
const published = new Map();
const failed = [];
for (let i = 0; i < uniqueNames.length; i += BATCH) {
  const slice = uniqueNames.slice(i, i + BATCH);
  let data = null;
  try {
    data = await fetchBatch(slice);
  } catch {
    // 批量失败就逐个补，宁可慢也不能漏
    for (const name of slice) {
      try {
        const one = await fetchOne(name);
        published.set(name, one.time ?? {});
      } catch (err) {
        failed.push(`${name} (${err.message})`);
      }
    }
  }
  if (data) {
    for (const [name, meta] of Object.entries(data)) {
      published.set(name, meta.time ?? {});
    }
  }
  process.stdout.write(`\r  已查询 ${Math.min(i + BATCH, uniqueNames.length)}/${uniqueNames.length} 个包名`);
}
console.log("\n");

const tooNew = [];
const unknown = [];
for (const { name, version } of entries) {
  const times = published.get(name);
  if (!times) {
    unknown.push(`${name}@${version}`);
    continue;
  }
  // 预发布版本常常在 "time" 里没有独立条目，退回到 modified 时间
  const iso = times[version] ?? times.modified;
  if (!iso) {
    unknown.push(`${name}@${version}`);
    continue;
  }
  const date = new Date(iso);
  if (date > CUTOFF) {
    tooNew.push({
      spec: `${name}@${version}`,
      published: date.toISOString(),
      ageHours: ((Date.now() - date.getTime()) / 3600000).toFixed(1),
    });
  }
}

if (tooNew.length === 0) {
  console.log(
    failed.length === 0
      ? "✅ 全部核实完毕：没有任何包会被 minimumReleaseAge 拦下"
      : "⚠️ 已核实的包里没有超龄的，但有查询失败项（见下），结论不算完整",
  );
} else {
  console.log(`❌ 有 ${tooNew.length} 个包太新，会被 Cloudflare 拒绝：`);
  for (const item of tooNew.sort((a, b) => a.ageHours - b.ageHours)) {
    console.log(`   ${item.spec.padEnd(44)} 发布于 ${item.published}  (${item.ageHours} 小时前)`);
  }
  console.log("\n处理建议：把直接依赖钉到更旧的版本，然后重新跑本脚本确认清零。");
}
if (failed.length > 0) {
  console.log(`\n❌ ${failed.length} 个包名查询失败（这些没能核实）：`);
  for (const f of failed.slice(0, 10)) console.log(`   ${f}`);
}
if (unknown.length > 0) {
  console.log(`\n（${unknown.length} 个条目查不到发布时间，通常是 link:/file: 依赖，可忽略）`);
}
