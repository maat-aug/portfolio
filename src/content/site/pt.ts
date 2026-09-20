import type { SiteContent } from "@/domain/site";

export const PT_SITE_CONTENT: SiteContent = {
  htmlLang: "pt-BR",
  navigation: {
    projects: "Projetos",
    about: "Sobre mim",
  },
  hero: {
    name: "Matheus Augusto",
    headline: "Olá! Eu sou o Matheus.",
    intro: [
      "Desenvolvo soluções sob medida tanto para a presença da sua empresa na internet quanto para a operação interna que ficou complexa demais. Crio sites, sistemas de gestão, integro os serviços do seu dia a dia e automatizo tarefas repetitivas, cuidando de toda a arquitetura do projeto: desde a forma como seus dados são organizados e a regra de negócio, até a tela final que o usuário acessa.",
    ],
  },
  projects: {
    readMore: "Entenda melhor",
  },
  project: {
    problemHeading: "O que resolve",
    featuresHeading: "Como funciona",
    audienceHeading: "Para quem serve",
    technicalSummary: "Detalhes técnicos",
    technicalHint: "Arquitetura, stack e decisões",
    repositoryLabel: "Ver repositório",
    backLabel: "Voltar para os projetos",
    gallery: {
      expand: "Ampliar",
      expandImage: "Ampliar imagem",
      close: "Fechar imagem",
      previous: "Imagem anterior",
      next: "Próxima imagem",
    },
  },
  about: {
    experienceHeading: "Experiência",
    experience: [
      {
        organization: "Bit Tech",
        logoSrc: "/img/companies/bit-pagg.jpg",
        location: "Brasil · Híbrido",
        organizationStartedAt: "2025-12",
        roles: [{
          role: "Analista de Sistemas",
          employmentType: "Tempo integral",
          period: "dez de 2025 — atual",
        }],
      },
      {
        organization: "Gruppy",
        logoSrc: "/img/companies/gruppy.jpg",
        location: "Brasil · Híbrido",
        organizationPeriod: "6 meses",
        roles: [
          { role: "Desenvolvedor Full-Stack", employmentType: "Tempo integral", period: "mai de 2025 — out de 2025" },
        ],
      },
      {
        organization: "ZEMA",
        logoSrc: "/img/companies/zema.jpg",
        location: "Brasil · Híbrido",
        organizationPeriod: "2 anos e 2 meses",
        roles: [
          { role: "Analista de Redes e Telecomunicações Jr", employmentType: "Tempo integral", period: "mar de 2024 — abr de 2025" },
          { role: "Estagiário de Redes e Telecom", employmentType: "Estágio", period: "mar de 2023 — fev de 2024" },
        ],
      },
    ],
    stackHeading: "Stack",
    stack: [
      { label: "Back-end", items: ["C#", ".NET", "ASP.NET Core", "Entity Framework Core", "SQL Server"] },
      { label: "Front-end", items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Tauri"] },
      { label: "Infraestrutura", items: ["Docker", "Git", "GitHub Actions", "Azure"] },
      { label: "Outros", items: ["Python", "Node.js"] },
    ],
    resumeHeading: "Quer me conhecer melhor?",
    resumeLabel: "Baixar currículo",
    resumeHref: "/cv-matheus-augusto.pdf",
  },
  controls: {
    selectLanguage: "Selecionar idioma",
  },
  footer: {
    copyright: "© 2026 Matheus Augusto",
    githubLabel: "GitHub",
    emailLabel: "E-mail",
  },
  meta: {
    home: {
      title: "Matheus Augusto",
      description:
        "Desenvolvedor de sistemas. Construo software sob medida: sistemas de gestão, APIs e integrações e automações. C#, .NET, React e SQL Server.",
    },
    projects: {
      title: "Projetos — Matheus Augusto",
      description:
        "Sistemas que construí do banco de dados à tela: gestão de comércio, geração de dados de teste e automação de download de vídeo.",
    },
  },
};
