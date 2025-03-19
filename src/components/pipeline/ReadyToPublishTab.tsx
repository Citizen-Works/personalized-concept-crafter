
import React, { useState, useMemo } from 'react';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';
import { ContentType } from '@/types';
import { 
  PublishableCard,
  DeleteConfirmDialog,
  EmptyState,
  LoadingState
} from './ready-to-publish';

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
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
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
  
  // Handle mark as published
  const handleMarkAsPublished = async (id: string) => {
    try {
      await updateDraft({ id, status: 'published' });
      toast.success("Content marked as published");
    } catch (error) {
      console.error("Error updating draft:", error);
      toast.error("Failed to update status");
    }
  };
  
  // Handle copy content
  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Content copied to clipboard");
    
    // Reset copied status after 2 seconds
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
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
  
  // Handler for delete request
  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  // Handle cancel delete
  const handleCancelDelete = () => {
    setItemToDelete(null);
    setDeleteConfirmOpen(false);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (filteredDrafts.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
        {filteredDrafts.map((draft) => (
          <PublishableCard
            key={draft.id}
            draft={draft}
            onCopy={handleCopy}
            onMarkAsPublished={handleMarkAsPublished}
            onDeleteRequest={handleDeleteRequest}
            copiedId={copiedId}
          />
        ))}
      </div>
      
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
        onCancel={handleCancelDelete}
      />
    </>
  );
};
