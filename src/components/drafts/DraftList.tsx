
import React from 'react';
import { DraftWithIdea } from '@/hooks/useDrafts';
import { DraftListTable } from './DraftListTable';
import { DraftListMobile } from './DraftListMobile';
import { createResponsiveComponent } from '@/components/ui/responsive-container';

interface DraftListProps {
  drafts: DraftWithIdea[];
  selectedDrafts: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onDelete: (id: string) => void;
  isMobile?: boolean;
}

/**
 * Responsive draft list component that renders either the mobile or desktop version
 * based on the device type.
 */
export const DraftList = createResponsiveComponent<DraftListProps>(
  // Desktop component
  ({ drafts, selectedDrafts, onToggleSelect, onToggleSelectAll, onDelete }) => (
    <DraftListTable
      drafts={drafts}
      selectedDrafts={selectedDrafts}
      onToggleSelect={onToggleSelect}
      onToggleSelectAll={onToggleSelectAll}
      onDelete={onDelete}
    />
  ),
  // Mobile component
  ({ drafts, selectedDrafts, onToggleSelect, onDelete }) => (
    <DraftListMobile
      drafts={drafts}
      selectedDrafts={selectedDrafts}
      onToggleSelect={onToggleSelect}
      onDelete={onDelete}
    />
  )
);
