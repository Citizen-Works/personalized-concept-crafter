
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentDraft {
  id: string;
  title: string;
  version: number;
  date: string;
}

interface RecentDraftsCardProps {
  drafts: RecentDraft[];
  isLoading: boolean;
}

export const RecentDraftsCard = ({ drafts, isLoading }: RecentDraftsCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Drafts</CardTitle>
          <CardDescription>Your latest content drafts</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Link to="/drafts" className="flex items-center gap-1 w-full h-full">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="space-y-1 w-full">
                  <Skeleton className="h-5 w-2/3" />
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : drafts.length > 0 ? (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <div key={draft.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-medium">{draft.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{draft.date}</span>
                    <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      Version {draft.version}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <Link to={`/drafts/${draft.id}`} className="flex items-center">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-4">No drafts created yet</p>
            <Button asChild size="sm" variant="outline">
              <Link to="/ideas">Browse ideas to draft</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
