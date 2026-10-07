export type MonthlyTotal = {
  month: string;
  income: number;
  expenses: number;
};

export type SpendingCategory = {
  name: string;
  amount: number;
  color: string;
};

export type Transaction = {
  id: number;
  description: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense";
};

export const categories: SpendingCategory[] = [
  { name: "Alimentação", amount: 1200, color: "bg-emerald-600" },
  { name: "Moradia", amount: 1750, color: "bg-teal-500" },
  { name: "Transporte", amount: 500, color: "bg-sky-500" },
  { name: "Lazer", amount: 470, color: "bg-amber-500" },
  { name: "Outros", amount: 400.75, color: "bg-slate-400" },
];

const income = 7850;
const expenses = categories.reduce((total, category) => total + category.amount, 0);

export const summary = {
  income,
  expenses,
  balance: income - expenses,
} as const;

export const monthlyEvolution: MonthlyTotal[] = [
  { month: "Mai", income: 5700, expenses: 3900 },
  { month: "Jun", income: 6200, expenses: 4500 },
  { month: "Jul", income: 5900, expenses: 4300 },
  { month: "Ago", income: 7100, expenses: 4900 },
  { month: "Set", income: 6750, expenses: 5200 },
  { month: "Out", income, expenses },
];

export const transactions: Transaction[] = [
  {
    id: 1,
    description: "Salário",
    category: "Renda",
    date: "06 out, 2026",
    amount: 6500,
    type: "income",
  },
  {
    id: 2,
    description: "Mercado Central",
    category: "Alimentação",
    date: "05 out, 2026",
    amount: 342.8,
    type: "expense",
  },
  {
    id: 3,
    description: "Aluguel",
    category: "Moradia",
    date: "03 out, 2026",
    amount: 1850,
    type: "expense",
  },
  {
    id: 4,
    description: "Projeto freelancer",
    category: "Renda extra",
    date: "02 out, 2026",
    amount: 850,
    type: "income",
  },
  {
    id: 5,
    description: "Transporte por app",
    category: "Transporte",
    date: "01 out, 2026",
    amount: 48.9,
    type: "expense",
  },
];
