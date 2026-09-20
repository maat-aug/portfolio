"use client";

import { useEffect, useState } from "react";
import type { Language } from "@/domain/language";
import type { ExperienceEntry } from "@/domain/site";

type ExperienceListProps = {
  entries: readonly ExperienceEntry[];
  language: Language;
  /** Momento em que o HTML estático foi gerado. Serve de valor inicial igual no servidor e no
   *  cliente; o efeito abaixo troca pela data real do visitante logo após a hidratação. */
  renderedAt: string;
};

export function ExperienceList({ entries, language, renderedAt }: ExperienceListProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date(renderedAt));

  useEffect(() => setCurrentDate(new Date()), []);

  return (
    <ul className="space-y-4">
      {entries.map((entry) => (
        <li key={entry.organization} className="rounded-2xl border border-line bg-surface/65 p-5 transition-colors hover:border-accent/35 hover:bg-surface-raised sm:p-6">
          <RoleTimeline entry={entry} language={language} currentDate={currentDate} />
        </li>
      ))}
    </ul>
  );
}

function RoleTimeline({ entry, language, currentDate }: { entry: ExperienceEntry; language: Language; currentDate: Date }) {
  const organizationPeriod = getOrganizationPeriod(entry, language, currentDate);

  return (
    <>
      <div className="flex items-start gap-4">
        <img
          src={entry.logoSrc}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          className="size-12 shrink-0 rounded-xl border border-line bg-bg object-cover sm:size-14"
        />
        <div>
          <h3 className="text-lg font-semibold text-ink">{entry.organization}</h3>
          <p className="mt-1 text-sm text-muted">
            {organizationPeriod ? <>{organizationPeriod} <span aria-hidden="true">—</span> </> : null}
            {entry.location}
          </p>
        </div>
      </div>
      <ol className="mt-5 space-y-6 border-l border-line pl-5">
        {entry.roles.map((role, index) => (
          <li key={index} className="relative">
            <span aria-hidden="true" className="absolute -left-[1.6rem] top-1.5 size-2.5 rounded-full border-2 border-surface-raised bg-muted" />
            <h4 className="font-semibold text-ink">{role.role}</h4>
            <p className="mt-1 text-sm text-muted">{role.employmentType}</p>
            <p className="mt-1 text-sm text-muted">{role.period}</p>
            {role.summary ? <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{role.summary}</p> : null}
          </li>
        ))}
      </ol>
    </>
  );
}

function getOrganizationPeriod(entry: ExperienceEntry, language: Language, currentDate: Date): string | undefined {
  if (!entry.organizationStartedAt) return entry.organizationPeriod;

  const [startYear, startMonth] = entry.organizationStartedAt.split("-").map(Number);
  const months = Math.max(1, (currentDate.getFullYear() - startYear) * 12 + currentDate.getMonth() - (startMonth - 1) + 1);
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years === 0) {
    return language === "pt" ? `${months} ${months === 1 ? "mês" : "meses"}` : `${months} ${months === 1 ? "month" : "months"}`;
  }

  const yearLabel = language === "pt" ? `${years} ${years === 1 ? "ano" : "anos"}` : `${years} ${years === 1 ? "year" : "years"}`;
  if (remainingMonths === 0) return yearLabel;

  const monthLabel = language === "pt"
    ? `${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`
    : `${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`;
  return language === "pt" ? `${yearLabel} e ${monthLabel}` : `${yearLabel} ${monthLabel}`;
}
