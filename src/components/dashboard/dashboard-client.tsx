"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { persistMovement } from "@/app/actions/transactions";
import { CategorySpending } from "@/components/dashboard/category-spending";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { FinancialEvolution } from "@/components/dashboard/financial-evolution";
import { Icon } from "@/components/dashboard/icon";
import { MovementFormDialog } from "@/components/dashboard/movement-form-dialog";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryCard } from "@/components/dashboard/summary-card";
import type { DashboardSnapshot, NewMovement } from "@/data/dashboard";

type DashboardClientProps = {
  header: ReactNode;
  initialData: DashboardSnapshot;
};

export function DashboardClient({ header, initialData }: DashboardClientProps) {
  const [data, setData] = useState(initialData);
  const [activeForm, setActiveForm] = useState<"income" | "expense" | null>(null);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    if (!confirmation) return;

    const timeoutId = window.setTimeout(() => setConfirmation(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [confirmation]);

  const handleCancel = useCallback(() => {
    setActiveForm(null);
  }, []);

  async function handleSaveMovement(movement: NewMovement): Promise<string | null> {
    if (!activeForm) return "Selecione o tipo de movimentação e tente novamente.";

    const result = await persistMovement(activeForm, movement);
    if (!result.ok) return result.error;

    setData(result.snapshot);
    setActiveForm(null);
    setConfirmation(activeForm === "income"
      ? "Receita adicionada com sucesso."
      : "Despesa adicionada com sucesso.");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-900">
      {header}

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
          <DashboardActions
            onAddIncome={() => setActiveForm("income")}
            onAddExpense={() => setActiveForm("expense")}
          />
        </div>

        <section aria-label="Resumo financeiro" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <SummaryCard kind="balance" label="Saldo disponível" amount={data.summary.balance} />
          <SummaryCard kind="income" label="Total de receitas" amount={data.summary.income} />
          <SummaryCard kind="expense" label="Total de despesas" amount={data.summary.expenses} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
          <FinancialEvolution data={data.monthlyEvolution} />
          <CategorySpending categories={data.categories} />
        </section>

        <section className="mt-6">
          <RecentTransactions transactions={data.transactions} />
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          Valores fictícios para demonstração. Movimentações salvas ficam associadas ao usuário local.
        </p>
      </main>

      {activeForm && (
        <MovementFormDialog
          type={activeForm}
          onCancel={handleCancel}
          onSave={handleSaveMovement}
        />
      )}

      {confirmation && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-[60] flex max-w-[calc(100vw-2.5rem)] items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-800 shadow-lg sm:bottom-8 sm:right-8"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Icon name="check" className="size-4" />
          </span>
          {confirmation}
        </div>
      )}
    </div>
  );
}
