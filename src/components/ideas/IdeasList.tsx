
import React from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import IdeaCard from './IdeaCard';
import EmptyIdeasState from './EmptyIdeasState';

interface IdeasListProps {
  ideas: ContentIdea[];
  status?: ContentStatus | 'all';
  onDeleteIdea: (id: string) => void;
  searchActive: boolean;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
}

const IdeasList: React.FC<IdeasListProps> = ({ 
  ideas, 
  status = 'all', 
  onDeleteIdea,
  searchActive,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  const filteredIdeas = status === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.status === status);

  if (filteredIdeas.length === 0) {
    return (
      <EmptyIdeasState 
        message={status === 'all' ? "No content ideas found" : `No ${status} ideas found`}
        searchActive={searchActive}
      />
    );
  }

  return (
    <div className="space-y-4">
      {filteredIdeas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          onDeleteIdea={onDeleteIdea}
          getStatusBadgeClasses={getStatusBadgeClasses}
          getTypeBadgeClasses={getTypeBadgeClasses}
        />
      ))}
    </div>
  );
};

export default IdeasList;
