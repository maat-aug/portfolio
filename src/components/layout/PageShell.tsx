import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { LanguageMenu } from "@/components/layout/LanguageMenu";
import { alternateLanguage, type Language } from "@/domain/language";
import { siteContent } from "@/lib/site";

type PageShellProps = {
  language: Language;
  alternateHref: string;
  children: ReactNode;
};

export function PageShell({ language, alternateHref, children }: PageShellProps) {
  const { controls } = siteContent(language);
  const alternate = alternateLanguage(language);

  return (
    <>
      <div className="fixed right-4 top-5 z-30 sm:right-6 sm:top-6">
        <LanguageMenu
          language={language}
          alternateHref={alternateHref}
          alternateHrefLang={siteContent(alternate).htmlLang}
          label={controls.selectLanguage}
        />
      </div>
      <main className="flex-1">{children}</main>
      <Footer language={language} />
    </>
  );
}
