
import React from 'react';
import { FileText, Edit, Check, SendHorizonal, ArrowUpRight, Archive, X } from 'lucide-react';
import { StatusCard } from './StatusCard';

interface ContentStatusCardsProps {
  needsReviewCount: number;
  inProgressCount: number;
  readyToPublishCount: number;
  publishedCount: number;
  approvedIdeasCount: number;
  archivedCount?: number;
  rejectedIdeasCount?: number;
  isLoading: boolean;
}

export const ContentStatusCards = ({ 
  needsReviewCount, 
  inProgressCount, 
  readyToPublishCount, 
  publishedCount,
  approvedIdeasCount,
  archivedCount = 0,
  rejectedIdeasCount = 0,
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
      title: "Approved Ideas",
      count: approvedIdeasCount,
      icon: <ArrowUpRight className="h-6 w-6 text-indigo-600" />,
      route: "/ideas?status=approved",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      title: "In Progress",
      count: inProgressCount,
      icon: <Edit className="h-6 w-6 text-secondary" />,
      route: "/drafts?status=draft",
      color: "bg-secondary/10 text-secondary",
    },
    {
      title: "Ready to Publish",
      count: readyToPublishCount,
      icon: <Check className="h-6 w-6 text-teal" />,
      route: "/drafts?status=ready",
      color: "bg-teal/10 text-teal",
    },
    {
      title: "Published",
      count: publishedCount,
      icon: <SendHorizonal className="h-6 w-6 text-accent" />,
      route: "/drafts?status=published",
      color: "bg-accent/10 text-accent",
    },
    {
      title: "Archived",
      count: archivedCount,
      icon: <Archive className="h-6 w-6 text-gray-600" />,
      route: "/drafts?status=archived",
      color: "bg-gray-100 text-gray-600",
    },
    {
      title: "Rejected Ideas",
      count: rejectedIdeasCount,
      icon: <X className="h-6 w-6 text-red-600" />,
      route: "/ideas?status=rejected",
      color: "bg-red-100 text-red-600",
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
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
