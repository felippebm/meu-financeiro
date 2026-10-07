import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { categories, monthlyEvolution, summary, transactions } from "@/data/dashboard";

export default function Home() {
  return (
    <DashboardClient
      header={<DashboardHeader />}
      categories={categories}
      monthlyEvolution={monthlyEvolution}
      initialSummary={summary}
      initialTransactions={transactions}
    />
  );
}
