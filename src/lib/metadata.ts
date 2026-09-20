import type { Metadata } from "next";
import type { Language, Localized } from "@/domain/language";
import { SITE_URL } from "@/lib/config";
import type { Project } from "@/domain/project";
import { absoluteUrl, homePath, projectPath, projectsPath } from "@/lib/routes";
import { siteContent } from "@/lib/site";

type MetadataInput = {
  readonly language: Language;
  readonly title: string;
  readonly description: string;
  readonly paths: Localized<string>;
  readonly imagePath?: string;
};

const OPEN_GRAPH_LOCALE: Localized<string> = {
  pt: "pt_BR",
  en: "en_US",
};

export function buildMetadata({
  language,
  title,
  description,
  paths,
  imagePath,
}: MetadataInput): Metadata {
  const canonical = paths[language];

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "pt-BR": paths.pt,
        en: paths.en,
        "x-default": paths.pt,
      },
    },
    openGraph: {
      type: "website",
      url: absoluteUrl(canonical, SITE_URL),
      siteName: "Matheus Augusto",
      locale: OPEN_GRAPH_LOCALE[language],
      title,
      description,
      images: imagePath ? [absoluteUrl(imagePath, SITE_URL)] : undefined,
    },
  };
}

export function homeMetadata(language: Language): Metadata {
  const { meta } = siteContent(language);

  return buildMetadata({
    language,
    title: meta.home.title,
    description: meta.home.description,
    paths: { pt: homePath("pt"), en: homePath("en") },
  });
}

export function projectsMetadata(language: Language): Metadata {
  const { meta } = siteContent(language);

  return buildMetadata({
    language,
    title: meta.projects.title,
    description: meta.projects.description,
    paths: { pt: projectsPath("pt"), en: projectsPath("en") },
  });
}

export function projectMetadata(language: Language, project: Project): Metadata {
  const content = project.content[language];
  const { hero } = siteContent(language);

  return buildMetadata({
    language,
    title: `${content.name} — ${hero.name}`,
    description: content.tagline,
    paths: {
      pt: projectPath("pt", project.slug),
      en: projectPath("en", project.slug),
    },
  });
}
