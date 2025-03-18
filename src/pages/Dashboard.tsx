
import React from 'react';
import { Lightbulb, FileText, Zap } from 'lucide-react';
import { useIdeas } from '@/hooks/ideas';
import { useDrafts } from '@/hooks/useDrafts';
import { 
  DashboardHeader,
  StatsCard,
  RecentIdeasCard,
  RecentDraftsCard,
  QuickActionsCard
} from '@/components/dashboard';

const Dashboard = () => {
  // Fetch real data using the hooks
  const { ideas, isLoading: isIdeasLoading } = useIdeas();
  const { drafts, isLoading: isDraftsLoading } = useDrafts();
  
  const isLoading = isIdeasLoading || isDraftsLoading;
  
  // Filter ideas by status to get counts
  const contentIdeasCount = ideas.length;
  const contentDraftsCount = drafts.length;
  const publishedContentCount = ideas.filter(idea => idea.status === 'published').length;

  // Get most recent ideas (up to 3)
  const recentIdeas = ideas.slice(0, 3).map(idea => ({
    id: idea.id, 
    title: idea.title, 
    status: idea.status, 
    date: new Date(idea.createdAt).toLocaleDateString()
  }));

  // Get recent drafted ideas (up to 2)
  const recentDrafts = drafts
    .slice(0, 2)
    .map(draft => ({
      id: draft.id, 
      title: draft.ideaTitle, 
      version: draft.version, 
      date: new Date(draft.createdAt).toLocaleDateString()
    }));
  
  // Stats data from real counts
  const stats = [
    { title: "Content Ideas", value: isLoading ? "-" : contentIdeasCount, icon: Lightbulb },
    { title: "Content Drafts", value: isLoading ? "-" : contentDraftsCount, icon: FileText },
    { title: "Published Content", value: isLoading ? "-" : publishedContentCount, icon: Zap },
  ];
  
  return (
    <div className="space-y-8">
      <DashboardHeader 
        title="Welcome back" 
        description="Here's an overview of your content creation activities" 
      />
      
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            isLoading={isLoading}
          />
        ))}
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <RecentIdeasCard ideas={recentIdeas} isLoading={isIdeasLoading} />
        <RecentDraftsCard drafts={recentDrafts} isLoading={isDraftsLoading} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuickActionsCard />
      </div>
    </div>
  );
};

export default Dashboard;
