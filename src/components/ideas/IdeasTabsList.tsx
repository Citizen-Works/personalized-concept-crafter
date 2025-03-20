
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
  const draftedCount = filteredIdeas.filter(idea => idea.status === 'drafted').length;
  
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
      <TabsTrigger value="drafted" className="relative">
        Drafted
        <TabCountBadge count={draftedCount} />
      </TabsTrigger>
    </TabsList>
  );
};

export default IdeasTabsList;
