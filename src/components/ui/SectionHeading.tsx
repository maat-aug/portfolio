type SectionHeadingProps = {
  children: string;
};

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">{children}</h2>
  );
}
