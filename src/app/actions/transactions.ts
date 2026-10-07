"use server";

import { revalidatePath } from "next/cache";
import { Prisma, TransactionType } from "@/generated/prisma/client";
import { accounts, expenseCategories, incomeCategories, type NewMovement, type PersistMovementResult } from "@/data/dashboard";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import { getPrismaClient } from "@/lib/prisma";

type MovementKind = "income" | "expense";

export async function persistMovement(
  kind: MovementKind,
  movement: NewMovement,
): Promise<PersistMovementResult> {
  const userId = process.env.DEMO_USER_ID;

  if (!process.env.DATABASE_URL || !userId) {
    return {
      ok: false,
      error: "Configure DATABASE_URL e DEMO_USER_ID no arquivo .env para salvar movimentações.",
    };
  }

  const description = movement.description.trim();
  const notes = movement.observation?.trim() ?? "";
  const categoryOptions: readonly string[] = kind === "income" ? incomeCategories : expenseCategories;
  const type = kind === "income" ? TransactionType.INCOME : TransactionType.EXPENSE;

  if (!description || description.length > 100 || !accounts.some((account) => account === movement.account)) {
    return { ok: false, error: "Confira a descrição e a conta selecionada." };
  }

  if (!categoryOptions.includes(movement.category)) {
    return { ok: false, error: "Selecione uma categoria válida para esta movimentação." };
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(movement.date)) {
    return { ok: false, error: "Informe uma data válida." };
  }

  const [year, month, day] = movement.date.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(12, 0, 0, 0);
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return { ok: false, error: "Informe uma data válida." };
  }

  let amount: Prisma.Decimal;
  try {
    amount = new Prisma.Decimal(movement.amount);
  } catch {
    return { ok: false, error: "Informe um valor válido e maior que zero." };
  }

  if (!amount.isFinite() || !amount.greaterThan(0) || amount.decimalPlaces() > 2) {
    return { ok: false, error: "Informe um valor positivo com até duas casas decimais." };
  }

  if (notes.length > 500) {
    return { ok: false, error: "A observação deve ter no máximo 500 caracteres." };
  }

  try {
    const prisma = getPrismaClient();
    await prisma.$transaction(async (transactionClient) => {
      await transactionClient.user.upsert({
        where: { id: userId },
        update: {},
        create: { id: userId },
      });

      const account = await transactionClient.account.upsert({
        where: { userId_name: { userId, name: movement.account } },
        update: {},
        create: { userId, name: movement.account },
      });

      const category = await transactionClient.category.upsert({
        where: { userId_name_type: { userId, name: movement.category, type } },
        update: {},
        create: { userId, name: movement.category, type },
      });

      await transactionClient.transaction.create({
        data: {
          user: { connect: { id: userId } },
          account: { connect: { id_userId: { id: account.id, userId } } },
          category: { connect: { id_userId: { id: category.id, userId } } },
          type,
          description,
          amount,
          date,
          notes: notes || null,
        },
      });
    });

    revalidatePath("/");
    return { ok: true, snapshot: await getDashboardSnapshot() };
  } catch {
    return {
      ok: false,
      error: "Não foi possível salvar. Confira a conexão PostgreSQL e se a migração foi aplicada.",
    };
  }
}
