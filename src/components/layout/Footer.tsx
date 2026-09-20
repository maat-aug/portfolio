import { Container } from "@/components/ui/Container";
import type { Language } from "@/domain/language";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/lib/config";
import { siteContent } from "@/lib/site";

type FooterProps = {
  language: Language;
};

const FOOTER_LINK_CLASS = "footer-social-link inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-accent-soft hover:text-accent";

export function Footer({ language }: FooterProps) {
  const { footer } = siteContent(language);

  return (
      <footer className="mt-24 border-t border-line py-8">
        <Container className="flex flex-col items-center justify-between gap-4 text-sm sm:flex-row">
          <p className="text-muted">{footer.copyright}</p>
          <ul className="flex flex-wrap items-center justify-center gap-5">
            <li>
              <a href={SOCIAL_LINKS.github} aria-label={footer.githubLabel} className={FOOTER_LINK_CLASS} rel="me noreferrer" target="_blank">
                <svg className="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.49 0-.24-.01-1.05-.01-1.9-2.78.62-3.37-1.2-3.37-1.2-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.54 1.06 1.54 1.06.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.04-2.75-.1-.26-.45-1.31.1-2.74 0 0 .85-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.1c.85 0 1.7.12 2.5.35 1.9-1.33 2.75-1.05 2.75-1.05.55 1.43.2 2.48.1 2.74.65.72 1.04 1.63 1.04 2.75 0 3.94-2.35 4.8-4.58 5.06.36.32.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.6.69.49A10.24 10.24 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
                </svg>
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} aria-label={footer.emailLabel} className={FOOTER_LINK_CLASS}>
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </a>
            </li>
          </ul>
        </Container>
      </footer>
  );
}
