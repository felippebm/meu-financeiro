import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { Icon } from "@/components/dashboard/icon";

function getCurrentMonth(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
}

function HeaderContent({ month }: { month: string }) {
  return (
    <header className="border-b border-slate-200/80 bg-white">
      <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Meu Financeiro, início">
          <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            <Icon name="brand" className="size-5" />
          </span>
          <span className="hidden text-base font-semibold tracking-tight text-slate-950 min-[380px]:inline">
            Meu Financeiro
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              aria-label="Mês anterior"
              className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon name="chevron-left" className="size-4" />
            </button>
            <span className="min-w-27 px-1 text-center text-sm font-medium capitalize text-slate-800 sm:min-w-34">
              {month}
            </span>
            <button
              type="button"
              aria-label="Próximo mês"
              className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon name="chevron-right" className="size-4" />
            </button>
          </div>

          <button
            type="button"
            aria-label="Menu do usuário"
            className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-900 ring-1 ring-emerald-900/10"
          >
            MF
          </button>
        </div>
      </div>
    </header>
  );
}

async function CurrentMonthHeader() {
  await connection();
  const month = getCurrentMonth();

  return <HeaderContent month={month} />;
}

export function DashboardHeader() {
  return (
    <Suspense fallback={<HeaderContent month="Mês atual" />}>
      <CurrentMonthHeader />
    </Suspense>
  );
}
