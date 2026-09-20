import { AboutPanel } from "@/components/home/AboutPanel";
import { Hero } from "@/components/home/Hero";
import { HomeTabs } from "@/components/home/HomeTabs";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import { ProjectList } from "@/components/home/ProjectList";
import { PageShell } from "@/components/layout/PageShell";
import { alternateLanguage, type Language } from "@/domain/language";
import { listProjects } from "@/lib/projects";
import { homePath, projectsPath } from "@/lib/routes";
import { siteContent } from "@/lib/site";

type HomeViewProps = {
  language: Language;
  initialTab?: "about" | "projects";
};

export function HomeView({ language, initialTab = "about" }: HomeViewProps) {
  const content = siteContent(language);

  return (
    <PageShell
      language={language}
      alternateHref={initialTab === "projects" ? projectsPath(alternateLanguage(language)) : homePath(alternateLanguage(language))}
    >
      <PersonJsonLd description={content.meta.home.description} />
      <Hero content={content.hero} />
      <HomeTabs
        labels={content.navigation}
        language={language}
        initialTab={initialTab}
        projects={
          <ProjectList
            language={language}
            labels={content.projects}
            projects={listProjects()}
          />
        }
        about={<AboutPanel about={content.about} language={language} />}
      />
    </PageShell>
  );
}
