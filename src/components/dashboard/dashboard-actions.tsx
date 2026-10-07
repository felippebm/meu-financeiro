import { Icon } from "@/components/dashboard/icon";

type DashboardActionsProps = {
  onAddIncome: () => void;
  onAddExpense: () => void;
};

export function DashboardActions({ onAddIncome, onAddExpense }: DashboardActionsProps) {
  return (
    <div className="flex flex-col gap-2 min-[420px]:flex-row">
      <button
        type="button"
        onClick={onAddIncome}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        <Icon name="plus" className="size-4" />
        Nova receita
      </button>
      <button
        type="button"
        onClick={onAddExpense}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-700/30 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        <Icon name="plus" className="size-4 text-emerald-700" />
        Nova despesa
      </button>
    </div>
  );
}
