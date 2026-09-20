export type PageMeta = {
  readonly title: string;
  readonly description: string;
};

export type NavigationLabels = {
  readonly projects: string;
  readonly about: string;
};

export type HeroContent = {
  readonly name: string;
  readonly headline: string;
  readonly intro: readonly string[];
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
