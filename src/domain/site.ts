export type PageMeta = {
  readonly title: string;
  readonly description: string;
};

export type NavigationLabels = {
  readonly projects: string;
  readonly about: string;
};

export type EasterEggLabels = {
  /** Usa `{n}` no lugar da contagem. */
  readonly destroyed: string;
  readonly controls: string;
  readonly restore: string;
  readonly move: string;
  readonly up: string;
  readonly down: string;
  readonly left: string;
  readonly right: string;
  readonly jump: string;
  readonly waterGun: string;
  readonly razorShell: string;
  readonly taunts: { readonly t5: string; readonly t15: string; readonly t30: string; readonly t60: string };
};

export type HeroContent = {
  readonly name: string;
  readonly headline: string;
  readonly intro: readonly string[];
  readonly easterEgg: EasterEggLabels;
};

export type ProjectsSectionLabels = {
  readonly readMore: string;
};

export type GalleryLabels = {
  readonly expand: string;
  readonly expandImage: string;
  readonly close: string;
  readonly previous: string;
  readonly next: string;
};

export type ProjectPageLabels = {
  readonly problemHeading: string;
  readonly featuresHeading: string;
  readonly audienceHeading: string;
  readonly technicalSummary: string;
  readonly technicalHint: string;
  readonly repositoryLabel: string;
  readonly backLabel: string;
  readonly gallery: GalleryLabels;
};

export type ExperienceRole = {
  readonly role: string;
  readonly employmentType: string;
  readonly period: string;
  readonly summary?: string;
};

export type ExperienceEntry = {
  readonly organization: string;
  readonly logoSrc: string;
  readonly location: string;
  readonly organizationPeriod?: string;
  readonly organizationStartedAt?: string;
  readonly roles: readonly ExperienceRole[];
};

export type StackGroup = {
  readonly label: string;
  readonly items: readonly string[];
};

export type AboutContent = {
  readonly experienceHeading: string;
  readonly experience: readonly ExperienceEntry[];
  readonly stackHeading: string;
  readonly stack: readonly StackGroup[];
  readonly resumeHeading: string;
  readonly resumeLabel: string;
  readonly resumeHref: string;
};

export type ControlLabels = {
  readonly selectLanguage: string;
};

export type FooterContent = {
  readonly copyright: string;
  readonly githubLabel: string;
  readonly emailLabel: string;
};

export type SiteContent = {
  readonly htmlLang: string;
  readonly navigation: NavigationLabels;
  readonly hero: HeroContent;
  readonly projects: ProjectsSectionLabels;
  readonly project: ProjectPageLabels;
  readonly about: AboutContent;
  readonly controls: ControlLabels;
  readonly footer: FooterContent;
  readonly meta: {
    readonly home: PageMeta;
    readonly projects: PageMeta;
  };
};
