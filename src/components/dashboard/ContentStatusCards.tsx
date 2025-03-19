
import React from 'react';
import { FileText, Edit, Check, SendHorizonal } from 'lucide-react';
import { StatusCard } from './StatusCard';

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
