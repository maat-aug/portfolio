"use client";

import { useState } from "react";
import { ImageDialog } from "@/components/project/ImageDialog";
import { Container } from "@/components/ui/Container";
import type { Language } from "@/domain/language";
import type { ProjectImage } from "@/domain/project";
import type { GalleryLabels } from "@/domain/site";

type ProjectGalleryProps = {
  images: readonly ProjectImage[];
  language: Language;
  labels: GalleryLabels;
};

export function ProjectGallery({ images, language, labels }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"previous" | "next" | undefined>(undefined);
  const selectedImage = selectedIndex === null ? null : images[selectedIndex];

  const open = (index: number) => {
    setDirection(undefined);
    setSelectedIndex(index);
  };

  const step = (offset: number) => {
    setDirection(offset > 0 ? "next" : "previous");
    setSelectedIndex((index) => (index === null ? null : (index + offset + images.length) % images.length));
  };

  if (images.length === 0) return null;

  return (
    <section className="border-y border-line bg-surface/30 py-16 sm:py-20">
      <Container>
        <ul className={images.length > 1 ? "grid gap-5 sm:grid-cols-2" : "flex justify-center"}>
          {images.map((image, index) => (
            <li key={image.src} className="[content-visibility:auto]">
              <button
                type="button"
                onClick={() => open(index)}
                aria-label={`${labels.expandImage}: ${image.alt[language]}`}
                className="group relative block aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/45"
              >
                <img
                  src={image.src}
                  alt={image.alt[language]}
                  width={image.width}
                  height={image.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
                />
                <span className="absolute bottom-4 right-4 rounded-lg border border-white/10 bg-bg/80 px-3 py-2 text-xs font-semibold text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  {labels.expand}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Container>

      {selectedImage ? (
        <ImageDialog
          src={selectedImage.src}
          alt={selectedImage.alt[language]}
          width={selectedImage.width}
          height={selectedImage.height}
          labels={labels}
          direction={direction}
          onClose={() => setSelectedIndex(null)}
          onPrevious={images.length > 1 ? () => step(-1) : undefined}
          onNext={images.length > 1 ? () => step(1) : undefined}
        />
      ) : null}
    </section>
  );
}
