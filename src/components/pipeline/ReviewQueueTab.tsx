
import React from 'react';
import { ContentType } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BatchActions,
  DeleteConfirmDialog,
  EmptyReviewQueue,
  PreviewDialog,
  ReviewQueueItem,
  ReviewQueueSkeleton,
  SelectAll
} from './review-queue';
import { useReviewQueue } from './review-queue/useReviewQueue';

interface ReviewQueueTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const ReviewQueueTab: React.FC<ReviewQueueTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const {
    filteredIdeas,
    isLoading,
    selectedItems,
    previewIdea,
    previewItem,
    deleteConfirmOpen,
    handleToggleSelect,
    handleSelectAll,
    handleApprove,
    handleArchive,
    handleDelete,
    handleConfirmDelete,
    handleBatchApprove,
    handleBatchArchive,
    setPreviewItem,
    setDeleteConfirmOpen,
    setItemToDelete
  } = useReviewQueue({ searchQuery, dateRange, contentTypeFilter });
  
  if (isLoading) {
    return <ReviewQueueSkeleton />;
  }
  
  if (filteredIdeas.length === 0) {
    return <EmptyReviewQueue />;
  }
  
  return (
    <div className="space-y-4">
      {/* Batch actions */}
      <BatchActions 
        selectedItems={selectedItems}
        onBatchApprove={handleBatchApprove}
        onBatchArchive={handleBatchArchive}
      />
      
      {/* Select all */}
      <SelectAll 
        hasItems={filteredIdeas.length > 0}
        allSelected={filteredIdeas.length > 0 && selectedItems.length === filteredIdeas.length}
        onSelectAll={handleSelectAll}
      />
      
      {/* Review items */}
      {filteredIdeas.map((idea) => (
        <ReviewQueueItem
          key={idea.id}
          idea={idea}
          isSelected={selectedItems.includes(idea.id)}
          onToggleSelect={handleToggleSelect}
          onPreview={() => setPreviewItem(idea.id)}
          onApprove={handleApprove}
          onArchive={handleArchive}
          onDelete={handleDelete}
        />
      ))}
      
      {/* Preview dialog */}
      <PreviewDialog
        previewIdea={previewIdea}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        onApprove={handleApprove}
        onArchive={handleArchive}
      />
      
      {/* Delete confirmation */}
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
};
