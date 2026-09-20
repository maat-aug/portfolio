"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import type { TechnicalSection } from "@/domain/project";
import type { ProjectPageLabels } from "@/domain/site";

type TechnicalDetailsProps = {
  sections: readonly TechnicalSection[];
  labels: ProjectPageLabels;
  repositoryUrl?: string;
};

export function TechnicalDetails({ sections, labels, repositoryUrl }: TechnicalDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [animationCycle, setAnimationCycle] = useState(0);
  const [closingHeight, setClosingHeight] = useState<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const collapseFrame = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (collapseFrame.current) cancelAnimationFrame(collapseFrame.current);
  }, []);

  const toggleDetails = () => {
    if (isOpen) {
      const contentHeight = contentRef.current?.scrollHeight ?? 0;
      setIsOpen(false);
      setIsClosing(true);
      setClosingHeight(contentHeight);
      collapseFrame.current = requestAnimationFrame(() => setClosingHeight(0));

      // Fechar recolhe muito conteúdo de uma vez. Sem reposicionar, o leitor fica olhando para o
      // rodapé; levamos ele para a seção anterior, que é de onde ele desceu.
      const target = sectionRef.current?.previousElementSibling ?? sectionRef.current;
      target?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });

      closeTimer.current = setTimeout(() => {
        setIsClosing(false);
        setClosingHeight(null);
      }, 280);
      return;
    }

    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (collapseFrame.current) cancelAnimationFrame(collapseFrame.current);
    setIsClosing(false);
    setClosingHeight(null);
    setAnimationCycle((cycle) => cycle + 1);
    setIsOpen(true);
  };

  const showContent = isOpen || isClosing;

  return (
    <section ref={sectionRef} className="pb-16 pt-0 sm:pb-20">
      <Container>
        <details open={showContent} className="group rounded-2xl border border-line bg-surface/80 shadow-[var(--shadow)]">
          <summary
            onClick={(event) => {
              event.preventDefault();
              toggleDetails();
            }}
            className="flex items-center justify-between gap-6 p-6 sm:p-8"
          >
            <span>
              <span className="block text-lg font-semibold text-ink">{labels.technicalSummary}</span>
              <span className="mt-1 block text-sm text-muted">{labels.technicalHint}</span>
            </span>
            <svg
              className="size-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
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
          </summary>

          {showContent ? (
            <div
              key={animationCycle}
              ref={contentRef}
              style={isClosing && closingHeight !== null ? { height: closingHeight } : undefined}
              className={`technical-details-content space-y-10 border-t border-line p-6 sm:p-8 ${isClosing ? "technical-details-content--closing" : "technical-details-content--opening"}`}
            >
              {sections.map((section, sectionIndex) => (
                <article key={sectionIndex}>
                  <h3 className="text-base font-semibold text-ink">{section.heading}</h3>

                  {section.paragraphs ? (
                    <div className="mt-3 space-y-3">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index} className="max-w-[82ch] leading-relaxed text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {section.bullets ? (
                    <ul className="mt-3 space-y-2">
                      {section.bullets.map((bullet, index) => (
                        <li key={index} className="flex gap-3 text-muted">
                          <span aria-hidden="true" className="select-none text-accent">
                            &middot;
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}

              {repositoryUrl ? (
                <a
                  href={repositoryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 font-medium text-accent underline-offset-4 hover:underline"
                >
                  {labels.repositoryLabel}
                </a>
              ) : null}
            </div>
          ) : null}
        </details>
      </Container>
    </section>
  );
}
