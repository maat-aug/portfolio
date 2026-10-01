import type { Metadata } from "next";
import { ViewTransition, type ReactNode } from "react";
import { HtmlLang } from "@/components/layout/HtmlLang";
import type { Localized } from "@/domain/language";
import { SITE_URL } from "@/lib/config";
import { geistMono, geistSans } from "@/lib/fonts";
import { LANGUAGE_TRANSITION, languageBootScript } from "@/lib/languagePreference";
import { siteContent } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

const HTML_LANG: Localized<string> = { pt: siteContent("pt").htmlLang, en: siteContent("en").htmlLang };

/**
 * Um único layout raiz para os dois idiomas: com um layout raiz por idioma, o Next recarrega a
 * página inteira ao trocar de idioma. O lang do <html> é ajustado pelo script de boot.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={HTML_LANG.pt}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: languageBootScript(HTML_LANG) }} />
        <HtmlLang htmlLang={HTML_LANG} />
        <ViewTransition default={{ [LANGUAGE_TRANSITION]: "language-swap", default: "none" }}>
          {children}
        </ViewTransition>
      </body>
    </html>
  );
}
