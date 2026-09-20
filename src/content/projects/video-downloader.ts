import type { Project } from "@/domain/project";

export const VIDEO_DOWNLOADER: Project = {
  slug: "video-downloader",
  year: "2026",
  tags: ["TypeScript", "Manifest V3", "ffmpeg.wasm", "esbuild"],
  cover: {
    src: "/img/video-downloader/popup.webp",
    width: 437,
    height: 365,
    alt: {
      pt: "Popup da extensão com dois vídeos detectados na aba: um MP4 direto e um stream HLS, cada um com miniatura, selo de tipo e botão de baixar",
      en: "Extension popup with two videos detected in the tab: a direct MP4 and an HLS stream, each with thumbnail, type badge and download button",
    },
  },
  gallery: [],
  content: {
    pt: {
      name: "Caxumba Video Saver",
      tagline:
        "Extensão de navegador que detecta e baixa vídeos MP4, HLS e DASH da página aberta, sem servidor externo.",
      problem: [
        "Vídeo que a página reproduz nem sempre é um arquivo que dá para salvar. Stream moderno chega em pedaços: HLS e DASH entregam dezenas ou centenas de segmentos, e o vídeo inteiro só existe montado dentro do player.",
        "A saída de sempre é um site de download cheio de anúncio, que pede a URL, processa no servidor de outra pessoa e devolve o que quiser devolver.",
        "O Caxumba faz o trabalho dentro do navegador. A extensão observa o tráfego da aba, mostra o que encontrou e remonta os segmentos localmente com o ffmpeg compilado para WebAssembly. Nenhum byte passa por servidor externo.",
      ],
      features: [
        {
          title: "Detecção automática",
          description:
            "A extensão acompanha as respostas de rede da aba e reconhece MP4, HLS (.m3u8) e DASH (.mpd) pelo content-type, com a extensão da URL como segunda pista.",
        },
        {
          title: "Prévia antes de baixar",
          description:
            "Cada vídeo encontrado aparece com o tipo e uma miniatura gerada a partir do começo do próprio arquivo, para confirmar que é aquele mesmo antes de gastar o download.",
        },
        {
          title: "Escolha de qualidade",
          description:
            "Em HLS e DASH, as variantes declaradas no manifesto viram uma lista de resoluções e taxas de bits.",
        },
        {
          title: "Remontagem local",
          description:
            "Os segmentos são baixados e remontados em um MP4 pelo ffmpeg.wasm, unindo vídeo e áudio quando o stream separa as duas faixas.",
        },
        {
          title: "Progresso por etapa",
          description:
            "A popup mostra em qual fase está: baixando segmentos, com a contagem, remontando e salvando.",
        },
        {
          title: "Recusa de stream protegido",
          description:
            "Playlist com chave de criptografia ou DRM não é baixada, e a mensagem diz exatamente por quê em vez de falhar no meio do caminho.",
        },
      ],
      audience: [
        "Quem precisa guardar um vídeo a que já tem acesso — aula, gravação de reunião, material de estudo — e não quer entregar a URL a um site intermediário.",
        "Não depende de loja de extensões: dá para compilar localmente e carregar sem compactação, ou usar o pacote pronto publicado a cada versão.",
      ],
      technical: [
        {
          heading: "Arquitetura",
          paragraphs: [
            "A extensão é Manifest V3 e se divide em quatro papéis: service worker para a detecção, content script para sinalizar vídeo em tela, popup para a interface e um documento offscreen para o trabalho pesado.",
            "O offscreen existe por uma limitação concreta: o ffmpeg.wasm precisa de Web Worker e de Blob, e o service worker do MV3 não tem nenhum dos dois. Toda a conversa entre as partes passa por mensagens tipadas em uma união discriminada, então mensagem nova não compila enquanto não for tratada.",
          ],
        },
        {
          heading: "Detecção",
          paragraphs: [
            "O service worker escuta o início das respostas da aba e classifica cada uma. Segmentos soltos e faixas só de áudio são descartados — o que interessa é o arquivo, ou o manifesto que reúne os pedaços.",
            "Todo MP4 candidato passa antes por uma sonda que lê o cabeçalho do arquivo e confirma que existe faixa de vídeo, o que tira da lista anúncios e pré-carregamentos sem imagem. Quando a mesma aba serve a playlist master e as variantes dela, as variantes somem: a master já contém todas.",
            "O content script avisa quando um elemento de vídeo entra em tela ou começa a tocar, e a detecção só vale dentro de uma janela de quinze segundos dessa atividade. Sem essa janela a lista enche do tráfego de fundo que qualquer página moderna faz sozinha.",
          ],
        },
        {
          heading: "Download e remontagem",
          bullets: [
            "ffmpeg.wasm com cópia de fluxo: remuxa o conteúdo, não reencoda",
            "Saída gravada com faststart, para o arquivo abrir sem estar inteiro em disco",
            "Requisições com as credenciais da sessão, e cabeçalho Range quando a playlist usa byte-range",
            "Init segment concatenado antes dos demais no caso de fMP4",
            "MPEG-TS analisado com janela ampliada, que é o que faz o ffmpeg achar as faixas de um .ts cortado",
            "O blob final volta ao service worker, que o entrega à API de downloads do navegador",
          ],
        },
        {
          heading: "Build",
          bullets: [
            "esbuild chamado por um script de oitenta linhas, sem bundler de framework",
            "ESM na popup, no service worker e no offscreen; IIFE no content script, que o MV3 não carrega como módulo",
            "Worker do ffmpeg reempacotado localmente, porque a política de segurança do MV3 não permite código vindo de CDN",
            "TypeScript em modo estrito, com verificação de tipos no CI",
            "GitHub Actions empacota a build e publica o .zip a cada tag de versão",
          ],
        },
      ],
    },
    en: {
      name: "Caxumba Video Saver",
      tagline:
        "A browser extension that detects and downloads MP4, HLS and DASH videos from the open page, with no external server.",
      problem: [
        "A video playing on a page is not always a file you can save. Modern streams arrive in pieces: HLS and DASH deliver dozens or hundreds of segments, and the whole video only exists assembled inside the player.",
        "The usual way out is an ad-heavy download site that takes the URL, processes it on somebody else's server and returns whatever it decides to return.",
        "Caxumba does the work inside the browser. The extension watches the tab traffic, shows what it found and reassembles the segments locally with ffmpeg compiled to WebAssembly. Not one byte goes through an external server.",
      ],
      features: [
        {
          title: "Automatic detection",
          description:
            "The extension follows the tab network responses and recognises MP4, HLS (.m3u8) and DASH (.mpd) by content type, with the URL extension as a second clue.",
        },
        {
          title: "Preview before downloading",
          description:
            "Every video found is listed with its type and a thumbnail built from the beginning of the file itself, to confirm it is the right one before spending the download.",
        },
        {
          title: "Quality selection",
          description:
            "For HLS and DASH, the variants declared in the manifest become a list of resolutions and bitrates.",
        },
        {
          title: "Local reassembly",
          description:
            "Segments are downloaded and remuxed into an MP4 by ffmpeg.wasm, joining video and audio when the stream keeps the two tracks apart.",
        },
        {
          title: "Progress by stage",
          description:
            "The popup shows which stage is running: fetching segments, with the count, remuxing, and saving.",
        },
        {
          title: "Protected streams refused",
          description:
            "A playlist with an encryption key or DRM is not downloaded, and the message says exactly why instead of failing halfway through.",
        },
      ],
      audience: [
        "Anyone who needs to keep a video they already have access to — a class, a meeting recording, study material — without handing the URL to a middleman site.",
        "It does not depend on an extension store: it can be built locally and loaded unpacked, or installed from the packaged build published on every version.",
      ],
      technical: [
        {
          heading: "Architecture",
          paragraphs: [
            "The extension is Manifest V3 and splits into four roles: a service worker for detection, a content script to signal on-screen video, the popup for the interface, and an offscreen document for the heavy work.",
            "The offscreen document exists for a concrete reason: ffmpeg.wasm needs Web Workers and Blobs, and the MV3 service worker has neither. Every exchange between the parts goes through typed messages in a discriminated union, so a new message does not compile until it is handled.",
          ],
        },
        {
          heading: "Detection",
          paragraphs: [
            "The service worker listens to the start of the tab responses and classifies each one. Loose segments and audio-only tracks are discarded — what matters is the file, or the manifest that gathers the pieces.",
            "Every MP4 candidate first goes through a probe that reads the file header and confirms a video track exists, which keeps ads and image-less preloads off the list. When the same tab serves both a master playlist and its variants, the variants disappear: the master already covers them.",
            "The content script reports when a video element enters the viewport or starts playing, and detection only counts within a fifteen-second window of that activity. Without that window the list fills with the background traffic any modern page generates on its own.",
          ],
        },
        {
          heading: "Download and remux",
          bullets: [
            "ffmpeg.wasm with stream copy: the content is remuxed, never re-encoded",
            "Output written with faststart, so the file opens before it is fully on disk",
            "Requests carry the session credentials, and a Range header when the playlist uses byte ranges",
            "Init segment concatenated ahead of the others for fMP4",
            "MPEG-TS parsed with a widened analysis window, which is what lets ffmpeg find the tracks in a cut .ts",
            "The final blob returns to the service worker, which hands it to the browser downloads API",
          ],
        },
        {
          heading: "Build",
          bullets: [
            "esbuild driven by an eighty-line script, with no framework bundler",
            "ESM for the popup, service worker and offscreen document; IIFE for the content script, which MV3 does not load as a module",
            "The ffmpeg worker is re-bundled locally, because the MV3 security policy forbids code served from a CDN",
            "TypeScript in strict mode, with type checking in CI",
            "GitHub Actions packages the build and publishes the .zip on every version tag",
          ],
        },
      ],
    },
  },
};
