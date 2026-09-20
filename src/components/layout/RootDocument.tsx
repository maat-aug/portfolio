import type { ReactNode } from "react";
import type { Language } from "@/domain/language";
import { geistMono, geistSans } from "@/lib/fonts";
import { LANGUAGE_REDIRECT_SCRIPT } from "@/lib/languagePreference";
import { siteContent } from "@/lib/site";

type RootDocumentProps = {
  language: Language;
  children: ReactNode;
};

export function RootDocument({ language, children }: RootDocumentProps) {
  const { htmlLang } = siteContent(language);

  return (
    <html lang={htmlLang} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {language === "pt" ? (
          <script dangerouslySetInnerHTML={{ __html: LANGUAGE_REDIRECT_SCRIPT }} />
        ) : null}
        {children}
      </body>
    </html>
  );
}
