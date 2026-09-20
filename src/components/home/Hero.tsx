"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import type { HeroContent } from "@/domain/site";

type HeroProps = {
  content: HeroContent;
};

export function Hero({ content }: HeroProps) {
  const [easterEggActive, setEasterEggActive] = useState(false);
  const interactionCount = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const registerInteraction = () => {
    if (easterEggActive) return;

    interactionCount.current += 1;
    if (interactionCount.current < 5) return;

    interactionCount.current = 0;
    setEasterEggActive(true);
    resetTimer.current = setTimeout(() => setEasterEggActive(false), 3200);
  };

  return (
    <section className="relative pb-14 pt-14 sm:pb-20 sm:pt-20">
      <Container className="flex flex-col gap-10 sm:flex-row-reverse sm:items-center sm:gap-14">
        <div
          className={`hero-avatar relative shrink-0 self-start sm:self-auto ${easterEggActive ? "hero-avatar-easter-egg" : ""}`}
          onPointerEnter={(event) => {
            if (event.pointerType !== "touch") registerInteraction();
          }}
          onClick={registerInteraction}
        >
          <div aria-hidden="true" className="hero-avatar-glow absolute -inset-5 -z-10 rounded-full bg-accent/15 blur-2xl" />
          {easterEggActive ? (
            <span aria-hidden="true" className="hero-avatar-sparks">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : null}
          <img
            src="/img/matheus.jpg"
            alt={content.name}
            width={432}
            height={432}
            fetchPriority="high"
            decoding="async"
            className="hero-avatar-image size-32 rounded-full border-2 border-accent/45 object-cover shadow-[var(--shadow)] sm:size-48"
          />
        </div>
        <div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {content.headline}
          </h1>
          <div className="mt-7">
            <Prose paragraphs={content.intro} />
          </div>
        </div>
      </Container>
    </section>
  );
}
