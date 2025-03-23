
import React from 'react';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { IdeaContentCard } from '@/components/shared/IdeaContentCard';
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
        <IdeaContentCard
          key={idea.id}
          idea={idea}
          onDelete={onDeleteIdea}
          showCheckbox={false}
          onGenerate={(id) => window.location.href = `/ideas/${id}`}
        />
      ))}
    </div>
  );
};

export default IdeasList;
