import { homeMetadata } from "@/lib/metadata";
import { HomeView } from "@/views/HomeView";

export const metadata = homeMetadata("en");

export default function Page() {
  return <HomeView language="en" />;
}
