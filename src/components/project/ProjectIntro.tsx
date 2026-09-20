import { Container } from "@/components/ui/Container";
import { ProjectBackLink } from "@/components/project/ProjectBackLink";
import { ProjectImageViewer } from "@/components/project/ProjectImageViewer";
import { Tag } from "@/components/ui/Tag";
import { TagList } from "@/components/ui/TagList";
import type { Language } from "@/domain/language";
import type { Project } from "@/domain/project";
import type { GalleryLabels } from "@/domain/site";
import { projectsPath } from "@/lib/routes";

type ProjectIntroProps = {
  project: Project;
  language: Language;
  backLabel: string;
  galleryLabels: GalleryLabels;
};

export function ProjectIntro({ project, language, backLabel, galleryLabels }: ProjectIntroProps) {
  const content = project.content[language];

  return (
    <section className="pb-16 pt-12 sm:pb-24 sm:pt-16">
      <Container>
        <ProjectBackLink href={projectsPath(language)} label={backLabel} />

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-mono text-sm text-accent">{project.year}</p>
              {project.family ? <Tag label={project.family} variant="accent" /> : null}
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl">
              {content.name}
            </h1>
            <p className="mt-6 max-w-[36ch] text-xl leading-relaxed text-muted">{content.tagline}</p>
            <div className="mt-8 border-t border-line pt-6">
              <TagList tags={project.tags} />
            </div>
          </div>

          <ProjectImageViewer
            src={project.cover.src}
            alt={project.cover.alt[language]}
            width={project.cover.width}
            height={project.cover.height}
            labels={galleryLabels}
            priority
          />
        </div>
      </Container>
    </section>
  );
}
