import "server-only";
import { Prisma, TransactionType } from "@/generated/prisma/client";
import {
  categories as demoCategories,
  monthlyEvolution as demoEvolution,
  summary as demoSummary,
  transactions as demoTransactions,
  type DashboardSnapshot,
  type MonthlyTotal,
  type Transaction,
} from "@/data/dashboard";
import { getPrismaClient } from "@/lib/prisma";

export const demoDashboardSnapshot: DashboardSnapshot = {
  summary: demoSummary,
  categories: demoCategories,
  monthlyEvolution: demoEvolution,
  transactions: demoTransactions,
};

function currentMonthRange() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);

  const start = new Date(Date.UTC(year, month - 1, 1, 12));
  const end = new Date(Date.UTC(year, month, 1, 12));
  const chartStart = new Date(Date.UTC(year, month - 6, 1, 12));

  return {
    year,
    month,
    startKey: dateKey(start),
    end,
    endKey: dateKey(end),
    chartStart,
  };
}

function dateKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function formatTransactionDate(date: Date): string {
  const [year, month, day] = dateKey(date).split("-").map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  const parts = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(calendarDate);

  return parts.replaceAll(".", "");
}

function toDashboardTransaction(record: {
  id: string;
  description: string;
  category: { name: string };
  account: { name: string };
  date: Date;
  amount: Prisma.Decimal;
  type: TransactionType;
  notes: string | null;
}): Transaction {
  return {
    id: record.id,
    description: record.description,
    category: record.category.name,
    account: record.account.name,
    date: formatTransactionDate(record.date),
    amount: Number(record.amount.toFixed(2)),
    type: record.type === TransactionType.INCOME ? "income" : "expense",
    observation: record.notes ?? undefined,
  };
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const userId = process.env.DEMO_USER_ID;

  if (!process.env.DATABASE_URL || !userId) {
    return demoDashboardSnapshot;
  }

  const prisma = getPrismaClient();
  const range = currentMonthRange();
  const [recentRecords, periodRecords] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      include: { account: true, category: true },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 10,
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: range.chartStart, lt: range.end } },
      include: { category: true },
      orderBy: { date: "asc" },
    }),
  ]);

  let income = new Prisma.Decimal(0);
  let expenses = new Prisma.Decimal(0);
  const categoryTotals = new Map<string, Prisma.Decimal>();
  const monthlyTotals = new Map<string, { income: Prisma.Decimal; expenses: Prisma.Decimal }>();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const firstOfMonth = new Date(Date.UTC(range.year, range.month - 1 - offset, 1, 12));
    monthlyTotals.set(monthKey(firstOfMonth), {
      income: new Prisma.Decimal(0),
      expenses: new Prisma.Decimal(0),
    });
  }

  for (const record of periodRecords) {
    const key = monthKey(record.date);
    const monthTotal = monthlyTotals.get(key);
    if (monthTotal) {
      if (record.type === TransactionType.INCOME) {
        monthTotal.income = monthTotal.income.plus(record.amount);
      } else {
        monthTotal.expenses = monthTotal.expenses.plus(record.amount);
      }
    }

    const recordDate = dateKey(record.date);
    if (recordDate >= range.startKey && recordDate < range.endKey && record.type === TransactionType.INCOME) {
      income = income.plus(record.amount);
    } else if (recordDate >= range.startKey && recordDate < range.endKey && record.type === TransactionType.EXPENSE) {
      expenses = expenses.plus(record.amount);
      const categoryTotal = categoryTotals.get(record.category.name) ?? new Prisma.Decimal(0);
      categoryTotals.set(record.category.name, categoryTotal.plus(record.amount));
    }
  }

  const evolution: MonthlyTotal[] = [...monthlyTotals.entries()].map(([key, totals]) => {
    const [year, month] = key.split("-").map(Number);
    const monthDate = new Date(Date.UTC(year, month - 1, 1));
    const label = new Intl.DateTimeFormat("pt-BR", {
      month: "short",
      timeZone: "UTC",
    }).format(monthDate).replaceAll(".", "");

    return {
      month: label.charAt(0).toUpperCase() + label.slice(1),
      income: Number(totals.income.toFixed(2)),
      expenses: Number(totals.expenses.toFixed(2)),
    };
  });

  const displayCategories = demoCategories.map((category) => ({
    ...category,
    amount: Number((categoryTotals.get(category.name) ?? new Prisma.Decimal(0)).toFixed(2)),
  }));
  const incomeAmount = Number(income.toFixed(2));
  const expenseAmount = Number(expenses.toFixed(2));

  return {
    summary: {
      income: incomeAmount,
      expenses: expenseAmount,
      balance: Number(income.minus(expenses).toFixed(2)),
    },
    categories: displayCategories,
    monthlyEvolution: evolution,
    transactions: recentRecords.map(toDashboardTransaction),
  };
}

