import { PageShell } from "@/components/layout/PageShell";
import { FeatureGrid } from "@/components/project/FeatureGrid";
import { ProjectGallery } from "@/components/project/ProjectGallery";
import { ProjectIntro } from "@/components/project/ProjectIntro";
import { ProseSection } from "@/components/project/ProseSection";
import { TechnicalDetails } from "@/components/project/TechnicalDetails";
import { alternateLanguage, type Language } from "@/domain/language";
import type { Project } from "@/domain/project";
import { projectPath } from "@/lib/routes";
import { siteContent } from "@/lib/site";

type ProjectViewProps = {
  language: Language;
  project: Project;
};

export function ProjectView({ language, project }: ProjectViewProps) {
  const labels = siteContent(language).project;
  const content = project.content[language];

  return (
    <PageShell
      language={language}
      alternateHref={projectPath(alternateLanguage(language), project.slug)}
    >
      <ProjectIntro project={project} language={language} backLabel={labels.backLabel} galleryLabels={labels.gallery} />
      <ProseSection heading={labels.problemHeading} paragraphs={content.problem} />
      <FeatureGrid heading={labels.featuresHeading} features={content.features} />
      <ProjectGallery images={project.gallery} language={language} labels={labels.gallery} />
      <ProseSection heading={labels.audienceHeading} paragraphs={content.audience} />
      <TechnicalDetails
        sections={content.technical}
        labels={labels}
        repositoryUrl={project.repositoryUrl}
      />
    </PageShell>
  );
}
