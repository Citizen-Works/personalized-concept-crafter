
import React, { useState, useMemo } from 'react';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';
import { ContentType } from '@/types';
import {
  EmptyPublishedState,
  PublishedContentSkeleton,
  PublishedContentCard,
  DeleteConfirmDialog
} from './published';

interface PublishedTabProps {
  searchQuery: string;
  dateRange: [Date | undefined, Date | undefined];
  contentTypeFilter: ContentType | "all";
}

export const PublishedTab: React.FC<PublishedTabProps> = ({ 
  searchQuery, 
  dateRange, 
  contentTypeFilter 
}) => {
  const { drafts, isLoading, updateDraft, deleteDraft } = useDrafts();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Filter drafts based on search, date range, and content type
  const filteredDrafts = useMemo(() => {
    return drafts.filter(draft => {
      // Filter by status (show published status)
      if (draft.status !== 'published') return false;
      
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
  
  // Handle archive
  const handleArchive = async (id: string) => {
    try {
      await updateDraft({ id, status: 'archived' });
      toast.success("Content archived");
    } catch (error) {
      console.error("Error archiving draft:", error);
      toast.error("Failed to archive content");
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

  // Handle delete request
  const handleDeleteRequest = (id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  if (isLoading) {
    return <PublishedContentSkeleton />;
  }
  
  if (filteredDrafts.length === 0) {
    return <EmptyPublishedState />;
  }
  
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDrafts.map((draft) => (
          <PublishedContentCard
            key={draft.id}
            id={draft.id}
            title={draft.ideaTitle}
            content={draft.content}
            contentType={draft.contentType}
            createdAt={draft.createdAt}
            onArchive={handleArchive}
            onDeleteRequest={handleDeleteRequest}
          />
        ))}
      </div>
      
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={() => itemToDelete && handleDelete(itemToDelete)}
      />
    </>
  );
};
