
import React from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import IdeaCard from './IdeaCard';

interface KanbanColumnProps {
  title: string;
  ideas: ContentIdea[];
  status: ContentStatus;
  onDeleteIdea: (id: string) => void;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  ideas,
  status,
  onDeleteIdea,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>{title}</span>
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
            {ideas.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto pb-6">
        {ideas.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
            No ideas in this column
          </div>
        ) : (
          <div className="space-y-3">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onDeleteIdea={onDeleteIdea}
                getStatusBadgeClasses={getStatusBadgeClasses}
                getTypeBadgeClasses={getTypeBadgeClasses}
                hideStatusBadge={true}
                hideTypeBadge={true}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KanbanColumn;
