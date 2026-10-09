import { Fragment, type ReactNode } from "react";

/**
 * 极简 Markdown 渲染器：只处理 code fence / 标题 / 列表 / 引用 / 粗体 / 行内代码。
 * 为什么不用现成库？因为文章结构就这么简单，少一个依赖少一份升级烦恼。
 */
export function PostBody({ source }: { source: string }) {
  return <div className="prose-post">{renderBlocks(source)}</div>;
}

type Block =
  | { kind: "code"; lang: string; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "p"; text: string };

function parse(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "p", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    // 代码块
    if (trimmed.startsWith("```")) {
      flush();
      const lang = trimmed.slice(3).trim();
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      blocks.push({ kind: "code", lang, text: code.join("\n") });
      continue;
    }

    // 空行
    if (trimmed === "") {
      flush();
      continue;
    }

    // 二级标题
    if (trimmed.startsWith("## ")) {
      flush();
      blocks.push({ kind: "h2", text: trimmed.slice(3).trim() });
      continue;
    }

    // 列表（连续的 - 开头的行合成一个列表）
    if (trimmed.startsWith("- ")) {
      flush();
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("- ")) {
        items.push(lines[i].trim().slice(2).trim());
        i += 1;
      }
      i -= 1;
      blocks.push({ kind: "list", items });
      continue;
    }

    // 引用
    if (trimmed.startsWith("> ")) {
      flush();
      blocks.push({ kind: "quote", text: trimmed.slice(2).trim() });
      continue;
    }

    paragraph.push(trimmed);
  }

  flush();
  return blocks;
}

function renderBlocks(source: string) {
  return parse(source).map((block, index) => {
    switch (block.kind) {
      case "code":
        return (
          <pre
            key={index}
            className="my-6 overflow-x-auto rounded-xl border border-[var(--line)] bg-[rgb(var(--glow)/0.06)] p-4 text-[0.85rem] leading-relaxed"
          >
            <code style={{ fontFamily: "var(--font-mono)" }}>{block.text}</code>
          </pre>
        );
      case "h2":
        return <h2 key={index}>{block.text}</h2>;
      case "quote":
        return (
          <blockquote
            key={index}
            className="my-6 border-l-2 border-[var(--accent)] pl-5 text-[var(--fg)] italic"
          >
            {inline(block.text)}
          </blockquote>
        );
      case "list":
        return (
          <ul key={index} className="my-5 space-y-2.5 pl-1">
            {block.items.map((item, j) => (
              <li key={j} className="flex gap-3">
                <span
                  aria-hidden
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                />
                <span>{inline(item)}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return <p key={index}>{inline(block.text)}</p>;
    }
  });
}

/** 处理 **粗体** 与 `行内代码` */
function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-[var(--fg)]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
