import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f7f8f6] text-slate-900">
      <header className="mx-auto flex w-full max-w-6xl items-center px-6 py-6 sm:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="Meu Financeiro, início">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              className="size-5"
            >
              <path
                d="M4 18V9m5 9V5m5 13v-6m5 6V8M3 20h18"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-base font-semibold tracking-tight">Meu Financeiro</span>
        </Link>
      </header>

      <section className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-16 sm:px-10 sm:py-24">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-semibold tracking-wide text-emerald-800">
            GESTÃO FINANCEIRA PESSOAL
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl sm:leading-[1.1]">
            Seu dinheiro, organizado em um só lugar.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Uma nova forma de acompanhar sua vida financeira começa aqui.
          </p>
          <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <span className="size-2 rounded-full bg-emerald-600" aria-hidden="true" />
            Projeto em construção
          </div>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-6xl px-6 py-6 text-sm text-slate-500 sm:px-10">
        Meu Financeiro
      </footer>
    </main>
  );
}
