
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface RecentIdea {
  id: string;
  title: string;
  status: string;
  date: string;
}

interface RecentIdeasCardProps {
  ideas: RecentIdea[];
  isLoading: boolean;
}

export const RecentIdeasCard = ({ ideas, isLoading }: RecentIdeasCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Ideas</CardTitle>
          <CardDescription>Your latest content ideas</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Link to="/ideas" className="flex items-center gap-1 w-full h-full">
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
              <div key={idea.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <h4 className="font-medium">{idea.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{idea.date}</span>
                    <div className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      idea.status === 'approved' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : idea.status === 'drafted' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                      {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="p-2">
                  <Link to={`/ideas/${idea.id}`} className="flex items-center">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-muted-foreground mb-4">No content ideas yet</p>
            <Button asChild size="sm">
              <Link to="/ideas/new">Create your first idea</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
