type ProseProps = {
  paragraphs: readonly string[];
  paragraphClassName?: string;
};

export function Prose({ paragraphs, paragraphClassName }: ProseProps) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={["max-w-[65ch] text-lg leading-relaxed text-muted", paragraphClassName].filter(Boolean).join(" ")}>
          {paragraph}
        </p>
      ))}
    </div>
  );
}
