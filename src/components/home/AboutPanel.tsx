import { ExperienceList } from "@/components/about/ExperienceList";
import { StackGrid } from "@/components/about/StackGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Language } from "@/domain/language";
import type { AboutContent } from "@/domain/site";

type AboutPanelProps = {
  about: AboutContent;
  language: Language;
};

export function AboutPanel({ about, language }: AboutPanelProps) {
  return (
    <>
      <section className="pt-12 sm:pt-16">
        <Container>
          <SectionHeading>{about.experienceHeading}</SectionHeading>
          <div className="mt-8">
            <ExperienceList entries={about.experience} language={language} renderedAt={new Date().toISOString()} />
          </div>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <SectionHeading>{about.stackHeading}</SectionHeading>
          <div className="mt-8">
            <StackGrid groups={about.stack} />
          </div>

          <div className="mt-16 flex flex-col items-center text-center">
            <SectionHeading>{about.resumeHeading}</SectionHeading>
            <a
              href={about.resumeHref}
              download
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-bg shadow-[0_4px_14px_rgb(242_162_83_/_0.2)] transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_18px_rgb(242_162_83_/_0.28)]"
            >
              <svg
                className="size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
              </svg>
              {about.resumeLabel}
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
