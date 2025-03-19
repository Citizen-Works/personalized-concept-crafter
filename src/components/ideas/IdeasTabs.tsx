
import React, { useState } from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IdeasList from './IdeasList';
import KanbanView from './KanbanView';
import { ListFilter, KanbanSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
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
          
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2 border rounded-md p-1">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode('list')}
              >
                <ListFilter className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                className="h-8 px-2"
                onClick={() => setViewMode('kanban')}
              >
                <KanbanSquare className="h-4 w-4 mr-1" />
                Kanban
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
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
          ) : (
            <TabsContent value="all" className="mt-0">
              <KanbanView
                ideas={filteredIdeas}
                onDeleteIdea={onDeleteIdea}
                searchActive={searchActive}
                getStatusBadgeClasses={getStatusBadgeClasses}
                getTypeBadgeClasses={getTypeBadgeClasses}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default IdeasTabs;
