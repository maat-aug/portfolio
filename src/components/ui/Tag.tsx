type TagProps = {
  label: string;
  variant?: "default" | "accent";
};

export function Tag({ label, variant = "default" }: TagProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
        variant === "accent"
          ? "border-accent/25 bg-accent-soft/65 text-ink"
          : "border-line bg-bg/50 text-muted"
      }`}
    >
      {label}
    </span>
  );
}
