import type { Language } from "@/domain/language";

type LanguageSegments = {
  readonly root: string;
  readonly projects: string;
};

const SEGMENTS: Readonly<Record<Language, LanguageSegments>> = {
  pt: { root: "", projects: "projetos" },
  en: { root: "en", projects: "projects" },
};

function toPath(...segments: readonly string[]): string {
  const path = segments.filter(Boolean).join("/");
  return path ? `/${path}/` : "/";
}

export function homePath(language: Language): string {
  return toPath(SEGMENTS[language].root);
}

export function projectPath(language: Language, slug: string): string {
  return toPath(SEGMENTS[language].root, SEGMENTS[language].projects, slug);
}

export function projectsPath(language: Language): string {
  return toPath(SEGMENTS[language].root, SEGMENTS[language].projects);
}

export function absoluteUrl(path: string, origin: string): string {
  return new URL(path, origin).toString();
}
