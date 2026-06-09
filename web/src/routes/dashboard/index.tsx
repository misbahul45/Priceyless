import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DashboardOverview } from '../../features/dashboard/components/DashboardOverview';
import { RequireAuth } from '../../lib/route-guard';

export const Route = createFileRoute('/dashboard/')({
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  return (
    <RequireAuth>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </RequireAuth>
  );
}
