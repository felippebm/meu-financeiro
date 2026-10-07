import { Icon } from "@/components/dashboard/icon";
import { formatCurrency } from "@/components/dashboard/format-currency";
import type { SpendingCategory } from "@/data/dashboard";

type CategorySpendingProps = {
  categories: SpendingCategory[];
};

const categoryIcons: Record<string, "food" | "home" | "transport" | "leisure" | "other"> = {
  Alimentação: "food",
  Moradia: "home",
  Transporte: "transport",
  Lazer: "leisure",
  Outros: "other",
};

const iconColors: Record<string, string> = {
  Alimentação: "bg-emerald-50 text-emerald-700",
  Moradia: "bg-teal-50 text-teal-700",
  Transporte: "bg-sky-50 text-sky-700",
  Lazer: "bg-amber-50 text-amber-700",
  Outros: "bg-slate-100 text-slate-600",
};

function calculatePercentages(categories: SpendingCategory[], total: number): number[] {
  if (total <= 0 || categories.length === 0) {
    return categories.map(() => 0);
  }

  const exactPercentages = categories.map((category) => (category.amount / total) * 100);
  const percentages = exactPercentages.map(Math.floor);
  const remainingPoints = 100 - percentages.reduce((sum, percentage) => sum + percentage, 0);
  const largestRemainders = exactPercentages
    .map((percentage, index) => ({ index, remainder: percentage - Math.floor(percentage) }))
    .sort((a, b) => b.remainder - a.remainder);

  for (let index = 0; index < remainingPoints; index += 1) {
    const categoryIndex = largestRemainders[index % largestRemainders.length].index;
    percentages[categoryIndex] += 1;
  }

  return percentages;
}

export function CategorySpending({ categories }: CategorySpendingProps) {
  const total = categories.reduce((sum, category) => sum + category.amount, 0);
  const percentages = calculatePercentages(categories, total);

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-base font-semibold text-slate-950">Gastos por categoria</h2>
        <p className="mt-1 text-sm text-slate-500">Distribuição das despesas do mês</p>
      </div>

      <ul className="mt-6 space-y-5">
        {categories.map((category, index) => {
          const percentage = percentages[index];
          const icon = categoryIcons[category.name] ?? "other";
          const color = iconColors[category.name] ?? "bg-slate-100 text-slate-600";

          return (
            <li key={category.name}>
              <div className="flex items-center gap-3">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${color}`}>
                  <Icon name={icon} className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-slate-700">{category.name}</span>
                    <span className="shrink-0 font-semibold text-slate-900">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${category.name}: ${percentage}%`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percentage}
                    >
                      <div
                        className={`h-full rounded-full ${category.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs text-slate-500">{percentage}%</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
        <span className="font-medium text-slate-500">Total categorizado</span>
        <span className="font-semibold text-slate-900">{formatCurrency(total)}</span>
      </div>
    </article>
  );
}
