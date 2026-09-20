import { ProjectRow } from "@/components/home/ProjectRow";
import { Container } from "@/components/ui/Container";
import type { Language } from "@/domain/language";
import type { Project } from "@/domain/project";
import type { ProjectsSectionLabels } from "@/domain/site";

type ProjectListProps = {
  language: Language;
  labels: ProjectsSectionLabels;
  projects: readonly Project[];
};

export function ProjectList({ language, labels, projects }: ProjectListProps) {
  return (
    <section className="pt-12 sm:pt-16">
      <Container>
        <ul className="space-y-10 sm:space-y-12">
          {projects.map((project, index) => (
            <ProjectRow
              key={project.slug}
              project={project}
              language={language}
              readMoreLabel={labels.readMore}
              reversed={index % 2 === 1}
              priority={index === 0}
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
