
import React from 'react';
import { ContentType } from '@/types';
import { getTypeBadgeClasses, getStatusBadgeClasses } from '@/components/ideas/BadgeUtils';
import { 
  IdeaItem,
  IdeasEmptyState, 
  IdeasDeleteDialog,
  IdeasLoadingState,
  BatchActions,
  SelectAll,
  useIdeasList
} from './ideas';

interface IdeasTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const IdeasTab: React.FC<IdeasTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const {
    isLoading,
    sortedIdeas,
    selectedItems,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    itemToDelete,
    setItemToDelete,
    sortOrder,
    setSortOrder,
    handleToggleSelect,
    handleSelectAll,
    handleDeleteConfirm,
    isDeleting,
    handleApprove,
    handleBatchApprove,
  } = useIdeasList({ searchQuery, dateRange, contentTypeFilter });
  
  if (isLoading) {
    return <IdeasLoadingState />;
  }
  
  if (sortedIdeas.length === 0) {
    return <IdeasEmptyState searchActive={!!searchQuery || !!dateRange[0] || contentTypeFilter !== "all"} />;
  }
  
  return (
    <div className="space-y-4">
      {/* Batch actions */}
      <BatchActions 
        selectedItems={selectedItems}
        onBatchApprove={handleBatchApprove}
        isUpdating={isDeleting}
      />
      
      {/* Select all */}
      <SelectAll 
        hasItems={sortedIdeas.length > 0}
        allSelected={sortedIdeas.length > 0 && selectedItems.length === sortedIdeas.length}
        onSelectAll={handleSelectAll}
        isDisabled={isDeleting}
      />
      
      {/* Ideas list */}
      {sortedIdeas.map((idea) => (
        <IdeaItem
          key={idea.id}
          idea={idea}
          isSelected={selectedItems.includes(idea.id)}
          isUpdating={isDeleting}
          onToggleSelect={handleToggleSelect}
          onDelete={(id) => {
            setItemToDelete(id);
            setDeleteConfirmOpen(true);
          }}
          onApprove={handleApprove}
          getStatusBadgeClasses={getStatusBadgeClasses}
          getTypeBadgeClasses={getTypeBadgeClasses}
        />
      ))}
      
      {/* Delete confirmation */}
      <IdeasDeleteDialog
        isOpen={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirmDelete={handleDeleteConfirm}
        itemToDelete={itemToDelete}
        selectedItemsCount={selectedItems.length}
        isLoading={isDeleting}
      />
    </div>
  );
};
