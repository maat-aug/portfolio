"use client";

import { useState } from "react";
import { ImageDialog } from "@/components/project/ImageDialog";
import type { GalleryLabels } from "@/domain/site";

type ProjectImageViewerProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  labels: GalleryLabels;
  priority?: boolean;
};

export function ProjectImageViewer({ src, alt, width, height, labels, priority = false }: ProjectImageViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-[var(--shadow)] transition-transform duration-300 hover:-translate-y-1 hover:border-accent/45"
        aria-label={`${labels.expandImage}: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          style={{ maxWidth: width }}
          className="mx-auto w-full transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <span className="absolute bottom-4 right-4 rounded-lg border border-white/10 bg-bg/80 px-3 py-2 text-xs font-semibold text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
          {labels.expand}
        </span>
      </button>

      {open ? <ImageDialog src={src} alt={alt} width={width} height={height} labels={labels} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
