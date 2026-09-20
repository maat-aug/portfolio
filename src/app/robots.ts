import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { absoluteUrl } from "@/lib/routes";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml", SITE_URL),
  };
}
