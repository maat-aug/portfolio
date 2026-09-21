import type { Project } from "@/domain/project";

export const NINX: Project = {
  slug: "ninx",
  family: "Ninx",
  year: "2026",
  tags: ["C#", ".NET 10", "Azure SQL", "React", "Tauri"],
  cover: {
    src: "/img/ninx/dashboard.webp",
    width: 1600,
    height: 898,
    alt: {
      pt: "Início do Ninx, com o menu lateral da loja e os atalhos para estoque, venda, clientes, relatórios e assinatura",
      en: "Ninx home screen, with the store's side menu and shortcuts to inventory, sales, customers, reports and subscription",
    },
  },
  gallery: [
    {
      src: "/img/ninx/venda.webp",
      width: 1600,
      height: 899,
      alt: {
        pt: "Venda no balcão: campo de leitura do código de barras, os produtos do carrinho com quantidade e preço, e o total da compra",
        en: "Counter sale: the barcode field, the products in the cart with quantity and price, and the order total",
      },
    },
    {
      src: "/img/ninx/fiado.webp",
      width: 1600,
      height: 899,
      alt: {
        pt: "Escolha entre pagamento à vista e fiado, com o cliente e o comprador já selecionados",
        en: "Choosing between paying up front and store credit, with the customer and the buyer already selected",
      },
    },
    {
      src: "/img/ninx/assinatura.webp",
      width: 1600,
      height: 899,
      alt: {
        pt: "Fechamento da venda fiada: um QR Code que o cliente escaneia para assinar o documento da compra",
        en: "Closing a store-credit sale: a QR code the customer scans to sign the purchase document",
      },
    },
    {
      src: "/img/ninx/estoque.webp",
      width: 1600,
      height: 898,
      alt: {
        pt: "Estoque e produtos, com a contagem de itens normais, abaixo do mínimo e sem estoque, e a tabela de produtos",
        en: "Inventory and products, counting items at normal level, below minimum and out of stock, above the product table",
      },
    },
  ],
  content: {
    pt: {
      name: "Ninx",
      tagline: "Sistema de gestão comercial com controle digital de contas.",
      problem: [
        "Em muito comércio de bairro, o fiado ainda mora num caderno. Quem deve, quanto deve e desde quando são informações que existem na memória do dono e numa folha que molha, rasga ou some.",
        "O resultado é sempre o mesmo: dívida que ninguém cobra porque ninguém lembra, produto que acaba sem aviso, e fim de mês sem saber se o movimento virou lucro.",
        "O Ninx põe isso num sistema. Cada venda fica registrada, cada fiado gera um termo que o cliente assina pelo próprio celular, e o estoque baixa sozinho a cada compra.",
      ],
      features: [
        {
          title: "Venda no balcão",
          description:
            "Carrinho por leitor de código de barras, cálculo de troco na hora e baixa automática do estoque. O total é recalculado no servidor, a partir do preço cadastrado.",
        },
        {
          title: "Fiado com assinatura",
          description:
            "A venda fiado gera um termo com as partes, os itens e o saldo devedor. O cliente lê o QR code, assina no próprio celular e é a assinatura que libera a venda.",
        },
        {
          title: "Razão do cliente",
          description:
            "Total a fiado, total pago e saldo devedor por cliente, com cada venda e cada recibo listados. Quitar tudo de uma vez abate as vendas da mais antiga para a mais nova.",
        },
        {
          title: "Controle de estoque",
          description:
            "Produtos com código de barras, unidade de medida e validade, venda por peso, aviso de quantidade mínima, e um histórico de movimentação que registra entrada, venda, perda e estorno.",
        },
        {
          title: "Relatórios",
          description:
            "Onze visões sobre o movimento — curva ABC, margem, giro de estoque, idade dos recebíveis, desempenho por vendedor, clientes inativos — com exportação para planilha.",
        },
        {
          title: "Equipe e mais de um comércio",
          description:
            "Cada funcionário entra com o próprio login, e a interface mostra só o que o cargo dele permite. Quem tem mais de um ponto administra todos na mesma conta, com os dados de cada um isolados.",
        },
      ],
      audience: [
        "Mercearia, mercadinho, loja de bairro, distribuidora ou qualquer comércio que venda fiado e hoje controle isso no papel ou numa planilha.", "Funciona a partir de um ponto só e acompanha quem abre o segundo.",
      ],
      technical: [
        {
          heading: "Decisões que definem o sistema",
          bullets: [
            "Nada de financeiro é apagado ou sobrescrito: estorno insere um pagamento espelho negativo ligado ao original, e toda alteração de estoque emite uma linha de movimentação. A trilha é somente de inserção, e o saldo é sempre reconstruível.",
            "O comércio sai sempre do token, nunca do corpo ou da rota — o isolamento entre lojas não depende de o serviço lembrar de filtrar.",
            "A venda fiado não existe sem assinatura: o documento é gerado, assinado no celular do cliente e selado com hora, IP e dispositivo carimbados pelo servidor — evidência, não confiança.",
          ],
        },
        {
          heading: "Arquitetura",
          paragraphs: [
            "O sistema é dividido em repositórios por responsabilidade: a API, o cliente desktop, a página pública de assinatura e o cliente anterior em .NET MAUI Blazor Hybrid, mantido só como referência depois da migração para Tauri.",
            "O backend é uma solução .NET de oito projetos — Domain, Communication, Application, Data, Infra, Ioc, Api e Tests — em camadas de inspiração Clean Architecture, sem CQRS. As dependências apontam para dentro, e o projeto de API referencia apenas o Ioc: trocar uma implementação não toca no pipeline HTTP.",
          ],
        },
        {
          heading: "Back-end",
          bullets: [
            ".NET 10 e ASP.NET Core Web API, com controllers clássicos",
            "Entity Framework Core 10 sobre Azure SQL, mapeamento só por Fluent API",
            "Mapster no mapeamento de entidade para DTO",
            "FluentValidation resolvida por um filtro global, sem auto-validação",
            "BCrypt na senha e no código de redefinição",
            "iText7 convertendo o HTML do documento em PDF",
            "Brevo para e-mail transacional na redefinição de senha",
            "Swagger disponível em todos os ambientes, por decisão registrada",
            "Imagem Docker multiestágio, rodando como usuário não-root",
          ],
        },
        {
          heading: "Multi-inquilino e autorização",
          paragraphs: [
            "Cada comércio é um inquilino, e o identificador dele sai sempre do token — nunca do corpo ou da rota. Tentar alcançar dado de outro comércio responde 404, e não 403, para não revelar que o recurso existe. Há testes de integração só para isso.",
            "A autorização tem três níveis deliberadamente separados: o administrador de plataforma, verificado relendo o banco em vez de confiar no claim; o proprietário do comércio, que dispensa checagem granular dentro da própria loja; e as permissões, uma relação explícita entre cargo e chave de permissão.",
            "Esse desenho substituiu uma hierarquia por peso numérico, que foi reescrita justamente porque comparar pesos não expressa permissão. Sobre ele há uma guarda contra escalonamento de privilégio: ninguém cria ou edita um cargo concedendo permissão que não tem.",
          ],
        },
        {
          heading: "Cliente desktop",
          bullets: [
            "Tauri v2, que usa o WebView do sistema em vez de embarcar um navegador",
            "React 19 e TypeScript estrito, com erro de tipo barrando a geração do pacote",
            "Tailwind CSS v4 no formato CSS-first e componentes shadcn sobre primitivos Base UI",
            "TanStack Query no estado de servidor, React Hook Form com Zod na validação",
            "Chart.js nos relatórios e SheetJS na exportação para planilha",
            "Nenhum comando Rust próprio: a lógica fica toda em TypeScript, contra a API HTTP",
            "Atualização automática assinada por minisign, com aviso no login e nunca forçada",
          ],
        },
        {
          heading: "Interface pensada para o balcão",
          paragraphs: [
            "A raiz tipográfica é 18px em vez dos 16px padrão, e os componentes foram recalibrados para cima a partir disso: botão e campo mais altos, célula de tabela mais alta, cartão de navegação com ícone grande. É uma linha de CSS que aumenta o sistema inteiro, para quem usa o computador do balcão.",
            "O leitor de código de barras ganhou a armadilha de foco clássica de PDV: um ouvinte de teclado devolve o foco ao campo a cada tecla digitada fora de um campo de texto, e o produto entra tanto pelo Enter do leitor quanto por um envio automático com atraso, cobrindo leitor configurado sem terminador.",
            "Duas decisões de tela resumem o resto. Na escolha do cliente para venda fiado, quem já deve aparece com um selo dizendo quanto — a dívida é mostrada no instante em que a decisão de fiar está sendo tomada. E sair do ponto de venda com carrinho cheio passa por uma guarda que explica a consequência em português claro e lembra para onde o usuário queria ir.",
          ],
        },
        {
          heading: "Assinatura eletrônica",
          paragraphs: [
            "Os documentos não são código: os três templates vivem como linhas no banco e chegam por migração, então mudar layout é versionado junto com o esquema e publicado sem recompilar. Na venda, o servidor mescla os dados no template, gera o PDF e guarda os dois artefatos com um GUID público.",
            "A página de assinatura é HTML, CSS e JavaScript puros, sem build e sem gerenciador de pacotes. Só duas bibliotecas por CDN: pdf.js para rasterizar o documento e pdf-lib para gravar o traço no PDF — como caminho vetorial, não como imagem, o que mantém a tinta nítida em qualquer zoom. Em cima disso, escritos à mão: captura por Pointer Events, zoom por pinça, desfazer por traço e rascunho salvo no aparelho, caso o cliente feche a página no meio.",
            "A escolha de não usar framework foi deliberada. É uma página que o cliente final abre uma vez, no celular, a partir de um QR code. Um framework acrescentaria centenas de kilobytes e um passo de build para não resolver nada.",
            "Não há login: a credencial é a imprevisibilidade do GUID, que só chega a quem recebeu o código. Na confirmação, o servidor carimba a hora pelo próprio relógio, registra IP e dispositivo do signatário e sela essas evidências dentro do documento. É uma assinatura eletrônica com metadados probatórios, não uma assinatura digital com certificado ICP-Brasil — distinção que o sistema trata como requisito, não como detalhe.",
          ],
        },
        {
          heading: "Testes e publicação",
          bullets: [
            "189 testes em xUnit, entre serviço, validador, mapeamento e integração",
            "Integração sobre SQLite em memória, e não o provider InMemory, que não suporta as transações reais do Unit of Work",
            "Pipeline de teste remontado à mão, para não abrir tipo interno do código de produção",
            "GitHub Actions publica a imagem no Docker Hub e atualiza o Azure Container Apps",
            "As migrações rodam na esteira, com repetição enquanto o Azure SQL serverless acorda",
            "A regra de firewall que libera o runner é criada e removida dentro da própria execução",
          ],
        },
      ],
    },
    en: {
      name: "Ninx",
      tagline: "Business management system with digital credit tracking.",
      problem: [
        "In many neighborhood shops, store credit still lives in a paper notebook. Who owes what, and since when, exists only in the owner's memory and on a page that tears, gets wet or disappears.",
        "The outcome is always the same: debt nobody collects because nobody remembers, stock that runs out without warning, and a month that ends without knowing whether any of it turned a profit.",
        "Ninx moves that into a system. Every sale is recorded, every credit sale produces a document the customer signs on their own phone, and inventory is written down automatically on each purchase.",
      ],
      features: [
        {
          title: "Point of sale",
          description:
            "A barcode-driven cart, live change calculation and automatic inventory write-down. The total is recalculated on the server from the registered price.",
        },
        {
          title: "Signed store credit",
          description:
            "A credit sale produces a document with both parties, the items and the outstanding balance. The customer scans the QR code, signs on their own phone, and it is that signature that releases the sale.",
        },
        {
          title: "Customer ledger",
          description:
            "Total on credit, total paid and balance owed per customer, with every sale and receipt listed. Paying everything at once clears the sales from oldest to newest.",
        },
        {
          title: "Inventory control",
          description:
            "Products with barcode, unit of measure and expiry date, sale by weight, low-stock warnings, and a movement log recording intake, sale, loss and reversal.",
        },
        {
          title: "Reporting",
          description:
            "Eleven views over the business — ABC curve, margin, stock turnover, receivables aging, performance per salesperson, dormant customers — with spreadsheet export.",
        },
        {
          title: "Team and multiple shops",
          description:
            "Each employee signs in with their own account, and the interface only shows what their role allows. Owners with more than one shop manage all of them from one account, with each shop's data isolated.",
        },
      ],
      audience: [
        "Grocery stores, corner stores and small distributors — any retailer selling on credit and tracking it on paper or in a spreadsheet today.",
        "Works from a single location and scales to the second one.",
      ],
      technical: [
        {
          heading: "Decisions that define the system",
          bullets: [
            "Nothing financial is deleted or overwritten: a reversal inserts a negative mirror payment linked to the original, and every inventory change emits a movement row. The trail is insert-only, and any balance can be rebuilt from it.",
            "The shop always comes from the token, never from the body or the route — isolation between stores never depends on a service remembering to filter.",
            "A credit sale does not exist without a signature: the document is generated, signed on the customer's phone and sealed with the time, IP and device stamped by the server — evidence, not trust.",
          ],
        },
        {
          heading: "Architecture",
          paragraphs: [
            "The system is split into repositories by responsibility: the API, the desktop client, the public signing page, and the previous .NET MAUI Blazor Hybrid client, kept for reference after the move to Tauri.",
            "The backend is an eight-project .NET solution — Domain, Communication, Application, Data, Infra, Ioc, Api and Tests — layered along Clean Architecture lines, without CQRS. Dependencies point inward, and the API project references only Ioc: swapping an implementation never touches the HTTP pipeline.",
          ],
        },
        {
          heading: "Back-end",
          bullets: [
            ".NET 10 and ASP.NET Core Web API, with classic controllers",
            "Entity Framework Core 10 on Azure SQL, mapped entirely through the Fluent API",
            "Mapster for entity-to-DTO mapping",
            "FluentValidation resolved by a global filter, with no auto-validation",
            "BCrypt for passwords and for the password-reset code",
            "iText7 turning the document HTML into PDF",
            "Brevo for transactional email on password reset",
            "Swagger available in every environment, as a recorded decision",
            "Multi-stage Docker image, running as a non-root user",
          ],
        },
        {
          heading: "Multi-tenancy and authorization",
          paragraphs: [
            "Each shop is a tenant, and its identifier always comes from the token — never from the body or the route. Reaching for another shop's data answers 404 rather than 403, so the response never reveals that the resource exists. There are integration tests for exactly that.",
            "Authorization has three deliberately separate levels: the platform administrator, verified by re-reading the database instead of trusting the claim; the shop owner, who needs no granular check inside their own shop; and permissions, an explicit relation between a role and a permission key.",
            "That design replaced a numeric weight hierarchy, rewritten precisely because comparing weights does not express permission. On top of it sits a privilege-escalation guard: nobody creates or edits a role granting a permission they do not hold themselves.",
          ],
        },
        {
          heading: "Desktop client",
          bullets: [
            "Tauri v2, which uses the system WebView instead of bundling a browser",
            "React 19 and strict TypeScript, with a type error blocking the packaged build",
            "Tailwind CSS v4 in its CSS-first form, and shadcn components over Base UI primitives",
            "TanStack Query for server state, React Hook Form with Zod for validation",
            "Chart.js for reporting and SheetJS for spreadsheet export",
            "No custom Rust commands: all logic stays in TypeScript, against the HTTP API",
            "Automatic updates signed with minisign, announced at login and never forced",
          ],
        },
        {
          heading: "An interface built for the counter",
          paragraphs: [
            "The typographic root is 18px instead of the usual 16px, and components were recalibrated upward from there: taller buttons and inputs, taller table cells, navigation cards with large icons. It is one line of CSS that scales the whole system, for people working on the shop's counter computer.",
            "The barcode reader got the classic point-of-sale focus trap: a keyboard listener returns focus to the field on any keystroke made outside a text input, and a product is added either by the reader's Enter or by a delayed auto-submit, covering readers configured without a terminator.",
            "Two screen decisions sum up the rest. When picking a customer for a credit sale, anyone who already owes money is flagged with the amount — the debt is shown at the instant the decision to extend credit is being made. And leaving the point of sale with a full cart goes through a guard that states the consequence in plain language and remembers where the user was heading.",
          ],
        },
        {
          heading: "Electronic signature",
          paragraphs: [
            "The documents are not code: the three templates live as database rows and arrive through migrations, so a layout change is versioned with the schema and shipped without recompiling. On a sale, the server merges the data into the template, generates the PDF and stores both artifacts under a public GUID.",
            "The signing page is plain HTML, CSS and JavaScript — no build step and no package manager. Only two libraries over CDN: pdf.js to rasterize the document and pdf-lib to write the stroke into the PDF as a vector path rather than an image, which keeps the ink sharp at any zoom. Everything on top is hand-written: Pointer Events capture, pinch zoom, per-stroke undo, and a draft saved on the device in case the customer closes the page midway.",
            "Using no framework was a deliberate choice. It is a page the end customer opens once, on a phone, from a QR code. A framework would add hundreds of kilobytes and a build step to solve nothing.",
            "There is no login: the credential is the unpredictability of the GUID, which only reaches whoever received the code. On confirmation the server stamps the time from its own clock, records the signer's IP and device, and seals that evidence inside the document. It is an electronic signature with probative metadata, not a certificate-backed digital signature — a distinction the system treats as a requirement, not a footnote.",
          ],
        },
        {
          heading: "Testing and deployment",
          bullets: [
            "189 xUnit tests across services, validators, mappings and integration",
            "Integration runs on in-memory SQLite rather than the EF InMemory provider, which does not support the Unit of Work's real transactions",
            "The test pipeline is rebuilt by hand, to avoid exposing internal types of production code",
            "GitHub Actions publishes the image to Docker Hub and updates Azure Container Apps",
            "Migrations run in the pipeline, retrying while the serverless Azure SQL wakes up",
            "The firewall rule that lets the runner through is created and removed within the same run",
          ],
        },
      ],
    },
  },
};
