import Link from "next/link";
import { site } from "@/lib/site";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/motion-primitives";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-[var(--line)] py-14">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-3">联系我</p>
              <a
                href={`mailto:${site.email}`}
                className="text-2xl font-medium tracking-tight transition-colors hover:text-[var(--accent)] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {site.email}
              </a>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--fg-dim)]">
                想聊项目、找合作，或者只是想指出我哪里写错了——都欢迎。
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="btn-ghost !px-4 !py-2.5 text-sm"
                >
                  <Icon name={s.icon} />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-xs text-[var(--fg-dim)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} · 用 Next.js 与一点点固执手写
          </p>
          <Link href="/#top" className="inline-flex items-center gap-1.5 hover:text-[var(--accent)]">
            回到顶部
            <Icon name="arrow" className="h-3.5 w-3.5 -rotate-90" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
