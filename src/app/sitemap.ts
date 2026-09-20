import type { MetadataRoute } from "next";
import { LANGUAGES } from "@/domain/language";
import { SITE_URL } from "@/lib/config";
import { listProjects } from "@/lib/projects";
import { absoluteUrl, homePath, projectPath, projectsPath } from "@/lib/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = LANGUAGES.flatMap((language) => [
    homePath(language),
    projectsPath(language),
    ...listProjects().map((project) => projectPath(language, project.slug)),
  ]);

  return paths.map((path) => ({
    url: absoluteUrl(path, SITE_URL),
    lastModified: new Date(),
  }));
}
