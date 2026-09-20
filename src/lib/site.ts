import { EN_SITE_CONTENT } from "@/content/site/en";
import { PT_SITE_CONTENT } from "@/content/site/pt";
import type { Language } from "@/domain/language";
import type { SiteContent } from "@/domain/site";

const CONTENT: Readonly<Record<Language, SiteContent>> = {
  pt: PT_SITE_CONTENT,
  en: EN_SITE_CONTENT,
};

export function siteContent(language: Language): SiteContent {
  return CONTENT[language];
}
