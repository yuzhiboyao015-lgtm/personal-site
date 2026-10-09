import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { Icon } from "@/components/icons";
import { RevealGroup, RevealItem, Reveal, WordReveal } from "@/components/motion-primitives";

export function Work() {
  return (
    <section id="work" className="scroll-mt-24 py-24">
      <div className="container-page">
        <Reveal>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow mb-4">精选作品</p>
              <h2
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <WordReveal text="做过的事" />
              </h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--fg-dim)]">
              每个项目都写清楚「解决了什么问题」，而不是堆技术名词。
            </p>
          </div>
        </Reveal>

        <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <RevealItem key={project.slug} className="h-full">
              <article className="card-glow surface group flex h-full flex-col p-6 transition-transform duration-500 hover:-translate-y-1.5">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <span className="eyebrow">{project.year}</span>
                  <div className="flex gap-2">
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.title} 的源码`}
                        className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[var(--fg-muted)] transition-colors hover:border-[rgb(var(--glow)/0.6)] hover:text-[var(--accent)]"
                      >
                        <Icon name="github" className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`打开 ${project.title}`}
                        className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] text-[var(--fg-muted)] transition-colors hover:border-[rgb(var(--glow)/0.6)] hover:text-[var(--accent)]"
                      >
                        <Icon name="link" className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                <h3
                  className="text-xl font-semibold tracking-tight transition-colors group-hover:text-[var(--accent)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {project.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--fg-muted)]">
                  {project.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[0.7rem] tracking-wide text-[var(--fg-dim)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-10">
            <Link href="/lab" className="btn-ghost">
              更多半成品在实验室
              <Icon name="arrow" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
