
import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardHeader } from '@/components/dashboard';
import { ContentStatusCards } from '@/components/dashboard/ContentStatusCards';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { WeeklyStats } from '@/components/dashboard/WeeklyStats';

const Dashboard = () => {
  const { statusCounts, weeklyStats, activities, isLoading } = useDashboardData();
  
  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Dashboard" 
        description="Your content creation command center" 
      />
      
      <ContentStatusCards 
        needsReviewCount={statusCounts.needsReview}
        inProgressCount={statusCounts.inProgress}
        readyToPublishCount={statusCounts.readyToPublish}
        publishedCount={statusCounts.published}
        isLoading={isLoading.ideas}
      />
      
      <div className="grid gap-8 md:grid-cols-2">
        <QuickActionsCard />
        <WeeklyStats 
          ideasCreated={{
            current: weeklyStats.ideasCreated,
            previous: weeklyStats.ideasCreated > 0 ? Math.floor(weeklyStats.ideasCreated * 0.8) : 0
          }}
          draftsGenerated={{
            current: weeklyStats.draftsGenerated,
            previous: weeklyStats.draftsGenerated > 0 ? Math.floor(weeklyStats.draftsGenerated * 0.8) : 0
          }}
          contentPublished={{
            current: weeklyStats.contentPublished,
            previous: weeklyStats.contentPublished > 0 ? Math.floor(weeklyStats.contentPublished * 0.8) : 0
          }}
          isLoading={isLoading.ideas || isLoading.drafts}
        />
      </div>
      
      <ActivityFeed 
        activities={activities}
        isLoading={isLoading.activities}
      />
    </div>
  );
};

export default Dashboard;
