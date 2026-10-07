import type { MonthlyTotal } from "@/data/dashboard";
import { formatCurrency } from "@/components/dashboard/format-currency";

type FinancialEvolutionProps = {
  data: MonthlyTotal[];
};

const chart = {
  width: 640,
  height: 250,
  left: 58,
  right: 12,
  top: 12,
  bottom: 218,
  max: 8000,
};

function formatCompactCurrency(amount: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FinancialEvolution({ data }: FinancialEvolutionProps) {
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.bottom - chart.top;
  const groupWidth = plotWidth / data.length;
  const barWidth = 18;
  const max = Math.max(chart.max, ...data.flatMap((item) => [item.income, item.expenses]));

  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">Evolução financeira</h2>
          <p className="mt-1 text-sm text-slate-500">Receitas e despesas nos últimos meses</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-emerald-600" /> Receitas
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-slate-300" /> Despesas
          </span>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          role="img"
          aria-label={`Gráfico de receitas e despesas: ${data
            .map((item) => `${item.month}, receitas ${formatCurrency(item.income)}, despesas ${formatCurrency(item.expenses)}`)
            .join("; ")}`}
          className="h-55 min-w-130 w-full"
          preserveAspectRatio="none"
        >
          {[0, 2000, 4000, 6000, 8000].map((tick) => {
            const y = chart.bottom - (tick / max) * plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={chart.left}
                  x2={chart.width - chart.right}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray={tick === 0 ? undefined : "3 5"}
                />
                <text x={chart.left - 9} y={y + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
                  {formatCompactCurrency(tick)}
                </text>
              </g>
            );
          })}

          {data.map((item, index) => {
            const center = chart.left + groupWidth * index + groupWidth / 2;
            const incomeHeight = (item.income / max) * plotHeight;
            const expenseHeight = (item.expenses / max) * plotHeight;
            return (
              <g key={item.month}>
                <rect
                  x={center - barWidth - 3}
                  y={chart.bottom - incomeHeight}
                  width={barWidth}
                  height={incomeHeight}
                  rx="5"
                  fill="#059669"
                >
                  <title>{`${item.month}: receitas ${formatCurrency(item.income)}`}</title>
                </rect>
                <rect
                  x={center + 3}
                  y={chart.bottom - expenseHeight}
                  width={barWidth}
                  height={expenseHeight}
                  rx="5"
                  fill="#cbd5e1"
                >
                  <title>{`${item.month}: despesas ${formatCurrency(item.expenses)}`}</title>
                </rect>
                <text
                  x={center}
                  y={chart.bottom + 23}
                  textAnchor="middle"
                  className="fill-slate-500 text-xs"
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </article>
  );
}
