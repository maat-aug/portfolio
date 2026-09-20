import type { Localized } from "@/domain/language";

export type ProjectImage = {
  readonly src: string;
  readonly alt: Localized<string>;
  /** Dimensões reais do arquivo. Reservam o espaço certo antes do download e evitam o salto de layout. */
  readonly width: number;
  readonly height: number;
};

export type ProjectFeature = {
  readonly title: string;
  readonly description: string;
};

export type TechnicalSection = {
  readonly heading: string;
  readonly paragraphs?: readonly string[];
  readonly bullets?: readonly string[];
};

export type ProjectContent = {
  readonly name: string;
  readonly tagline: string;
  readonly problem: readonly string[];
  readonly features: readonly ProjectFeature[];
  readonly audience: readonly string[];
  readonly technical: readonly TechnicalSection[];
};

export type Project = {
  readonly slug: string;
  /** Nome da família, quando o projeto é uma peça de um conjunto maior. O mesmo selo nos dois
   *  cartões é o que liga um ao outro na listagem. */
  readonly family?: string;
  readonly year: string;
  readonly tags: readonly string[];
  readonly cover: ProjectImage;
  readonly gallery: readonly ProjectImage[];
  readonly repositoryUrl?: string;
  readonly content: Localized<ProjectContent>;
};
