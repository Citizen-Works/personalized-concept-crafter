import React from 'react';
import { ContentType } from '@/types';
import { 
  IdeasEmptyState, 
  IdeasDeleteDialog,
  IdeasLoadingState,
  BatchActions,
  SelectAll,
  useIdeasList
} from './ideas';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { IdeaContentCard } from '@/components/shared/IdeaContentCard';

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
  } = useIdeasList({ searchQuery, dateRange, contentTypeFilter });
  
  const handleDeleteButtonClick = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  if (isLoading) {
    return <IdeasLoadingState />;
  }
  
  if (sortedIdeas.length === 0) {
    return <IdeasEmptyState searchActive={!!searchQuery || !!dateRange[0] || contentTypeFilter !== "all"} />;
  }
  
  return (
    <div className="space-y-4">
      {/* Sorting dropdown */}
      <div className="flex justify-end">
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest' | 'unused-first')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unused-first">Unused First</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Batch actions */}
      <BatchActions 
        selectedItems={selectedItems}
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
      <div className="space-y-4">
        {sortedIdeas.map((idea) => (
          <IdeaContentCard
            key={idea.id}
            idea={idea}
            isSelected={selectedItems.includes(idea.id)}
            isUpdating={isDeleting && (itemToDelete === idea.id || selectedItems.includes(idea.id))}
            onToggleSelect={handleToggleSelect}
            onDelete={handleDeleteButtonClick}
            showCheckbox={true}
            showActions={true}
            onGenerate={(id) => window.location.href = `/ideas/${id}`}
          />
        ))}
      </div>
      
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
