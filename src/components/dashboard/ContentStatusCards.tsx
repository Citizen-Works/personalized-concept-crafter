
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit, Check, SendHorizonal } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatusCardProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  route: string;
  color: string;
  isLoading: boolean;
}

const StatusCard = ({ title, count, icon, route, color, isLoading }: StatusCardProps) => {
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

interface ContentStatusCardsProps {
  needsReviewCount: number;
  inProgressCount: number;
  readyToPublishCount: number;
  publishedCount: number;
  isLoading: boolean;
}

export const ContentStatusCards = ({ 
  needsReviewCount, 
  inProgressCount, 
  readyToPublishCount, 
  publishedCount,
  isLoading 
}: ContentStatusCardsProps) => {
  const statusCards = [
    {
      title: "Needs Review",
      count: needsReviewCount,
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      route: "/review-queue",
      color: "text-blue-500",
    },
    {
      title: "In Progress",
      count: inProgressCount,
      icon: <Edit className="h-6 w-6 text-orange-500" />,
      route: "/ideas",
      color: "text-orange-500",
    },
    {
      title: "Ready to Publish",
      count: readyToPublishCount,
      icon: <Check className="h-6 w-6 text-green-500" />,
      route: "/ready-to-publish",
      color: "text-green-500",
    },
    {
      title: "Published",
      count: publishedCount,
      icon: <SendHorizonal className="h-6 w-6 text-purple-500" />,
      route: "/published",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {statusCards.map((card) => (
        <StatusCard
          key={card.title}
          title={card.title}
          count={card.count}
          icon={card.icon}
          route={card.route}
          color={card.color}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
