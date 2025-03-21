
import React from 'react';
import { Link } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns';
import { Lightbulb, FileText, RefreshCw, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ActivityItem {
  id: string;
  type: 'idea_created' | 'draft_generated' | 'status_changed' | 'transcript_processed';
  title: string;
  timestamp: Date;
  status?: string;
  route: string;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

export const ActivityFeed = ({ activities, isLoading }: ActivityFeedProps) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'idea_created':
        return <Lightbulb className="h-4 w-4 text-primary" />;
      case 'draft_generated':
        return <FileText className="h-4 w-4 text-secondary" />;
      case 'status_changed':
        return <RefreshCw className="h-4 w-4 text-teal" />;
      case 'transcript_processed':
        return <MessageSquare className="h-4 w-4 text-accent" />;
      default:
        return <Lightbulb className="h-4 w-4 text-primary" />;
    }
  };

  const getActivityDescription = (type: ActivityItem['type']) => {
    switch (type) {
      case 'idea_created':
        return 'New content idea created';
      case 'draft_generated':
        return 'Draft generated';
      case 'status_changed':
        return 'Content status updated';
      case 'transcript_processed':
        return 'Meeting transcript processed';
      default:
        return 'Activity';
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    if (!status) return 'default';
    
    switch (status.toLowerCase()) {
      case 'unreviewed':
        return 'info';
      case 'approved':
        return 'success';
      case 'drafted':
        return 'secondary';
      case 'published':
        return 'accent';
      case 'draft':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
        <CardDescription>Your latest content actions</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="space-y-1 w-full">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-5 w-2/3 mt-1" />
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    <span className="text-xs text-muted-foreground">{getActivityDescription(activity.type)}</span>
                    <span className="text-xs text-muted-foreground" title={format(activity.timestamp, 'PPpp')}>
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium line-clamp-1 mt-1">{activity.title}</h4>
                  {activity.status && (
                    <div className="mt-1">
                      <Badge variant={getStatusBadgeVariant(activity.status)}>
                        {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                      </Badge>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="p-2" asChild>
                  <Link to={activity.route}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-2 text-sm">No recent activity</p>
            <Button asChild size="sm" variant="outline">
              <Link to="/ideas/new">Create your first content idea</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
