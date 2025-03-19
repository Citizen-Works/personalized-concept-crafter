
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
          ideasCreated={weeklyStats.ideasCreated}
          draftsGenerated={weeklyStats.draftsGenerated}
          contentPublished={weeklyStats.contentPublished}
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
