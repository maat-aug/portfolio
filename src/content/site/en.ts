import type { SiteContent } from "@/domain/site";

export const EN_SITE_CONTENT: SiteContent = {
  htmlLang: "en",
  navigation: {
    projects: "Projects",
    about: "About me",
  },
  hero: {
    name: "Matheus Augusto",
    headline: "Hi! I'm Matheus.",
    intro: [
    "I build tailored solutions for both your online presence and complex internal operations. From creating websites and management systems to integrating your daily tools and automating repetitive tasks, I handle the entire architecture: from data structure and business rules down to the final screen the user sees.",
    ],
  },
  projects: {
    readMore: "See the case",
  },
  project: {
    problemHeading: "The problem",
    featuresHeading: "How it works",
    audienceHeading: "Who it is for",
    technicalSummary: "Technical details",
    technicalHint: "Architecture, stack and trade-offs",
    repositoryLabel: "View repository",
    backLabel: "Back to projects",
    gallery: {
      expand: "Expand",
      expandImage: "Expand image",
      close: "Close image",
      previous: "Previous image",
      next: "Next image",
    },
  },
  about: {
    experienceHeading: "Experience",
    experience: [
      {
        organization: "Bit Tech",
        logoSrc: "/img/companies/bit-pagg.jpg",
        location: "Brazil · Hybrid",
        organizationStartedAt: "2025-12",
        roles: [{
          role: "Systems Analyst",
          employmentType: "Full-time",
          period: "Dec 2025 — Present",
        }],
      },
      {
        organization: "Gruppy",
        logoSrc: "/img/companies/gruppy.jpg",
        location: "Brazil · Hybrid",
        organizationPeriod: "6 months",
        roles: [{ role: "Full-stack Developer", employmentType: "Full-time", period: "May 2025 — Oct 2025" }],
      },
      {
        organization: "ZEMA",
        logoSrc: "/img/companies/zema.jpg",
        location: "Brazil · Hybrid",
        organizationPeriod: "2 years 2 months",
        roles: [
          { role: "Junior Network and Telecommunications Analyst", employmentType: "Full-time", period: "Mar 2024 — Apr 2025" },
          { role: "Network and Telecommunications Intern", employmentType: "Internship", period: "Mar 2023 — Feb 2024" },
        ],
      },
    ],
    stackHeading: "Stack",
    stack: [
      { label: "Back-end", items: ["C#", ".NET", "ASP.NET Core", "Entity Framework Core", "SQL Server"] },
      { label: "Front-end", items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Tauri"] },
      { label: "Infrastructure", items: ["Docker", "Git", "GitHub Actions", "Azure"] },
      { label: "Other", items: ["Python", "Node.js"] },
    ],
    resumeHeading: "Want to know me better?",
    resumeLabel: "Download resume",
    resumeHref: "/cv-matheus-augusto-en.pdf",
  },
  controls: {
    selectLanguage: "Select language",
  },
  footer: {
    copyright: "© 2026 Matheus Augusto",
    githubLabel: "GitHub",
    emailLabel: "Email",
  },
  meta: {
    home: {
      title: "Matheus Augusto",
      description:
        "Matheus Augusto's portfolio: projects, experience and custom software solutions built with C#, .NET, React and SQL Server.",
    },
    projects: {
      title: "Projects — Matheus Augusto",
      description:
        "Systems I built from the database to the screen: retail management, test data generation and video download automation.",
    },
  },
};
