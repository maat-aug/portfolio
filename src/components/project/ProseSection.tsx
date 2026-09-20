import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { SectionHeading } from "@/components/ui/SectionHeading";

type ProseSectionProps = {
  heading: string;
  paragraphs: readonly string[];
};

export function ProseSection({ heading, paragraphs }: ProseSectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading>{heading}</SectionHeading>
        <div className="mt-6">
          <Prose paragraphs={paragraphs} paragraphClassName="max-w-[82ch]" />
        </div>
      </Container>
    </section>
  );
}
