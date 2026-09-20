export const LANGUAGES = ["pt", "en"] as const;

export type Language = (typeof LANGUAGES)[number];

export type Localized<T> = Readonly<Record<Language, T>>;

export const DEFAULT_LANGUAGE: Language = "pt";

export function alternateLanguage(language: Language): Language {
  return language === "pt" ? "en" : "pt";
}
