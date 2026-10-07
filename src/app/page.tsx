import { Suspense } from "react";
import { connection } from "next/server";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { demoDashboardSnapshot, getDashboardSnapshot } from "@/lib/dashboard-data";

async function PersistedDashboard() {
  await connection();
  const initialData = await getDashboardSnapshot();

  return <DashboardClient header={<DashboardHeader />} initialData={initialData} />;
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <DashboardClient
          header={<DashboardHeader />}
          initialData={demoDashboardSnapshot}
        />
      }
    >
      <PersistedDashboard />
    </Suspense>
  );
}
