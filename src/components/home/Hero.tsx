"use client";

import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import type { HeroContent } from "@/domain/site";

// Easter egg: só é baixado quando a foto começa a se desfazer.
const loadOshawott = () => import("./oshawott/OshawottMode");
const OshawottMode = lazy(loadOshawott);

const PHOTO_SRC = "/img/matheus.jpg";
const GRID = 12;
// Fração acumulada de pixels que já caíram em cada clique antes da foto se desfazer de vez.
const ERODE = [0.1, 0.22, 0.36, 0.52];
const CLICKS_TO_OPEN = ERODE.length + 1;
const PRELOAD_AT = 3;
const IDLE_RESET_MS = 2000;
const FADE_MS = 400;

type HeroProps = {
  content: HeroContent;
};

type Pixel = {
  readonly col: number;
  readonly row: number;
  /** Posição na fila de queda: 0 cai primeiro. */
  readonly order: number;
  readonly fall: CSSProperties;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// Pixels que tocam o círculo da foto, os de fora caindo primeiro (com um pouco de acaso).
function pixelGrid(): Pixel[] {
  const cells: Array<Omit<Pixel, "order"> & { score: number }> = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const x = (col + 0.5) / GRID - 0.5;
      const y = (row + 0.5) / GRID - 0.5;
      const dist = Math.hypot(x, y) * 2;
      if (dist > 1 + 1 / GRID) continue;
      cells.push({
        col,
        row,
        score: dist + rand(0, 0.35),
        fall: {
          "--dx": `${x * rand(40, 90) + rand(-10, 10)}px`,
          "--dy": `${rand(70, 120)}px`,
          "--rot": `${rand(-180, 180)}deg`,
        } as CSSProperties,
      });
    }
  }
  return cells.sort((a, b) => b.score - a.score).map(({ score: _score, ...cell }, order) => ({ ...cell, order }));
}

// Tranco a cada clique, mais forte conforme a foto se desfaz.
function crunch(wrapper: HTMLElement, stage: number) {
  wrapper.animate(
    [
      { scale: "1", rotate: "0deg", filter: "brightness(1.4)" },
      { scale: String(1 - 0.02 * stage), rotate: `${-1.2 * stage}deg`, offset: 0.25 },
      { scale: "1.01", rotate: `${0.8 * stage}deg`, offset: 0.6 },
      { scale: "1", rotate: "0deg", filter: "brightness(1)" },
    ],
    { duration: 280, easing: "ease-out" },
  );
}

export function Hero({ content }: HeroProps) {
  const [pixels, setPixels] = useState<Pixel[] | null>(null);
  const [stage, setStage] = useState(0);
  const [fading, setFading] = useState(false);
  const [avatar, setAvatar] = useState<HTMLElement | null>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const clicks = useRef(0);
  const resetTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    resetTimers.current.forEach(clearTimeout);
    resetTimers.current = [];
  };

  useEffect(() => clearTimers, []);

  const crumble = () => {
    if (avatar) return;
    if (!pixels) setPixels(pixelGrid());
    setFading(false);
    clearTimers();

    clicks.current += 1;
    setStage(Math.min(clicks.current, ERODE.length));
    if (clicks.current === PRELOAD_AT) void loadOshawott();
    if (clicks.current >= CLICKS_TO_OPEN) {
      setAvatar(avatarRef.current);
      return;
    }

    if (avatarRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      crunch(avatarRef.current, clicks.current);
    }
    // Parou de clicar: a foto volta inteira e a contagem recomeça.
    resetTimers.current = [
      setTimeout(() => setFading(true), IDLE_RESET_MS),
      setTimeout(() => {
        clicks.current = 0;
        setPixels(null);
        setStage(0);
        setFading(false);
      }, IDLE_RESET_MS + FADE_MS),
    ];
  };

  const crumbling = pixels !== null && stage > 0;
  const gone = crumbling ? Math.floor(ERODE[stage - 1]! * pixels.length) : 0;

  return (
    <section className="relative pb-14 pt-14 sm:pb-20 sm:pt-20">
      <Container className="flex flex-col gap-10 sm:flex-row-reverse sm:items-center sm:gap-14">
        <div ref={avatarRef} className="hero-avatar relative shrink-0 cursor-pointer self-start sm:self-auto" onClick={crumble}>
          <div aria-hidden="true" className="hero-avatar-glow absolute -inset-5 -z-10 rounded-full bg-accent/15 blur-2xl" />
          <img
            src={PHOTO_SRC}
            alt={content.name}
            width={432}
            height={432}
            fetchPriority="high"
            decoding="async"
            style={{ opacity: crumbling && !fading ? 0 : 1 }}
            className="hero-avatar-image size-32 rounded-full border-2 border-accent/45 object-cover shadow-[var(--shadow)] sm:size-48"
          />
          {crumbling ? (
            <div aria-hidden="true" className="absolute left-0 top-0 size-32 sm:size-48">
              {pixels.map((pixel) => (
                <span
                  key={`${pixel.col}-${pixel.row}`}
                  className={`hero-avatar-pixel ${pixel.order < gone ? "is-gone" : ""}`}
                  style={{
                    ...pixel.fall,
                    left: `${(pixel.col / GRID) * 100}%`,
                    top: `${(pixel.row / GRID) * 100}%`,
                    // Meio pixel a mais para não abrir frestas entre os quadrados.
                    width: `calc(${100 / GRID}% + 0.5px)`,
                    height: `calc(${100 / GRID}% + 0.5px)`,
                    backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                    backgroundImage: `url("${PHOTO_SRC}")`,
                    backgroundPosition: `${(pixel.col / (GRID - 1)) * 100}% ${(pixel.row / (GRID - 1)) * 100}%`,
                    // Círculo da foto no espaço do pixel: a borda continua redonda, até caindo.
                    clipPath: `circle(${(GRID / 2) * 100}% at ${(GRID / 2 - pixel.col) * 100}% ${(GRID / 2 - pixel.row) * 100}%)`,
                  }}
                />
              ))}
            </div>
          ) : null}
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
      {avatar ? (
        <Suspense fallback={null}>
          <OshawottMode avatar={avatar} labels={content.easterEgg} />
        </Suspense>
      ) : null}
    </section>
  );
}
