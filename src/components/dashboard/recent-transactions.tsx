import { Icon } from "@/components/dashboard/icon";
import { formatCurrency } from "@/components/dashboard/format-currency";
import type { Transaction } from "@/data/dashboard";

type RecentTransactionsProps = {
  transactions: Transaction[];
};

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Últimas movimentações</h2>
          <p className="mt-1 text-sm text-slate-500">Atividades recentes da sua conta</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {transactions.length} movimentações
        </span>
      </div>

      <div className="hidden grid-cols-[minmax(180px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(130px,auto)] gap-4 border-y border-slate-100 bg-slate-50/70 px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 sm:grid">
        <span>Descrição</span>
        <span>Categoria</span>
        <span>Data</span>
        <span className="text-right">Valor</span>
      </div>

      <ul className="divide-y divide-slate-100">
        {transactions.map((transaction) => {
          const isIncome = transaction.type === "income";

          return (
            <li
              key={transaction.id}
              className="grid gap-3 px-5 py-4 sm:grid-cols-[minmax(180px,1.5fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(130px,auto)] sm:items-center sm:gap-4 sm:px-6"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                    isIncome ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon
                    name={isIncome ? "arrow-up-right" : "arrow-down-right"}
                    className="size-4"
                  />
                </span>
                <span className="truncate text-sm font-semibold text-slate-800">
                  {transaction.description}
                </span>
              </div>

              <span className="pl-13 text-sm text-slate-600 sm:pl-0">{transaction.category}</span>
              <span className="pl-13 text-sm text-slate-500 sm:pl-0">{transaction.date}</span>
              <span
                className={`pl-13 text-sm font-semibold sm:pl-0 sm:text-right ${
                  isIncome ? "text-emerald-700" : "text-slate-800"
                }`}
              >
                {isIncome ? "+" : "−"} {formatCurrency(transaction.amount)}
              </span>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
