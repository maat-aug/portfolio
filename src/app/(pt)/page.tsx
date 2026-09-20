import { homeMetadata } from "@/lib/metadata";
import { HomeView } from "@/views/HomeView";

export const metadata = homeMetadata("pt");

export default function Page() {
  return <HomeView language="pt" />;
}
