"use client";

import { useEffect, useRef } from "react";
import type { GalleryLabels } from "@/domain/site";

type ImageDialogProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  labels: GalleryLabels;
  /** Lado de onde a imagem entra. Ausente na primeira abertura, quando não há troca a animar. */
  direction?: "previous" | "next";
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export function ImageDialog({ src, alt, width, height, labels, direction, onClose, onPrevious, onNext }: ImageDialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open) dialog.showModal();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label={alt}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") onPrevious?.();
        if (event.key === "ArrowRight") onNext?.();
      }}
      className="h-full max-h-none w-full max-w-none items-center justify-center bg-transparent p-4 text-ink backdrop:bg-black/85 backdrop:backdrop-blur-sm open:flex sm:p-8"
    >
      <div className="relative max-h-full max-w-6xl">
        <img
          key={src}
          src={src}
          alt={alt}
          width={width}
          height={height}
          decoding="async"
          className={`max-h-[85vh] w-auto rounded-xl border border-white/10 shadow-2xl ${direction ? `gallery-image-${direction}` : ""}`}
        />
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 grid size-10 place-items-center rounded-full border border-white/10 bg-surface text-lg text-ink shadow-[var(--shadow)] transition-colors hover:bg-accent hover:text-bg"
          aria-label={labels.close}
        >
          &times;
        </button>

        {onPrevious && onNext ? (
          <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
            <button
              type="button"
              onClick={onPrevious}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-bg/80 text-xl text-ink backdrop-blur transition-colors hover:bg-accent hover:text-bg"
              aria-label={labels.previous}
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={onNext}
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-bg/80 text-xl text-ink backdrop-blur transition-colors hover:bg-accent hover:text-bg"
              aria-label={labels.next}
            >
              &rsaquo;
            </button>
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
