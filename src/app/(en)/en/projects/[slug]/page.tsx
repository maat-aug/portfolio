import { notFound } from "next/navigation";
import { projectMetadata } from "@/lib/metadata";
import { findProject, listProjects } from "@/lib/projects";
import { ProjectView } from "@/views/ProjectView";

type PageParams = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return listProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageParams) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    return {};
  }

  return projectMetadata("en", project);
}

export default async function Page({ params }: PageParams) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) {
    notFound();
  }

  return <ProjectView language="en" project={project} />;
}
