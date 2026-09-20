type ScreenshotProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
};

export function Screenshot({ src, alt, width, height, priority }: ScreenshotProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ maxWidth: width }}
      className="mx-auto w-full rounded-xl border border-line bg-surface shadow-[var(--shadow)]"
    />
  );
}
