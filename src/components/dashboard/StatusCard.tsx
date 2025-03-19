
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
      className={`overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer ${color}`}
      onClick={() => navigate(route)}
    >
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${color} bg-opacity-10 p-4 rounded-full mr-4`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : count}
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
