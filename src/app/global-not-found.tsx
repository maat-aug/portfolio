import Link from "next/link";
import "./globals.css";
import { geistMono, geistSans } from "@/lib/fonts";

/**
 * O export estático gera um único out/404.html, servido pelo Azure para qualquer rota inexistente
 * nos dois idiomas. Como não dá para saber o idioma do visitante aqui, a página fala os dois.
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg text-ink">
        <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-1/4 size-[34rem] rounded-full bg-accent/10 blur-[140px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-40 bottom-0 size-[30rem] rounded-full bg-accent/10 blur-[130px]" />

          <section className="relative w-full max-w-2xl rounded-3xl border border-line bg-surface/75 p-8 text-center shadow-[var(--shadow)] backdrop-blur sm:p-12">
            <p className="font-mono text-sm font-semibold tracking-[0.2em] text-accent">ERRO 404</p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">Esta página não existe.</h1>
            <p className="mx-auto mt-5 max-w-[45ch] leading-relaxed text-muted">
              Talvez o endereço esteja incorreto ou esta página tenha mudado de lugar.
            </p>

            <p lang="en" className="mx-auto mt-4 max-w-[45ch] leading-relaxed text-muted">
              <span className="font-medium text-ink">This page does not exist.</span> The address may be
              wrong, or the page may have moved.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 font-semibold text-bg shadow-[0_4px_14px_rgb(242_162_83_/_0.2)] transition-all hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_18px_rgb(242_162_83_/_0.28)]"
              >
                <BackArrow />
                Voltar para o início
              </Link>
              <Link
                href="/en/"
                hrefLang="en"
                lang="en"
                className="group inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 font-semibold text-muted transition-colors hover:border-accent hover:text-ink"
              >
                <BackArrow />
                Back to home
              </Link>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}

function BackArrow() {
  return (
    <svg
      className="size-4 transition-transform duration-300 group-hover:-translate-x-1"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5m6 6-6-6 6-6" />
    </svg>
  );
}
