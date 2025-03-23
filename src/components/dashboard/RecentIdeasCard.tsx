
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentIdea } from '@/types';
import { IdeaContentCard } from '@/components/shared/IdeaContentCard';

interface RecentIdeasCardProps {
  ideas: ContentIdea[];
  isLoading: boolean;
}

export const RecentIdeasCard = ({ ideas, isLoading }: RecentIdeasCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md h-full">
      <CardHeader className="pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <CardTitle className="text-base sm:text-lg">Recent Ideas</CardTitle>
          <CardDescription>Your latest content ideas</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="w-full sm:w-auto">
          <Link to="/ideas" className="flex items-center gap-1 w-full h-full justify-center sm:justify-start">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
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
        ) : ideas.length > 0 ? (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <IdeaContentCard
                key={idea.id}
                idea={idea}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-4 text-sm">No content ideas yet</p>
            <Button asChild size="sm">
              <Link to="/ideas/new">Create your first idea</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
