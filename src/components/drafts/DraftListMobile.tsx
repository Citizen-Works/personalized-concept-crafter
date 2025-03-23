
import React from 'react';
import { DraftWithIdea } from '@/hooks/useDrafts';
import { DraftContentCard } from '@/components/shared';

interface DraftListMobileProps {
  drafts: DraftWithIdea[];
  selectedDrafts: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DraftListMobile: React.FC<DraftListMobileProps> = ({ 
  drafts, 
  selectedDrafts, 
  onToggleSelect, 
  onDelete 
}) => {
  return (
    <div className="space-y-3">
      {drafts.map((draft) => (
        <DraftContentCard
          key={draft.id}
          draft={draft}
          isSelected={selectedDrafts.includes(draft.id)}
          onToggleSelect={onToggleSelect}
          onDelete={onDelete}
          showCheckbox={true}
          contentPreviewLength={60} // Shorter preview for mobile
        />
      ))}
    </div>
  );
};
