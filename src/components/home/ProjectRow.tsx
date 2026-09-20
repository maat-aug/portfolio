import Link from "next/link";
import { Screenshot } from "@/components/ui/Screenshot";
import { Tag } from "@/components/ui/Tag";
import { TagList } from "@/components/ui/TagList";
import type { Language } from "@/domain/language";
import type { Project } from "@/domain/project";
import { projectPath } from "@/lib/routes";

type ProjectRowProps = {
  project: Project;
  language: Language;
  readMoreLabel: string;
  reversed: boolean;
  priority: boolean;
};

export function ProjectRow({ project, language, readMoreLabel, reversed, priority }: ProjectRowProps) {
  const content = project.content[language];

  return (
    <li>
      <Link
        href={projectPath(language, project.slug)}
        aria-label={`${readMoreLabel}: ${content.name}`}
        className="group grid items-center gap-8 rounded-3xl border border-line bg-surface/65 p-5 shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/45 hover:bg-surface-raised sm:p-8 md:grid-cols-2 md:gap-14"
      >
        <div className={reversed ? "md:order-2" : undefined}>
          <div className="transition-transform duration-300 group-hover:-translate-y-1">
            <Screenshot
              src={project.cover.src}
              alt={project.cover.alt[language]}
              width={project.cover.width}
              height={project.cover.height}
              priority={priority}
            />
          </div>
        </div>

        <div className={reversed ? "md:order-1" : undefined}>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-sm text-muted">{project.year}</p>
            {project.family ? <Tag label={project.family} variant="accent" /> : null}
          </div>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {content.name}
          </h3>
          <p className="mt-4 max-w-[48ch] text-lg leading-relaxed text-muted">{content.tagline}</p>
          <div className="mt-6">
            <TagList tags={project.tags} />
          </div>
          <span className="mt-7 inline-flex items-center gap-2 font-medium text-accent">
            {readMoreLabel}
            <svg
              className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </Link>
    </li>
  );
}
