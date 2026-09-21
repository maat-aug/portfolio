import type { Project } from "@/domain/project";

export const CPF_GEN: Project = {
  slug: "cpf-gen",
  year: "2026",
  tags: ["React", "TypeScript", "TanStack Start", "Vite", "SheetJS"],
  cover: {
    src: "/img/cpf-gen/lotes.png",
    width: 1917,
    height: 1073,
    alt: {
      pt: "Configuração de lotes, com quantidade, estado e geração de nome",
      en: "Batch configuration screen with quantity, state and name generation",
    },
  },
  gallery: [
    {
      src: "/img/cpf-gen/resultados.png",
      width: 1917,
      height: 1073,
      alt: {
        pt: "Tabela de resultados com nome, CPF e estado de cada linha",
        en: "Results table showing name, CPF and state for each row",
      },
    },
    {
      src: "/img/cpf-gen/modelo.png",
      width: 1917,
      height: 1075,
      alt: {
        pt: "Envio de uma planilha modelo para a exportação sair no mesmo layout",
        en: "Uploading a template spreadsheet so the export keeps the same layout",
      },
    },
  ],
  repositoryUrl: "https://github.com/maat-aug/cpf-generator",
  content: {
    pt: {
      name: "Gerador de CPFs",
      tagline:
        "Gerador de CPFs válidos em lote, com estado de origem escolhido e exportação no layout da sua planilha.",
      problem: [
        "Testar cadastro brasileiro exige CPF válido, e quase nunca um só: duzentas linhas para uma carga, um lote por estado para conferir regra regional, uma planilha no formato que o cliente mandou.",
        "Gerador comum entrega um número por vez, sem nome, sem estado e sem jeito de exportar. O resto do trabalho sobra para o Excel e para a paciência de quem está testando.",
        "Este gera em lote, com o estado de origem sob controle, nome fictício junto quando é preciso, e escreve o resultado direto na planilha que você já tem.",
      ],
      features: [
        {
          title: "Lotes independentes",
          description:
            "Cada lote tem a própria quantidade, o próprio estado e a própria regra de nome. Dá para duplicar um lote, ajustar o que mudou e gerar todos de uma vez.",
        },
        {
          title: "Estado de origem",
          description:
            "O nono dígito do CPF indica a região fiscal. Escolher o estado fixa esse dígito, e a tabela mostra a UF de cada número gerado.",
        },
        {
          title: "Nome fictício",
          description:
            "Opcional, aleatório ou a partir de um prefixo: digitando “Maria” saem Marias com sobrenomes diferentes, o que ajuda a testar busca e ordenação.",
        },
        {
          title: "Regerar só o que precisa",
          description:
            "Marcando linhas na tabela, o botão troca apenas o CPF delas e mantém nome, estado e formatação.",
        },
        {
          title: "Cópia e exportação",
          description:
            "Copiar a tabela inteira, só os CPFs ou só os nomes; exportar em .xlsx ou em .csv.",
        },
        {
          title: "Planilha modelo",
          description:
            "Envie o arquivo do cliente e a exportação sai no layout dele, preenchendo apenas as colunas de nome, CPF e estado.",
        },
      ],
      audience: [
        "Desenvolvimento, QA e demonstração: popular formulário, montar massa de teste, preencher a planilha de importação de um sistema.",
        "Um número válido pela regra de formação não é um número atribuído a alguém. A ferramenta não consulta cadastro nenhum, não tem como saber de quem é o número, e existe para uso em teste.",
      ],
      technical: [
        {
          heading: "Regra de formação",
          paragraphs: [
            "Os oito primeiros dígitos são sorteados e o nono vem da região fiscal escolhida — 8 é São Paulo, 6 é Minas Gerais, 0 é Rio Grande do Sul, e assim por diante. No modo aleatório sorteia-se primeiro a região e depois um estado dentro dela.",
            "Os dois dígitos verificadores saem do cálculo oficial: soma ponderada com pesos decrescentes, resto da divisão por onze, e zero quando esse resto é menor que dois. O segundo dígito é calculado já contando com o primeiro.",
          ],
        },
        {
          heading: "Planilha modelo",
          paragraphs: [
            "O cabeçalho é procurado nas dez primeiras linhas, e os nomes das colunas são comparados sem acento, sem maiúscula e sem pontuação: “Nº CPF”, “numero do cpf” e “CPF” caem todos no mesmo lugar.",
            "Nenhuma coluna é criada e nenhuma célula preenchida é sobrescrita. Cada linha de dados que já existe recebe o próximo resultado apenas nas células vazias, e o que sobrar vira linha nova no fim.",
            "Dois detalhes de Excel em português resolvidos na leitura e na escrita: CSV é decodificado como Windows-1252 quando não é UTF-8 válido, e exportado com ponto e vírgula e BOM; e CPF que a planilha guardou como número volta com o zero à esquerda restaurado.",
          ],
        },
        {
          heading: "Front-end",
          bullets: [
            "React 18 com TanStack Start e TanStack Router",
            "Vite na build, e um servidor Node de sessenta linhas, sem framework, para servir o resultado",
            "SheetJS na leitura e na escrita das planilhas",
            "CSS próprio, sem biblioteca de componentes",
            "TypeScript estrito e estado local nos componentes, sem gerenciador de estado",
            "Seleção e menus construídos com papéis e rótulos ARIA, fecháveis por Esc e por clique fora",
          ],
        },
      ],
    },
    en: {
      name: "CPF Generator",
      tagline:
        "Batch generator of valid Brazilian CPF numbers, with a chosen state of origin and export into your own spreadsheet layout.",
      problem: [
        "Testing Brazilian registration forms requires a valid CPF, and hardly ever just one: two hundred rows for a data load, one batch per state to check regional rules, a spreadsheet in the format the client sent over.",
        "The usual generator returns one number at a time, with no name, no state and no way to export. The rest of the work falls to Excel and to the tester's patience.",
        "This one generates in batches, with the state of origin under control, a fictional name alongside when needed, and writes the result straight into the spreadsheet you already have.",
      ],
      features: [
        {
          title: "Independent batches",
          description:
            "Each batch has its own quantity, state and name rule. A batch can be duplicated, adjusted where it differs, and all of them generated at once.",
        },
        {
          title: "State of origin",
          description:
            "The ninth digit of a CPF marks the tax region. Choosing the state fixes that digit, and the table shows the state of every number generated.",
        },
        {
          title: "Fictional names",
          description:
            "Optional, random or built from a prefix: typing “Maria” produces Marias with different surnames, which helps when testing search and sorting.",
        },
        {
          title: "Regenerate only what you need",
          description:
            "Selecting rows in the table swaps just their CPF, keeping name, state and formatting untouched.",
        },
        {
          title: "Copy and export",
          description:
            "Copy the whole table, only the numbers or only the names; export to .xlsx or .csv.",
        },
        {
          title: "Template spreadsheet",
          description:
            "Upload the client's file and the export comes out in their layout, filling only the name, CPF and state columns.",
        },
      ],
      audience: [
        "Development, QA and demos: populating forms, building test data, filling in a system's import spreadsheet.",
        "A number that is valid by the formation rule is not a number assigned to anyone. The tool queries no registry, has no way of knowing whose a number might be, and exists for testing.",
      ],
      technical: [
        {
          heading: "Formation rule",
          paragraphs: [
            "The first eight digits are drawn at random and the ninth comes from the chosen tax region — 8 is São Paulo, 6 is Minas Gerais, 0 is Rio Grande do Sul, and so on. In random mode the region is drawn first, then a state within it.",
            "The two check digits come from the official calculation: a weighted sum with decreasing weights, the remainder of a division by eleven, and zero when that remainder is below two. The second digit is calculated with the first already in place.",
          ],
        },
        {
          heading: "Template spreadsheet",
          paragraphs: [
            "The header row is searched for in the first ten rows, and column names are compared without accents, case or punctuation: “Nº CPF”, “numero do cpf” and “CPF” all land in the same place.",
            "No column is ever created and no filled cell is overwritten. Each existing data row takes the next result into its empty cells only, and whatever is left over becomes new rows at the end.",
            "Two Brazilian Excel quirks are handled on read and on write: CSV is decoded as Windows-1252 when it is not valid UTF-8, and exported with semicolons and a BOM; and a CPF the spreadsheet stored as a number gets its leading zero restored.",
          ],
        },
        {
          heading: "Front-end",
          bullets: [
            "React 18 with TanStack Start and TanStack Router",
            "Vite for the build, and a sixty-line framework-free Node server to serve the result",
            "SheetJS for reading and writing spreadsheets",
            "Hand-written CSS, with no component library",
            "Strict TypeScript and local component state, with no state manager",
            "Selection and menus built on ARIA roles and labels, dismissible with Esc and outside clicks",
          ],
        },
      ],
    },
  },
};
