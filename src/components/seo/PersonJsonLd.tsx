import { AUTHOR_NAME, SITE_URL, SOCIAL_LINKS } from "@/lib/config";

type PersonJsonLdProps = {
  description: string;
};

export function PersonJsonLd({ description }: PersonJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: SITE_URL,
    description,
    sameAs: [SOCIAL_LINKS.github],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
