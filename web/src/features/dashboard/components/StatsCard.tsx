import React from 'react';
import { Card, CardContent } from '../../../components/ui/Card';

export function StatsCard({ title, value, icon, description }: { title: string; value: string | number; icon: React.ReactNode; description?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <h3 className="tracking-tight text-sm font-medium text-[#6a6a6a]">{title}</h3>
          <div className="text-[#222222]">{icon}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#222222]">{value}</div>
          {description && <p className="text-xs text-[#6a6a6a] mt-1">{description}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
