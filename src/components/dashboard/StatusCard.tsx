
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  route: string;
  color: string;
  isLoading: boolean;
}

export const StatusCard = ({ title, count, icon, route, color, isLoading }: StatusCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
      onClick={() => navigate(route)}
    >
      <CardContent className="p-6 flex items-center justify-between relative">
        <div className="flex items-center z-10">
          <div className={`${color} p-4 rounded-full mr-4`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : count}
            </h3>
          </div>
        </div>
        <div className="absolute top-0 right-0 h-full w-24 bg-secondary/20 skew-x-[-20deg] transform translate-x-8 z-0"></div>
      </CardContent>
    </Card>
  );
};
