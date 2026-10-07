import { Icon } from "@/components/dashboard/icon";
import { formatCurrency } from "@/components/dashboard/format-currency";

type SummaryKind = "balance" | "income" | "expense";

type SummaryCardProps = {
  kind: SummaryKind;
  label: string;
  amount: number;
};

const cardStyles: Record<SummaryKind, { icon: SummaryKind; color: string }> = {
  balance: { icon: "balance", color: "bg-white/15 text-white" },
  income: { icon: "income", color: "bg-emerald-50 text-emerald-700" },
  expense: { icon: "expense", color: "bg-rose-50 text-rose-600" },
};

export function SummaryCard({ kind, label, amount }: SummaryCardProps) {
  const style = cardStyles[kind];
  const isBalance = kind === "balance";

  return (
    <article
      className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
        isBalance
          ? "border-emerald-800 bg-emerald-800 text-white"
          : "border-slate-200/80 bg-white text-slate-900"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={`text-sm font-medium ${isBalance ? "text-emerald-50/80" : "text-slate-500"}`}>
          {label}
        </p>
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${style.color}`}>
          <Icon name={style.icon} className="size-4" />
        </span>
      </div>
      <p className="mt-5 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
        {formatCurrency(amount)}
      </p>
      <p className={`mt-2 text-xs ${isBalance ? "text-emerald-50/70" : "text-slate-500"}`}>
        {isBalance ? "Disponível neste mês" : "Neste mês"}
      </p>
    </article>
  );
}
