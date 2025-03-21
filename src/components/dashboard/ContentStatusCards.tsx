
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
      icon: <FileText className="h-6 w-6 text-primary" />,
      route: "/review-queue",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "In Progress",
      count: inProgressCount,
      icon: <Edit className="h-6 w-6 text-secondary" />,
      route: "/ideas",
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Ready to Publish",
      count: readyToPublishCount,
      icon: <Check className="h-6 w-6 text-teal" />,
      route: "/ready-to-publish",
      color: "bg-teal/10 text-teal",
    },
    {
      title: "Published",
      count: publishedCount,
      icon: <SendHorizonal className="h-6 w-6 text-accent" />,
      route: "/published",
      color: "bg-accent/10 text-accent",
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
