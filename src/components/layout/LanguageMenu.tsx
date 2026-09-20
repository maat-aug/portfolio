"use client";

import Link from "next/link";
import { useState } from "react";
import { LANGUAGES, type Language, type Localized } from "@/domain/language";
import { rememberLanguage } from "@/lib/languagePreference";

type LanguageMenuProps = {
  language: Language;
  alternateHref: string;
  alternateHrefLang: string;
  label: string;
};

const NAMES: Localized<string> = { pt: "Português", en: "English" };

const ITEM_CLASS = "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-left transition-colors";

function Flag({ language }: { language: Language }) {
  return language === "pt" ? (
    <svg className="h-3.5 w-5 shrink-0 rounded-[2px]" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#009b3a" />
      <path d="M10 1.8 18.4 7 10 12.2 1.6 7Z" fill="#ffdf00" />
      <circle cx="10" cy="7" r="3" fill="#002776" />
    </svg>
  ) : (
    <svg className="h-3.5 w-5 shrink-0 rounded-[2px]" viewBox="0 0 20 13" aria-hidden="true">
      <rect width="20" height="13" fill="#ffffff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="20" height="1" fill="#b22234" />
      ))}
      <rect width="8" height="7" fill="#3c3b6e" />
    </svg>
  );
}

export function LanguageMenu({ language, alternateHref, alternateHrefLang, label }: LanguageMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-ink"
      >
        <Flag language={language} />
        {NAMES[language]}
        <svg
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-surface shadow-[var(--shadow)]"
        >
          {LANGUAGES.map((option) => (
            <li key={option}>
              {option === language ? (
                <button
                  type="button"
                  aria-current="true"
                  onClick={() => setOpen(false)}
                  className={`${ITEM_CLASS} bg-accent-soft font-medium text-ink`}
                >
                  <Flag language={option} />
                  {NAMES[option]}
                </button>
              ) : (
                <Link
                  href={alternateHref}
                  hrefLang={alternateHrefLang}
                  onClick={() => rememberLanguage(option)}
                  className={`${ITEM_CLASS} text-muted hover:bg-accent-soft hover:text-ink`}
                >
                  <Flag language={option} />
                  {NAMES[option]}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
