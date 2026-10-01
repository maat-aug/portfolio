"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import type { Localized } from "@/domain/language";
import { pathLanguage } from "@/lib/languagePreference";

/** O layout raiz é único, então o lang do <html> acompanha a rota nas navegações client-side. */
export function HtmlLang({ htmlLang }: { htmlLang: Localized<string> }) {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = htmlLang[pathLanguage(pathname)];
  }, [htmlLang, pathname]);

  return null;
}
