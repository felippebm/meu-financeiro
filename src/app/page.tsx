import { CategorySpending } from "@/components/dashboard/category-spending";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { FinancialEvolution } from "@/components/dashboard/financial-evolution";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryCard } from "@/components/dashboard/summary-card";
import {
  categories,
  monthlyEvolution,
  summary,
  transactions,
} from "@/data/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-7xl px-5 pb-12 pt-8 sm:px-8 sm:pt-10 lg:px-10">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-medium text-emerald-800">
              GESTÃO FINANCEIRA PESSOAL
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Visão geral
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Acompanhe seu dinheiro de forma simples.
            </p>
          </div>
          <DashboardActions />
        </div>

        <section aria-label="Resumo financeiro" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard kind="balance" label="Saldo disponível" amount={summary.balance} />
          <SummaryCard kind="income" label="Total de receitas" amount={summary.income} />
          <SummaryCard kind="expense" label="Total de despesas" amount={summary.expenses} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
          <FinancialEvolution data={monthlyEvolution} />
          <CategorySpending categories={categories} />
        </section>

        <section className="mt-6">
          <RecentTransactions transactions={transactions} />
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          Valores fictícios para demonstração.
        </p>
      </main>
    </div>
  );
}
