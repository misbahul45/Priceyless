import React from 'react';
import { Card, CardContent } from '../ui/Card';

export function EmptyState({ title = 'No data found', message, action }: { title?: string; message: string; action?: React.ReactNode }) {
  return (
    <Card className="flex flex-col items-center justify-center min-h-[300px] border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <h3 className="text-lg font-bold text-[#222222] mb-2">{title}</h3>
        <p className="text-[#6a6a6a] mb-6 max-w-md">{message}</p>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}
