import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  accounts,
  expenseCategories,
  incomeCategories,
  type NewMovement,
} from "@/data/dashboard";
import { Icon } from "@/components/dashboard/icon";

type MovementFormDialogProps = {
  type: "income" | "expense";
  onCancel: () => void;
  onSave: (movement: NewMovement) => void;
};

export function MovementFormDialog({ type, onCancel, onSave }: MovementFormDialogProps) {
  const descriptionRef = useRef<HTMLInputElement>(null);
  const [formError, setFormError] = useState("");
  const isIncome = type === "income";
  const categories = isIncome ? incomeCategories : expenseCategories;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    descriptionRef.current?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onCancel]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const description = String(formData.get("description") ?? "").trim();
    const amountInput = String(formData.get("amount") ?? "").trim();
    const amount = Number(amountInput);
    const date = String(formData.get("date") ?? "");
    const category = String(formData.get("category") ?? "");
    const account = String(formData.get("account") ?? "");
    const observation = String(formData.get("observation") ?? "").trim();

    if (!description || !amountInput || !date || !category || !account) {
      setFormError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError("Informe um valor maior que zero.");
      return;
    }

    onSave({ description, amount, date, category, account, observation });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="movement-dialog-title"
        className="max-h-[94dvh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <p className="text-xs font-semibold tracking-wide text-emerald-800">
              {isIncome ? "MOVIMENTAÇÃO DE ENTRADA" : "MOVIMENTAÇÃO DE SAÍDA"}
            </p>
            <h2 id="movement-dialog-title" className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
              {isIncome ? "Nova receita" : "Nova despesa"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isIncome
                ? "Preencha os dados para registrar uma entrada."
                : "Preencha os dados para registrar uma saída."}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fechar formulário"
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <form className="space-y-5 px-5 py-5 sm:px-7 sm:py-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="movement-description" className="mb-1.5 block text-sm font-medium text-slate-700">
              Descrição <span className="text-rose-600">*</span>
            </label>
            <input
              ref={descriptionRef}
              id="movement-description"
              name="description"
              type="text"
              required
              maxLength={100}
              placeholder={isIncome ? "Ex.: Salário mensal" : "Ex.: Compras do mês"}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
              onChange={() => setFormError("")}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="movement-amount" className="mb-1.5 block text-sm font-medium text-slate-700">
                Valor <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-500">
                  R$
                </span>
                <input
                  id="movement-amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  inputMode="decimal"
                  required
                  placeholder="0,00"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                  onChange={() => setFormError("")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="movement-date" className="mb-1.5 block text-sm font-medium text-slate-700">
                Data <span className="text-rose-600">*</span>
              </label>
              <input
                id="movement-date"
                name="date"
                type="date"
                required
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                onChange={() => setFormError("")}
              />
            </div>

            <div>
              <label htmlFor="movement-category" className="mb-1.5 block text-sm font-medium text-slate-700">
                Categoria <span className="text-rose-600">*</span>
              </label>
              <select
                id="movement-category"
                name="category"
                required
                defaultValue=""
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                onChange={() => setFormError("")}
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="movement-account" className="mb-1.5 block text-sm font-medium text-slate-700">
                Conta <span className="text-rose-600">*</span>
              </label>
              <select
                id="movement-account"
                name="account"
                required
                defaultValue=""
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
                onChange={() => setFormError("")}
              >
                <option value="" disabled>Selecione uma conta</option>
                {accounts.map((account) => <option key={account} value={account}>{account}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="movement-observation" className="mb-1.5 block text-sm font-medium text-slate-700">
              Observação <span className="font-normal text-slate-400">(opcional)</span>
            </label>
            <textarea
              id="movement-observation"
              name="observation"
              rows={3}
              maxLength={500}
              placeholder="Adicione um detalhe, se desejar"
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/10"
            />
          </div>

          {formError && (
            <p role="alert" className="rounded-xl bg-rose-50 px-3.5 py-3 text-sm font-medium text-rose-700">
              {formError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 min-[420px]:flex-row min-[420px]:justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <Icon name="plus" className="size-4" />
              Salvar {isIncome ? "receita" : "despesa"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
