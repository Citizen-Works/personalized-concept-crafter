
import React from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdeasList from './IdeasList';

interface IdeasTabsProps {
  filteredIdeas: ContentIdea[];
  onDeleteIdea: (id: string) => void;
  searchActive: boolean;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
}

const IdeasTabs: React.FC<IdeasTabsProps> = ({
  filteredIdeas,
  onDeleteIdea,
  searchActive,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all" className="relative">
          All
          <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
            {filteredIdeas.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="unreviewed" className="relative">
          Unreviewed
          <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
            {filteredIdeas.filter(idea => idea.status === 'unreviewed').length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="approved" className="relative">
          Approved
          <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
            {filteredIdeas.filter(idea => idea.status === 'approved').length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="drafted" className="relative">
          Drafted
          <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
            {filteredIdeas.filter(idea => idea.status === 'drafted').length}
          </span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="all" className="mt-0">
        <IdeasList 
          ideas={filteredIdeas}
          onDeleteIdea={onDeleteIdea}
          searchActive={searchActive}
          getStatusBadgeClasses={getStatusBadgeClasses}
          getTypeBadgeClasses={getTypeBadgeClasses}
        />
      </TabsContent>
      
      {['unreviewed', 'approved', 'drafted'].map((status) => (
        <TabsContent key={status} value={status} className="mt-0">
          <IdeasList 
            ideas={filteredIdeas}
            status={status as ContentStatus}
            onDeleteIdea={onDeleteIdea}
            searchActive={searchActive}
            getStatusBadgeClasses={getStatusBadgeClasses}
            getTypeBadgeClasses={getTypeBadgeClasses}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default IdeasTabs;
