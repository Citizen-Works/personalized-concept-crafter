
import React, { useState, useMemo } from 'react';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';
import { ContentType } from '@/types';
import { 
  DeleteConfirmDialog,
  EmptyDraftsState,
  DraftsLoadingState,
  DraftsTable,
  DraftsTableControls
} from './ready-to-publish';

interface DraftsTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const DraftsTab: React.FC<DraftsTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { drafts, isLoading, updateDraft, deleteDraft } = useDrafts();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  
  // Filter drafts based on search, date range, and content type
  const filteredDrafts = useMemo(() => {
    return drafts.filter(draft => {
      // Filter by status (show drafted status)
      if (draft.status !== 'draft') return false;
      
      // Filter by search query
      if (searchQuery && !draft.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !draft.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by date range
      const draftDate = new Date(draft.createdAt);
      if (dateRange[0] && draftDate < dateRange[0]) return false;
      if (dateRange[1]) {
        const endDate = new Date(dateRange[1]);
        endDate.setHours(23, 59, 59, 999);
        if (draftDate > endDate) return false;
      }
      
      // Filter by content type
      if (contentTypeFilter !== "all" && draft.contentType !== contentTypeFilter) {
        return false;
      }
      
      return true;
    });
  }, [drafts, searchQuery, dateRange, contentTypeFilter]);
  
  // Sort filtered drafts
  const sortedDrafts = useMemo(() => {
    return [...filteredDrafts].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'alphabetical') {
        return a.ideaTitle.localeCompare(b.ideaTitle);
      }
      return 0;
    });
  }, [filteredDrafts, sortOrder]);
  
  // Handle toggle select
  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedItems.length === sortedDrafts.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedDrafts.map(draft => draft.id));
    }
  };
  
  // Handle mark as ready
  const handleMarkAsReady = async (id: string) => {
    try {
      await updateDraft({ id, status: 'ready' });
      toast.success("Draft marked as ready to publish");
    } catch (error) {
      console.error("Error updating draft:", error);
      toast.error("Failed to update draft status");
    }
  };
  
  // Handle batch mark as ready
  const handleBatchMarkAsReady = async () => {
    try {
      const promises = selectedItems.map(id => updateDraft({ id, status: 'ready' }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} drafts marked as ready to publish`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch updating drafts:", error);
      toast.error("Failed to update selected drafts");
    }
  };
  
  // Handle delete draft
  const handleDelete = async (id: string) => {
    try {
      await deleteDraft(id);
      toast.success("Draft deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.error("Failed to delete draft");
    }
  };
  
  // Handle batch delete
  const handleBatchDelete = async () => {
    try {
      const promises = selectedItems.map(id => deleteDraft(id));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} drafts deleted`);
      setSelectedItems([]);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Error batch deleting drafts:", error);
      toast.error("Failed to delete selected drafts");
    }
  };
  
  // Request delete
  const handleRequestDelete = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  if (isLoading) {
    return <DraftsLoadingState />;
  }
  
  if (sortedDrafts.length === 0) {
    return <EmptyDraftsState />;
  }
  
  return (
    <div className="space-y-4">
      {/* Top controls */}
      <DraftsTableControls 
        selectedItemsCount={selectedItems.length}
        totalItemsCount={sortedDrafts.length}
        onSelectAll={handleSelectAll}
        onBatchMarkAsReady={handleBatchMarkAsReady}
        onBatchDeleteRequest={() => setDeleteConfirmOpen(true)}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />
      
      {/* Drafts table */}
      <DraftsTable 
        drafts={sortedDrafts}
        selectedItems={selectedItems}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleSelectAll}
        onMarkAsReady={handleMarkAsReady}
        onRequestDelete={handleRequestDelete}
      />
      
      {/* Delete confirmation */}
      <DeleteConfirmDialog 
        open={deleteConfirmOpen} 
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => {
          if (itemToDelete) {
            handleDelete(itemToDelete);
          } else {
            handleBatchDelete();
          }
        }}
        onCancel={() => {
          setItemToDelete(null);
          setDeleteConfirmOpen(false);
        }}
      />
    </div>
  );
};
