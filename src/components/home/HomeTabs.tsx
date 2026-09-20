"use client";

import Link from "next/link";
import { useLayoutEffect, useState, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import type { Language } from "@/domain/language";
import type { NavigationLabels } from "@/domain/site";
import { consumeProjectReturn } from "@/lib/projectReturn";
import { homePath, projectsPath } from "@/lib/routes";

type Tab = "projects" | "about";

type HomeTabsProps = {
  labels: NavigationLabels;
  language: Language;
  initialTab: Tab;
  projects: ReactNode;
  about: ReactNode;
};

export function HomeTabs({ labels, language, initialTab, projects, about }: HomeTabsProps) {
  const [animateProjects, setAnimateProjects] = useState(true);
  const tabs: readonly (readonly [Tab, string])[] = [
    ["about", labels.about],
    ["projects", labels.projects],
  ];

  useLayoutEffect(() => {
    if (initialTab !== "projects") return;
    if (consumeProjectReturn()) setAnimateProjects(false);
  }, [initialTab]);

  return (
    <>
      <div id="projects">
        <Container>
          <nav
            aria-label={`${labels.projects} / ${labels.about}`}
            className="mx-auto flex w-fit gap-1 rounded-xl border border-line bg-surface p-1.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04),var(--shadow)]"
          >
            {tabs.map(([tab, label]) => (
              <Link
                key={tab}
                aria-current={initialTab === tab ? "page" : undefined}
                href={tab === "projects" ? projectsPath(language) : homePath(language)}
                scroll={false}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200 ${
                  initialTab === tab
                    ? "bg-accent text-bg shadow-[0_2px_8px_rgb(0_0_0_/_0.28)]"
                    : "text-muted hover:bg-accent-soft hover:text-ink hover:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.04)]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </Container>
      </div>
      <div
        key={initialTab}
        className={initialTab === "about" ? "tab-panel-enter-from-left" : animateProjects ? "tab-panel-enter-from-right" : undefined}
      >
        {initialTab === "projects" ? projects : about}
      </div>
    </>
  );
}
