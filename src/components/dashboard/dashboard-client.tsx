"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { CategorySpending } from "@/components/dashboard/category-spending";
import { DashboardActions } from "@/components/dashboard/dashboard-actions";
import { FinancialEvolution } from "@/components/dashboard/financial-evolution";
import { Icon } from "@/components/dashboard/icon";
import { MovementFormDialog } from "@/components/dashboard/movement-form-dialog";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryCard } from "@/components/dashboard/summary-card";
import type { MonthlyTotal, NewMovement, SpendingCategory, Transaction } from "@/data/dashboard";

type DashboardClientProps = {
  header: ReactNode;
  categories: SpendingCategory[];
  monthlyEvolution: MonthlyTotal[];
  initialSummary: { income: number; expenses: number; balance: number };
  initialTransactions: Transaction[];
};

const monthNames = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatTransactionDate(date: string): string {
  const [year, month, day] = date.split("-");
  const monthName = monthNames[Number(month) - 1];

  return `${day} ${monthName}, ${year}`;
}

export function DashboardClient({
  header,
  categories,
  monthlyEvolution,
  initialSummary,
  initialTransactions,
}: DashboardClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [addedIncomeCents, setAddedIncomeCents] = useState(0);
  const [addedExpenseCents, setAddedExpenseCents] = useState(0);
  const [addedExpenseCategoryCents, setAddedExpenseCategoryCents] = useState<Record<string, number>>({});
  const [activeForm, setActiveForm] = useState<"income" | "expense" | null>(null);
  const [confirmation, setConfirmation] = useState("");

  const incomeTotal = initialSummary.income + addedIncomeCents / 100;
  const expenseTotal = initialSummary.expenses + addedExpenseCents / 100;
  const balance = incomeTotal - expenseTotal;
  const updatedCategories = categories.map((category) => ({
    ...category,
    amount: category.amount + (addedExpenseCategoryCents[category.name] ?? 0) / 100,
  }));

  useEffect(() => {
    if (!confirmation) return;

    const timeoutId = window.setTimeout(() => setConfirmation(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [confirmation]);

  const handleCancelIncome = useCallback(() => {
    setActiveForm(null);
  }, []);

  function handleSaveMovement(movement: NewMovement) {
    if (!activeForm) return;

    const movementType = activeForm;
    const amountCents = Math.round(movement.amount * 100);
    setTransactions((currentTransactions) => {
      const nextId = currentTransactions.reduce(
        (highestId, transaction) => Math.max(highestId, transaction.id),
        0,
      ) + 1;

      return [
        {
          ...movement,
          amount: amountCents / 100,
          id: nextId,
          date: formatTransactionDate(movement.date),
          type: movementType,
        },
        ...currentTransactions,
      ];
    });
    if (movementType === "income") {
      setAddedIncomeCents((currentTotal) => currentTotal + amountCents);
      setConfirmation("Receita adicionada com sucesso.");
    } else {
      setAddedExpenseCents((currentTotal) => currentTotal + amountCents);
      setAddedExpenseCategoryCents((currentAmounts) => ({
        ...currentAmounts,
        [movement.category]: (currentAmounts[movement.category] ?? 0) + amountCents,
      }));
      setConfirmation("Despesa adicionada com sucesso.");
    }
    setActiveForm(null);
  }

  const currentMonthEvolution = monthlyEvolution.map((month, index) =>
    index === monthlyEvolution.length - 1
      ? { ...month, income: incomeTotal, expenses: expenseTotal }
      : month,
  );

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
          <SummaryCard kind="balance" label="Saldo disponível" amount={balance} />
          <SummaryCard kind="income" label="Total de receitas" amount={incomeTotal} />
          <SummaryCard kind="expense" label="Total de despesas" amount={expenseTotal} />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
          <FinancialEvolution data={currentMonthEvolution} />
          <CategorySpending categories={updatedCategories} />
        </section>

        <section className="mt-6">
          <RecentTransactions transactions={transactions} />
        </section>

        <p className="mt-8 text-center text-xs text-slate-500">
          Valores fictícios para demonstração. Movimentações adicionadas ficam disponíveis nesta sessão.
        </p>
      </main>

      {activeForm && (
        <MovementFormDialog
          type={activeForm}
          onCancel={handleCancelIncome}
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
