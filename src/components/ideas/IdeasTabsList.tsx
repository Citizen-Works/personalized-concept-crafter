
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentIdea } from '@/types';
import TabCountBadge from './TabCountBadge';

interface IdeasTabsListProps {
  filteredIdeas: ContentIdea[];
}

const IdeasTabsList: React.FC<IdeasTabsListProps> = ({ filteredIdeas }) => {
  const unreviewedCount = filteredIdeas.filter(idea => idea.status === 'unreviewed').length;
  const approvedCount = filteredIdeas.filter(idea => idea.status === 'approved').length;
  const usedCount = filteredIdeas.filter(idea => idea.hasBeenUsed).length;
  
  return (
    <TabsList className="mb-4">
      <TabsTrigger value="all" className="relative">
        All
        <TabCountBadge count={filteredIdeas.length} />
      </TabsTrigger>
      <TabsTrigger value="unreviewed" className="relative">
        Unreviewed
        <TabCountBadge count={unreviewedCount} />
      </TabsTrigger>
      <TabsTrigger value="approved" className="relative">
        Approved
        <TabCountBadge count={approvedCount} />
      </TabsTrigger>
      <TabsTrigger value="used" className="relative">
        Used
        <TabCountBadge count={usedCount} />
      </TabsTrigger>
    </TabsList>
  );
};

export default IdeasTabsList;
