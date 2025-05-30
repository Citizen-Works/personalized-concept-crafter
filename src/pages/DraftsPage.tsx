
import React, { useState, useEffect } from 'react';
import { DraftsHeader } from '@/components/drafts/DraftsHeader';
import { DraftsFilters } from '@/components/drafts/DraftsFilters';
import { DraftList } from '@/components/drafts/DraftList';
import { DraftsEmptyState } from '@/components/drafts/DraftsEmptyState';
import { BulkActions } from '@/components/drafts/BulkActions';
import { ContentType, DraftStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { DraftError } from '@/components/drafts/DraftError';
import { useDraftsAdapter } from '@/hooks/api/adapters/useDraftsAdapter';

const DraftsPage = () => {
  const { drafts, isLoading, isError, deleteDraft, updateDraft } = useDraftsAdapter();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const [isClientReady, setIsClientReady] = useState(false);
  
  // Ensure hydration is complete before rendering content that might differ between server and client
  useEffect(() => {
    setIsClientReady(true);
  }, []);
  
  // Filter drafts based on search query and filters
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch = draft.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || draft.contentType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const hasFilters = searchQuery !== '' || typeFilter !== 'all';
  
  // Selection handling
  const toggleSelectAll = () => {
    if (selectedDrafts.length === filteredDrafts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(filteredDrafts.map(draft => draft.id));
    }
  };

  const toggleSelectDraft = (draftId: string) => {
    setSelectedDrafts(prev => 
      prev.includes(draftId) 
        ? prev.filter(id => id !== draftId)
        : [...prev, draftId]
    );
  };
  
  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedDrafts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedDrafts.length} drafts?`)) {
      try {
        // Delete each selected draft
        for (const draftId of selectedDrafts) {
          await deleteDraft(draftId);
        }
        
        toast.success(`${selectedDrafts.length} drafts deleted successfully`);
        setSelectedDrafts([]);
      } catch (error) {
        console.error('Error deleting drafts:', error);
        toast.error('Failed to delete drafts');
      }
    }
  };
  
  const handleBulkStatusChange = async (status: DraftStatus) => {
    if (selectedDrafts.length === 0) return;
    
    try {
      // Update status for each selected draft
      for (const draftId of selectedDrafts) {
        await updateDraft({ id: draftId, status });
      }
      
      toast.success(`${selectedDrafts.length} drafts updated to ${status}`);
      setSelectedDrafts([]);
    } catch (error) {
      console.error('Error updating drafts:', error);
      toast.error('Failed to update drafts');
    }
  };

  // Return early if client-side hydration isn't complete yet
  if (!isClientReady) {
    return (
      <div className="space-y-8">
        <DraftsHeader />
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <DraftsHeader />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 w-full">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <DraftError />;
  }
  
  return (
    <div className="space-y-6">
      <DraftsHeader />
      
      <DraftsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      
      {selectedDrafts.length > 0 && (
        <BulkActions 
          selectedCount={selectedDrafts.length}
          onDelete={handleBulkDelete}
          onStatusChange={handleBulkStatusChange}
        />
      )}
      
      {filteredDrafts.length > 0 ? (
        <DraftList 
          drafts={filteredDrafts}
          selectedDrafts={selectedDrafts}
          onToggleSelect={toggleSelectDraft}
          onToggleSelectAll={toggleSelectAll}
          onDelete={deleteDraft}
          isMobile={isMobile}
        />
      ) : (
        <DraftsEmptyState hasFilters={hasFilters} />
      )}
    </div>
  );
};

export default DraftsPage;
