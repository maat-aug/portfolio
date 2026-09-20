import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProjectFeature } from "@/domain/project";

type FeatureGridProps = {
  heading: string;
  features: readonly ProjectFeature[];
};

export function FeatureGrid({ heading, features }: FeatureGridProps) {
  return (
    <section className="border-y border-line bg-surface/35 py-16 sm:py-20">
      <Container>
        <SectionHeading>{heading}</SectionHeading>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <li key={index} className="rounded-2xl border border-line bg-surface/70 p-6 transition-colors hover:border-accent/35 hover:bg-surface-raised">
              <span className="font-mono text-xs text-accent">0{index + 1}</span>
              <h3 className="mt-5 text-lg font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{feature.description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
