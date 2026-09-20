import { projectsMetadata } from "@/lib/metadata";
import { HomeView } from "@/views/HomeView";

export const metadata = projectsMetadata("en");

export default function ProjectsPage() {
  return <HomeView language="en" initialTab="projects" />;
}
