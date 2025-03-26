import React, { useState, useMemo } from 'react';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';
import { ContentType } from '@/types';
import { 
  DeleteConfirmDialog,
  EmptyState,
  LoadingState
} from './ready-to-publish';
import { DraftContentCard } from '@/components/shared/DraftContentCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from 'lucide-react';

interface ReadyToPublishTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const ReadyToPublishTab: React.FC<ReadyToPublishTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { drafts, isLoading, updateDraft, deleteDraft } = useDrafts();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  
  // Filter drafts based on search, date range, and content type
  const filteredDrafts = useMemo(() => {
    return drafts.filter(draft => {
      // Filter by status (show ready status)
      if (draft.status !== 'ready') return false;
      
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

  // Sort drafts based on selected sort order
  const sortedDrafts = useMemo(() => {
    const sorted = [...filteredDrafts];
    return sorted.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredDrafts, sortOrder]);
  
  // Handle status change
  const handleStatusChange = async (id: string, status: 'draft' | 'published') => {
    try {
      await updateDraft({ id, status });
      toast.success(`Content ${status === 'published' ? 'marked as published' : 'moved to drafts'}`);
    } catch (error) {
      console.error("Error updating draft status:", error);
      toast.error("Failed to update status");
    }
  };
  
  // Handle delete draft
  const handleDelete = async (id: string) => {
    try {
      await deleteDraft(id);
      toast.success("Content deleted");
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting draft:", error);
      toast.error("Failed to delete content");
    }
  };
  
  // Handler for delete request
  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };

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

  // Handle batch publish
  const handleBatchPublish = async () => {
    try {
      const promises = selectedItems.map(id => updateDraft({ id, status: 'published' }));
      await Promise.all(promises);
      toast.success(`${selectedItems.length} drafts marked as published`);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error batch publishing drafts:", error);
      toast.error("Failed to publish selected drafts");
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (filteredDrafts.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <>
      {/* Sorting and batch actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Checkbox 
            id="select-all" 
            checked={sortedDrafts.length > 0 && selectedItems.length === sortedDrafts.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All
          </label>
          
          {selectedItems.length > 0 && (
            <Button 
              variant="default" 
              size="sm"
              onClick={handleBatchPublish}
              className="gap-1"
            >
              <CheckCircle className="h-4 w-4" />
              Mark Selected as Published
            </Button>
          )}
        </div>

        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as 'newest' | 'oldest')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {sortedDrafts.map((draft) => (
          <DraftContentCard
            key={draft.id}
            id={draft.id}
            title={draft.ideaTitle}
            content={draft.content}
            contentType={draft.contentType}
            status={draft.status}
            createdAt={draft.createdAt}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteRequest}
            isSelected={selectedItems.includes(draft.id)}
            onToggleSelect={handleToggleSelect}
            showCheckbox={true}
          />
        ))}
      </div>
      
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
        onCancel={() => {
          setItemToDelete(null);
          setDeleteConfirmOpen(false);
        }}
      />
    </>
  );
};
