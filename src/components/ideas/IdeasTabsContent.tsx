
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import IdeasList from './IdeasList';
import KanbanView from './KanbanView';

interface IdeasTabsContentProps {
  viewMode: 'list' | 'kanban';
  filteredIdeas: ContentIdea[];
  onDeleteIdea: (id: string) => void;
  searchActive: boolean;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
}

const IdeasTabsContent: React.FC<IdeasTabsContentProps> = ({
  viewMode,
  filteredIdeas,
  onDeleteIdea,
  searchActive,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  if (viewMode === 'kanban') {
    return (
      <TabsContent value="all" className="mt-0">
        <KanbanView
          ideas={filteredIdeas}
          onDeleteIdea={onDeleteIdea}
          searchActive={searchActive}
          getStatusBadgeClasses={getStatusBadgeClasses}
          getTypeBadgeClasses={getTypeBadgeClasses}
        />
      </TabsContent>
    );
  }

  return (
    <>
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
    </>
  );
};

export default IdeasTabsContent;
