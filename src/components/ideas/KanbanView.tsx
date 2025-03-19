
import React from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import IdeaCard from './IdeaCard';
import EmptyIdeasState from './EmptyIdeasState';
import { KanbanSquare } from 'lucide-react';

interface KanbanViewProps {
  ideas: ContentIdea[];
  onDeleteIdea: (id: string) => void;
  searchActive: boolean;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
}

const KanbanView: React.FC<KanbanViewProps> = ({
  ideas,
  onDeleteIdea,
  searchActive,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  // Group ideas by status
  const unreviewedIdeas = ideas.filter(idea => idea.status === 'unreviewed');
  const approvedIdeas = ideas.filter(idea => idea.status === 'approved');
  const draftedIdeas = ideas.filter(idea => idea.status === 'drafted');

  const renderColumn = (title: string, statusIdeas: ContentIdea[], status: ContentStatus) => {
    return (
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>{title}</span>
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
              {statusIdeas.length}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto pb-6">
          {statusIdeas.length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
              No ideas in this column
            </div>
          ) : (
            <div className="space-y-3">
              {statusIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onDeleteIdea={onDeleteIdea}
                  getStatusBadgeClasses={getStatusBadgeClasses}
                  getTypeBadgeClasses={getTypeBadgeClasses}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (ideas.length === 0) {
    return (
      <EmptyIdeasState 
        message="No content ideas found" 
        searchActive={searchActive} 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
      {renderColumn("Unreviewed", unreviewedIdeas, "unreviewed")}
      {renderColumn("Approved", approvedIdeas, "approved")}
      {renderColumn("Drafted", draftedIdeas, "drafted")}
    </div>
  );
};

export default KanbanView;
