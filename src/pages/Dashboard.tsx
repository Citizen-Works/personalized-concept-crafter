import React from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardHeader } from '@/components/dashboard';
import { ContentStatusCards } from '@/components/dashboard/ContentStatusCards';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { WeeklyStats } from '@/components/dashboard/WeeklyStats';

const Dashboard = () => {
  const { 
    contentStatusCounts, 
    weeklyMetrics, 
    activityFeed, 
    isLoading 
  } = useDashboardData();
  
  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Dashboard" 
        description="Your content creation command center" 
      />
      
      <ContentStatusCards 
        needsReviewCount={contentStatusCounts.needsReview}
        approvedIdeasCount={contentStatusCounts.approvedIdeas}
        inProgressCount={contentStatusCounts.inProgress}
        readyToPublishCount={contentStatusCounts.readyToPublish}
        publishedCount={contentStatusCounts.published}
        isLoading={isLoading.statusCounts}
      />
      
      <div className="grid gap-8 md:grid-cols-2">
        <QuickActionsCard />
        <WeeklyStats 
          ideasCreated={{
            current: weeklyMetrics.ideasCreated,
            previous: weeklyMetrics.ideasCreated > 0 ? Math.floor(weeklyMetrics.ideasCreated * 0.8) : 0
          }}
          draftsGenerated={{
            current: weeklyMetrics.draftsGenerated,
            previous: weeklyMetrics.draftsGenerated > 0 ? Math.floor(weeklyMetrics.draftsGenerated * 0.8) : 0
          }}
          contentPublished={{
            current: weeklyMetrics.contentPublished,
            previous: weeklyMetrics.contentPublished > 0 ? Math.floor(weeklyMetrics.contentPublished * 0.8) : 0
          }}
          isLoading={isLoading.weeklyStats || isLoading.drafts}
        />
      </div>
      
      {/* Map ActivityFeedItem[] to ActivityItem[] for the ActivityFeed component */}
      <ActivityFeed 
        activities={activityFeed.map(item => ({
          id: item.id,
          type: item.type === 'idea' ? 'idea_created' : 
                item.type === 'draft' ? 'draft_generated' :
                item.type === 'published' ? 'status_changed' : 'transcript_processed',
          title: item.title,
          timestamp: item.timestamp,
          status: item.action === 'published' ? 'published' : undefined,
          route: item.route || `/${item.type}s/${item.entityId}`,
          entityId: item.entityId || ''
        }))}
        isLoading={isLoading.activityFeed}
      />
    </div>
  );
};

export default Dashboard;
