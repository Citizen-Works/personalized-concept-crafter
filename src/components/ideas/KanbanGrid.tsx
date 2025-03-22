
import React from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import KanbanColumn from './KanbanColumn';

interface KanbanGridProps {
  ideas: {
    unreviewed: ContentIdea[];
    approved: ContentIdea[];
    rejected: ContentIdea[];
  };
  onDeleteIdea: (id: string) => void;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
}

const KanbanGrid: React.FC<KanbanGridProps> = ({
  ideas,
  onDeleteIdea,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-250px)]">
      <KanbanColumn
        title="Unreviewed"
        ideas={ideas.unreviewed}
        status="unreviewed"
        onDeleteIdea={onDeleteIdea}
        getStatusBadgeClasses={getStatusBadgeClasses}
        getTypeBadgeClasses={getTypeBadgeClasses}
      />
      <KanbanColumn
        title="Approved"
        ideas={ideas.approved}
        status="approved"
        onDeleteIdea={onDeleteIdea}
        getStatusBadgeClasses={getStatusBadgeClasses}
        getTypeBadgeClasses={getTypeBadgeClasses}
      />
      <KanbanColumn
        title="Rejected"
        ideas={ideas.rejected}
        status="rejected"
        onDeleteIdea={onDeleteIdea}
        getStatusBadgeClasses={getStatusBadgeClasses}
        getTypeBadgeClasses={getTypeBadgeClasses}
      />
    </div>
  );
};

export default KanbanGrid;
