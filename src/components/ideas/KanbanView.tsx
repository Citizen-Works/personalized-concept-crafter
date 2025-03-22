
import React, { useMemo } from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import EmptyIdeasState from './EmptyIdeasState';
import KanbanGrid from './KanbanGrid';

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
  // Group ideas by status - memoized to avoid recalculation on every render
  const groupedIdeas = useMemo(() => {
    return {
      unreviewed: ideas.filter(idea => idea.status === 'unreviewed'),
      approved: ideas.filter(idea => idea.status === 'approved'),
      rejected: ideas.filter(idea => idea.status === 'rejected')
    };
  }, [ideas]);

  if (ideas.length === 0) {
    return (
      <EmptyIdeasState 
        message="No content ideas found" 
        searchActive={searchActive} 
      />
    );
  }

  return (
    <KanbanGrid
      ideas={groupedIdeas}
      onDeleteIdea={onDeleteIdea}
      getStatusBadgeClasses={getStatusBadgeClasses}
      getTypeBadgeClasses={getTypeBadgeClasses}
    />
  );
};

export default KanbanView;
