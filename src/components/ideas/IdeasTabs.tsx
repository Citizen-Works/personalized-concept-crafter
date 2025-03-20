
import React, { useState } from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { Tabs } from "@/components/ui/tabs";
import ViewModeToggle from './ViewModeToggle';
import IdeasTabsList from './IdeasTabsList';
import IdeasTabsContent from './IdeasTabsContent';

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
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col space-y-4">
            <IdeasTabsList filteredIdeas={filteredIdeas} />
            
            <div className="flex justify-end mb-4">
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            <IdeasTabsContent
              viewMode={viewMode}
              filteredIdeas={filteredIdeas}
              onDeleteIdea={onDeleteIdea}
              searchActive={searchActive}
              getStatusBadgeClasses={getStatusBadgeClasses}
              getTypeBadgeClasses={getTypeBadgeClasses}
            />
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default IdeasTabs;
