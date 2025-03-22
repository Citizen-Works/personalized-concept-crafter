
import React from 'react';
import { DraftWithIdea } from '@/hooks/useDrafts';
import { DraftListTable } from './DraftListTable';
import { DraftListMobile } from './DraftListMobile';

interface DraftListProps {
  drafts: DraftWithIdea[];
  selectedDrafts: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

export const DraftList: React.FC<DraftListProps> = ({ 
  drafts, 
  selectedDrafts, 
  onToggleSelect, 
  onToggleSelectAll,
  onDelete,
  isMobile = false
}) => {
  // Mobile list view
  if (isMobile) {
    return (
      <DraftListMobile
        drafts={drafts}
        selectedDrafts={selectedDrafts}
        onToggleSelect={onToggleSelect}
        onDelete={onDelete}
      />
    );
  }

  // Desktop table view
  return (
    <DraftListTable
      drafts={drafts}
      selectedDrafts={selectedDrafts}
      onToggleSelect={onToggleSelect}
      onToggleSelectAll={onToggleSelectAll}
      onDelete={onDelete}
    />
  );
};
