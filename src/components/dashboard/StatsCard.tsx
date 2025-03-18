
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  isLoading: boolean;
}

export const StatsCard = ({ title, value, icon: Icon, isLoading }: StatsCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardContent className="p-6 flex items-center">
        <div className="bg-primary/10 p-4 rounded-full mr-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold">{isLoading ? <Skeleton className="h-8 w-8" /> : value}</h3>
        </div>
      </CardContent>
    </Card>
  );
};
