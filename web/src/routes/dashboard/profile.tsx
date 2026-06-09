import { createFileRoute } from '@tanstack/react-router';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { RequireAuth } from '../../lib/route-guard';
import { useMeQuery } from '../../features/auth/hooks';
import { LoadingState } from '../../components/common/LoadingState';

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <RequireAuth>
      <DashboardLayout>
        <ProfileContent />
      </DashboardLayout>
    </RequireAuth>
  );
}

function ProfileContent() {
  const { data: user, isLoading } = useMeQuery();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#222222]">My Profile</h1>
      
      <div className="bg-white rounded-xl border border-[#dddddd] overflow-hidden">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-[#f2f2f2] rounded-full flex items-center justify-center text-3xl text-[#ff385c] font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#222222]">{user?.name}</h2>
              <p className="text-[#6a6a6a]">{user?.role}</p>
            </div>
          </div>
          
          <div className="grid gap-6 mt-8">
            <div>
              <label className="block text-sm font-medium text-[#6a6a6a] mb-1">Email</label>
              <div className="p-3 bg-[#f7f7f7] rounded-lg text-[#222222]">{user?.email}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6a6a6a] mb-1">User ID</label>
              <div className="p-3 bg-[#f7f7f7] rounded-lg text-[#222222] text-sm break-all">{user?.id}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#6a6a6a] mb-1">Account Created</label>
              <div className="p-3 bg-[#f7f7f7] rounded-lg text-[#222222]">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
