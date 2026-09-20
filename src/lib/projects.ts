import { PROJECTS } from "@/content/projects";
import type { Project } from "@/domain/project";

export function listProjects(): readonly Project[] {
  return PROJECTS;
}

export function findProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}
