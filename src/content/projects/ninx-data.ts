import type { Project } from "@/domain/project";

export const NINX_DATA: Project = {
  slug: "ninx-data",
  family: "Ninx",
  year: "2026",
  tags: ["SQL Server", "EF Core", "LINQ", "Chart.js", "SheetJS"],
  cover: {
    src: "/img/ninx-data/relatorios.png",
    width: 1917,
    height: 1078,
    alt: {
      pt: "Tela de relatórios do Ninx",
      en: "Ninx reporting screen",
    },
  },
  gallery: [
    {
      src: "/img/ninx-data/curva-abc.png",
      width: 1438,
      height: 766,
      alt: {
        pt: "Curva ABC, classificando os produtos por participação acumulada no faturamento",
        en: "ABC curve, classifying products by cumulative share of revenue",
      },
    },
    {
      src: "/img/ninx-data/aging.png",
      width: 1453,
      height: 767,
      alt: {
        pt: "Aging de recebíveis, com a dívida do fiado distribuída por faixa de atraso",
        en: "Receivables aging, with store-credit debt split by overdue bracket",
      },
    },
    {
      src: "/img/ninx-data/margem.png",
      width: 1423,
      height: 747,
      alt: {
        pt: "Relatório de margem por produto, comparando receita, lucro e percentual de margem",
        en: "Margin by product report, comparing revenue, profit and margin percentage",
      },
    },
    {
      src: "/img/ninx-data/limite-credito.png",
      width: 1448,
      height: 748,
      alt: {
        pt: "Uso do limite de crédito por cliente, com valores de limite, saldo devedor e percentual utilizado",
        en: "Credit limit usage per customer, showing limit, outstanding balance and percentage used",
      },
    },
    {
      src: "/img/ninx-data/clientes-inativos.png",
      width: 1458,
      height: 660,
      alt: {
        pt: "Relatório de clientes inativos com a data da última compra",
        en: "Inactive customers report with each customer's last purchase date",
      },
    },
    {
      src: "/img/ninx-data/pico-vendas.png",
      width: 1450,
      height: 770,
      alt: {
        pt: "Gráfico de pico de vendas por hora",
        en: "Sales peak by hour chart",
      },
    },
  ],
  content: {
    pt: {
      name: "Ninx · Dados e relatórios",
      tagline:
        "A camada de dados por trás do Ninx.",
      problem: [
        "Registrar venda é a parte fácil. O difícil é o que vem depois: responder quanto entrou, quanto ainda é dívida, qual produto sustenta a loja e qual só ocupa prateleira — em cima de dados que mudam o tempo todo.",
        "Num sistema mal modelado essas perguntas ficam sem resposta confiável. O produto muda de preço e o relatório do mês passado muda junto. Um estorno apaga a linha e o total do dia não fecha mais. Dois caixas vendem o mesmo último item.",
        "Esta página é sobre essa metade do Ninx: como o esquema foi desenhado para que o passado não seja reescrito, e como onze consultas transformam essas linhas em decisão de balcão.",
      ],
      features: [
        {
          title: "Movimento do dia",
          description:
            "Faturamento do período, quebra por forma de pagamento, produtos mais vendidos, itens abaixo do mínimo e cancelamentos, com o corte de datas vindo de quem pergunta.",
        },
        {
          title: "Curva ABC",
          description:
            "Produtos ordenados por faturamento e classificados pela participação acumulada: A até 80%, B até 95%, C no resto. É a resposta para o que repor primeiro quando o dinheiro é curto.",
        },
        {
          title: "Margem e giro",
          description:
            "Margem por produto e por categoria, cruzando preço de venda com preço de custo, e giro de estoque para separar o que vende do que está parado ocupando capital.",
        },
        {
          title: "Aging de recebíveis",
          description:
            "A dívida do fiado distribuída em até 30 dias, de 31 a 60 e acima de 60, com valor e quantidade por faixa. Mostra não só quanto se tem a receber, mas há quanto tempo.",
        },
        {
          title: "Clientes e limite",
          description:
            "Clientes inativos a partir de um número de dias que o comerciante escolhe, e uso do limite de crédito por cliente: quem está perto do teto antes de fiar de novo.",
        },
        {
          title: "Pico, vendedor e loja",
          description:
            "Vendas por hora e por dia da semana para escalar gente no horário certo, desempenho por vendedor, e comparativo entre lojas para quem tem mais de um ponto.",
        },
      ],
      audience: [
        "Para o comerciante que já registra tudo e agora precisa decidir com base nisso: o que repor primeiro quando o dinheiro é curto, quem deve há mais tempo, qual produto sustenta a loja e qual só ocupa prateleira.",
        "Quem administra mais de um ponto compara as lojas pelos mesmos números, no mesmo corte de datas.",
      ],
      technical: [
        {
          heading: "Modelagem de dados",
          paragraphs: [
            "São 23 tabelas em cinco grupos: identidade e permissões, plano de assinatura, catálogo e estoque, clientes e vendas, documentos e assinaturas. O identificador do comércio desce até as tabelas operacionais em vez de ser deduzido por junção, e as chaves únicas do dia a dia são únicas por comércio, não globais: dois comerciantes podem usar o mesmo código de barras, e o mesmo CPF pode ser cliente de duas lojas.",
            "O vínculo entre pessoa e loja é uma tabela própria que carrega o cargo, então a mesma pessoa atua em várias lojas com papel diferente em cada uma. O cargo, por sua vez, tem comércio nulo quando é global, e as permissões são uma relação explícita entre cargo e chave, não um campo de nível.",
            "O estoque é uma tabela separada do produto, em um para um. A separação existe para isolar a coluna de versão usada no controle de concorrência: o produto muda de nome e preço com frequência, a linha que disputa a venda do último item não deveria mudar junto.",
          ],
          bullets: [
            "Item de venda guarda retrato do produto — nome, código, unidade e preço no instante da venda",
            "Termo de abertura de conta é versionado por cliente, com status e limite de crédito próprios: o histórico do limite é reconstruível",
            "Pessoa autorizada carrega as datas de autorização e de revogação, ambas amarradas à assinatura do termo que a lista",
            "Uma tabela de assinatura serve aos quatro tipos de documento, com chave estrangeira exclusiva: ou venda, ou termo de abertura, nunca os dois",
            "O GUID do documento não é único de propósito — um recibo de quitação global cobre várias vendas de uma vez",
            "Os modelos de documento são linhas no banco, versionados por migração, não arquivos no código",
            "Uma tabela está reservada para integração futura de mensageria e ainda não tem uso",
          ],
        },
        {
          heading: "Como as consultas rodam",
          bullets: [
            "Agregação acontece no banco: agrupamento, soma e contagem viram SQL, não laço em memória",
            "Toda leitura analítica é sem rastreamento, para nenhum relatório sujar o change tracker",
            "As consultas projetam direto no objeto de resposta, então nenhuma coluna desnecessária atravessa a rede",
            "Soma sobre coleção possivelmente vazia é tipada como anulável e cai para zero, em vez de estourar",
            "O recorte por comércio entra em toda consulta analítica pelo identificador do token, nunca por parâmetro da requisição",
            "Classificação da curva ABC e distribuição do aging por faixa são o único passo em memória, sobre um conjunto já reduzido",
          ],
        },
        {
          heading: "Os onze relatórios",
          bullets: [
            "Painel do período — faturamento, formas de pagamento, mais vendidos, estoque baixo e cancelamentos",
            "Curva ABC — participação acumulada no faturamento, com corte em 80% e 95%",
            "Margem — por produto e por categoria, sobre preço de custo e de venda",
            "Aging de recebíveis — até 30, de 31 a 60 e acima de 60 dias, com valor e quantidade",
            "Desempenho por vendedor — o que cada usuário registrou no período",
            "Pico de vendas — por hora do dia e por dia da semana",
            "Clientes inativos — a partir de um número de dias sem comprar, escolhido na consulta",
            "Uso do limite de crédito — quanto de cada limite já está comprometido",
            "Giro de estoque — o que sai e o que fica parado",
            "Produtos vencendo — dentro de um prazo escolhido na consulta",
            "Comparativo entre comércios — para quem administra mais de um ponto",
          ],
        },
        {
          heading: "Guardas e limites",
          paragraphs: [
            "Toda consulta com período tem intervalo máximo de 731 dias, cerca de dois anos. Não é número arbitrário: sem esse teto, um pedido com data de início em 1900 varre a tabela inteira e derruba o tempo de resposta para todo mundo no mesmo banco.",
            "Os parâmetros que o comerciante escolhe — dias sem comprar, prazo de vencimento — são validados antes de virar consulta, e rejeitam zero e negativo com mensagem em português. A validação fica em regras declaradas por requisição e resolvidas por um filtro global, então nenhuma consulta depende de o serviço lembrar de checar.",
          ],
        },
        {
          heading: "Do número à decisão",
          paragraphs: [
            "No cliente desktop, cada relatório vira gráfico em Chart.js e tabela, e sai para planilha por SheetJS: o comerciante leva o recorte para onde já trabalha, sem depender de exportação no servidor.",
            "Gerar a planilha no cliente é escolha consciente. O dado já chegou à tela, então montar o arquivo ali evita uma segunda ida ao banco e um endpoint a mais para manter.",
          ],
        },
      ],
    },
    en: {
      name: "Ninx · Data and reporting",
      tagline:
        "The data layer behind Ninx.",
      problem: [
        "Recording a sale is the easy part. The hard part comes after: answering how much came in, how much is still owed, which product carries the shop and which one only takes up shelf space — on top of data that keeps changing.",
        "In a poorly modeled system those questions have no trustworthy answer. A product's price changes and last month's report changes with it. A refund deletes the row and the day's total stops adding up. Two cashiers sell the same last unit.",
        "This page is about that half of Ninx: how the schema was designed so the past is never rewritten, and how eleven queries turn those rows into decisions at the counter.",
      ],
      features: [
        {
          title: "The day's activity",
          description:
            "Revenue for the period, a breakdown by payment method, best sellers, items below minimum and cancellations, with the date range coming from whoever asks.",
        },
        {
          title: "ABC curve",
          description:
            "Products ranked by revenue and classified by cumulative share: A up to 80%, B up to 95%, C for the rest. It answers what to restock first when cash is short.",
        },
        {
          title: "Margin and turnover",
          description:
            "Margin per product and per category, crossing selling price with cost price, and stock turnover to separate what sells from what sits there tying up capital.",
        },
        {
          title: "Receivables aging",
          description:
            "Store-credit debt split into up to 30 days, 31 to 60 and over 60, with amount and count per bracket. It shows not only how much is owed, but for how long.",
        },
        {
          title: "Customers and limits",
          description:
            "Inactive customers from a number of days the merchant chooses, and credit limit usage per customer: who is close to the ceiling before selling on credit again.",
        },
        {
          title: "Peak, seller and store",
          description:
            "Sales by hour and by weekday to staff the right shift, performance per seller, and a comparison across stores for owners with more than one location.",
        },
      ],
      audience: [
        "For the shopkeeper who already records every sale and now has to decide from it: what to restock first when cash is short, who has owed the longest, which product carries the shop and which one only takes up shelf space.",
        "Owners running more than one location compare their stores on the same numbers, over the same date range.",
      ],
      technical: [
        {
          heading: "Data modeling",
          paragraphs: [
            "Twenty-three tables in five groups: identity and permissions, subscription plan, catalog and inventory, customers and sales, documents and signatures. The store identifier reaches down into the operational tables instead of being inferred through joins, and everyday unique keys are unique per store rather than globally: two merchants may use the same barcode, and the same national ID may be a customer of two shops.",
            "The link between a person and a store is a table of its own carrying the role, so the same person works in several stores with a different role in each. A role, in turn, has a null store when it is global, and permissions are an explicit relation between role and key, not a level field.",
            "Inventory is a table separate from the product, one to one. The split exists to isolate the version column used for concurrency control: a product changes name and price often, and the row two cashiers race over for the last unit should not change with it.",
          ],
          bullets: [
            "A sale item keeps a snapshot of the product — name, code, unit and price at the moment of sale",
            "The account opening term is versioned per customer, with its own status and credit limit: the limit's history is reconstructable",
            "An authorized person carries both authorization and revocation dates, each tied to the signature of the term that lists them",
            "One signature table serves all four document types, with an exclusive foreign key: either a sale or an opening term, never both",
            "The document GUID is deliberately not unique — a global settlement receipt covers several sales at once",
            "Document templates are rows in the database, versioned by migration, not files in the code",
            "One table is reserved for a future messaging integration and has no use yet",
          ],
        },
        {
          heading: "How the queries run",
          bullets: [
            "Aggregation happens in the database: grouping, sums and counts become SQL, not loops in memory",
            "Every analytical read is untracked, so no report pollutes the change tracker",
            "Queries project straight into the response object, so no unnecessary column crosses the wire",
            "Sums over possibly empty collections are typed as nullable and fall back to zero instead of throwing",
            "The per-store cut enters every analytical query through the identifier in the token, never through a request parameter",
            "ABC classification and aging bracket distribution are the only in-memory step, over an already reduced set",
          ],
        },
        {
          heading: "The eleven reports",
          bullets: [
            "Period dashboard — revenue, payment methods, best sellers, low stock and cancellations",
            "ABC curve — cumulative share of revenue, cut at 80% and 95%",
            "Margin — per product and per category, over cost and selling price",
            "Receivables aging — up to 30, 31 to 60 and over 60 days, with amount and count",
            "Seller performance — what each user recorded in the period",
            "Sales peaks — by hour of day and by weekday",
            "Inactive customers — from a number of days without buying, chosen per query",
            "Credit limit usage — how much of each limit is already committed",
            "Stock turnover — what moves and what sits still",
            "Expiring products — within a window chosen per query",
            "Store comparison — for owners running more than one location",
          ],
        },
        {
          heading: "Guards and limits",
          paragraphs: [
            "Every date-ranged query caps the interval at 731 days, roughly two years. The number is not arbitrary: without that ceiling, a request starting in 1900 scans the whole table and drags response time down for everyone on the same database.",
            "The parameters the merchant chooses — days without buying, expiry window — are validated before becoming a query, and reject zero and negative values with a plain-language message. Validation lives in rules declared per request and resolved by a global filter, so no query depends on a service remembering to check.",
          ],
        },
        {
          heading: "From number to decision",
          paragraphs: [
            "In the desktop client each report becomes a Chart.js chart and a table, and exports to a spreadsheet through SheetJS: the merchant takes the slice to where they already work, without depending on server-side export.",
            "Building the spreadsheet on the client is a deliberate choice. The data already reached the screen, so assembling the file there avoids a second trip to the database and one more endpoint to maintain.",
          ],
        },
      ],
    },
  },
};
