
import React from 'react';
import { ContentType } from '@/types';
import { getTypeBadgeClasses, getStatusBadgeClasses } from '@/components/ideas/BadgeUtils';
import { 
  IdeaCard, 
  IdeasEmptyState, 
  IdeasDeleteDialog,
  IdeasListHeader,
  IdeasLoadingState,
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
  } = useIdeasList({ searchQuery, dateRange, contentTypeFilter });
  
  if (isLoading) {
    return <IdeasLoadingState />;
  }
  
  if (sortedIdeas.length === 0) {
    return <IdeasEmptyState searchActive={!!searchQuery || !!dateRange[0] || contentTypeFilter !== "all"} />;
  }
  
  return (
    <div className="space-y-4">
      {/* Top controls */}
      <IdeasListHeader 
        selectedItems={selectedItems}
        sortedIdeasLength={sortedIdeas.length}
        sortOrder={sortOrder}
        onToggleSelectAll={handleSelectAll}
        onDeleteSelected={() => setDeleteConfirmOpen(true)}
        onChangeSortOrder={setSortOrder}
      />
      
      {/* Ideas list */}
      {sortedIdeas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          isSelected={selectedItems.includes(idea.id)}
          onToggleSelect={handleToggleSelect}
          onDeleteClick={(id) => {
            setItemToDelete(id);
            setDeleteConfirmOpen(true);
          }}
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
      />
    </div>
  );
};
