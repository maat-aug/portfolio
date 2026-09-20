import { projectsMetadata } from "@/lib/metadata";
import { HomeView } from "@/views/HomeView";

export const metadata = projectsMetadata("pt");

export default function ProjectsPage() {
  return <HomeView language="pt" initialTab="projects" />;
}
