
import React from 'react';
import { ContentType } from "@/types";
import {
  BatchActions,
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
    isUpdating,
    selectedItems,
    previewIdea,
    previewItem,
    handleToggleSelect,
    handleSelectAll,
    handleApprove,
    handleReject,
    handleBatchApprove,
    handleBatchReject,
    setPreviewItem
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
        onBatchReject={handleBatchReject}
        isUpdating={isUpdating}
      />
      
      {/* Select all */}
      <SelectAll 
        hasItems={filteredIdeas.length > 0}
        allSelected={filteredIdeas.length > 0 && selectedItems.length === filteredIdeas.length}
        onSelectAll={handleSelectAll}
        isDisabled={isUpdating}
      />
      
      {/* Review items */}
      {filteredIdeas.map((idea) => (
        <ReviewQueueItem
          key={idea.id}
          idea={idea}
          isSelected={selectedItems.includes(idea.id)}
          isUpdating={isUpdating}
          onToggleSelect={handleToggleSelect}
          onPreview={() => setPreviewItem(idea.id)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      ))}
      
      {/* Preview dialog */}
      <PreviewDialog
        previewIdea={previewIdea}
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isUpdating={isUpdating}
      />
    </div>
  );
};
