import { DashboardView } from "../components/DashboardView";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardPage() {
  const { dashboardData, loading, error, refetch } = useDashboard();

  return (
    <DashboardView
      dashboardData={dashboardData}
      loading={loading}
      error={error}
      refetch={refetch}
    />
  );
}
