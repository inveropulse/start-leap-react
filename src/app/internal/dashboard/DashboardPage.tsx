import { PortalType } from "@/shared/types";
import { getPortalByType } from "@/routes/registry";
import { useDashboardData } from "./hooks/useDashboardData";
import { MetricsGrid } from "./components/MetricsGrid";
import { QuickActionCard } from "./components/QuickActionCard";
import { AppointmentOverview } from "./components/AppointmentOverview";
import { RevenueChartCard } from "./components/RevenueChartCard";
import { TopSedationistsCard } from "./components/TopSedationistsCard";
import { DashboardSkeletons } from "./components/LoadingSkeletons";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const portalConfig = getPortalByType(PortalType.INTERNAL);
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeletons />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
              <p className="text-muted-foreground">
                Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to {portalConfig.name}
        </h1>
        <p className="text-muted-foreground text-lg">
          {portalConfig.summaryDescription} - Monitor key metrics and manage operations efficiently.
        </p>
      </div>

      {/* Metrics Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Key Metrics</h2>
        <MetricsGrid metrics={data.metrics} />
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.quickActions.map((action, index) => (
            <QuickActionCard 
              key={action.id} 
              action={action}
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 6) * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </section>

      {/* Revenue Chart */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Revenue Overview</h2>
        <RevenueChartCard 
          data={data.revenueChart}
          className="animate-fade-in"
          style={{ animationDelay: '1200ms' } as React.CSSProperties}
        />
      </section>

      {/* Layout with Appointment Overview and Top Sedationists */}
      <div className="grid grid-cols-1 lg:grid-cols-[57.5%_42.5%] gap-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Appointment Overview</h2>
          <AppointmentOverview 
            appointments={data.appointments}
            className="animate-fade-in"
            style={{ animationDelay: '1000ms' } as React.CSSProperties}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Top Sedationists</h2>
          <TopSedationistsCard 
            sedationists={data.topSedationists}
            className="animate-fade-in"
            style={{ animationDelay: '1400ms' } as React.CSSProperties}
          />
        </section>
      </div>
    </div>
  );
}