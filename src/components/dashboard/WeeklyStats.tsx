
import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatItemProps {
  title: string;
  currentValue: number;
  previousValue: number;
  isLoading: boolean;
}

const StatItem = ({ title, currentValue, previousValue, isLoading }: StatItemProps) => {
  const percentChange = previousValue === 0 
    ? 100 
    : Math.round(((currentValue - previousValue) / previousValue) * 100);
  
  const getTrendIcon = () => {
    if (percentChange > 0) {
      return <ArrowUp className="h-3 w-3 text-teal" />;
    } else if (percentChange < 0) {
      return <ArrowDown className="h-3 w-3 text-accent" />;
    }
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };
  
  const getTrendColor = () => {
    if (percentChange > 0) {
      return 'text-teal';
    } else if (percentChange < 0) {
      return 'text-accent';
    }
    return 'text-muted-foreground';
  };

  return (
    <div className="flex flex-col relative">
      <span className="text-sm text-muted-foreground">{title}</span>
      {isLoading ? (
        <div>
          <Skeleton className="h-7 w-16 mt-1" />
          <Skeleton className="h-4 w-24 mt-1" />
        </div>
      ) : (
        <>
          <span className="text-2xl font-bold">{currentValue}</span>
          <div className="flex items-center gap-1 mt-1">
            {getTrendIcon()}
            <span className={`text-xs ${getTrendColor()}`}>
              {percentChange === 0 ? 'No change' : `${Math.abs(percentChange)}% ${percentChange > 0 ? 'increase' : 'decrease'}`}
            </span>
          </div>
          {percentChange > 0 && (
            <div className="absolute -bottom-3 left-0 right-0 h-1.5 bg-secondary/30 rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full" style={{ width: `${Math.min(percentChange, 100)}%` }}></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

interface WeeklyStatsProps {
  ideasCreated: { current: number; previous: number };
  draftsGenerated: { current: number; previous: number };
  contentPublished: { current: number; previous: number };
  isLoading: boolean;
}

export const WeeklyStats = ({ 
  ideasCreated, 
  draftsGenerated, 
  contentPublished, 
  isLoading 
}: WeeklyStatsProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Weekly Stats</CardTitle>
        <CardDescription>Content metrics for this week</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 pb-6">
        <StatItem 
          title="Ideas Created" 
          currentValue={ideasCreated.current} 
          previousValue={ideasCreated.previous}
          isLoading={isLoading}
        />
        <StatItem 
          title="Drafts Generated" 
          currentValue={draftsGenerated.current} 
          previousValue={draftsGenerated.previous}
          isLoading={isLoading}
        />
        <StatItem 
          title="Content Published" 
          currentValue={contentPublished.current} 
          previousValue={contentPublished.previous}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
