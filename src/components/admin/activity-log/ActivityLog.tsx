
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminActivityLogs } from '@/hooks/admin/useAdminActivityLogs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { ActivityLogTable } from './ActivityLogTable';
import { ActivityLogSkeleton } from './ActivityLogSkeleton';

const ActivityLog: React.FC<{ limit?: number }> = ({ limit = 10 }) => {
  const { activityLogs, isLoading, refetch } = useAdminActivityLogs(limit);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return <ActivityLogSkeleton />;
  }

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Latest admin actions in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ActivityLogTable activityLogs={activityLogs} />
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
