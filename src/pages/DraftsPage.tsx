
import React, { useState } from 'react';
import { DraftsHeader } from '@/components/drafts/DraftsHeader';
import { DraftsFilters } from '@/components/drafts/DraftsFilters';
import { DraftListItem } from '@/components/drafts/DraftListItem';
import { DraftsEmptyState } from '@/components/drafts/DraftsEmptyState';
import { ContentType } from '@/types';
import { useDrafts } from '@/hooks/useDrafts';

const DraftsPage = () => {
  const { drafts, isLoading, isError, deleteDraft } = useDrafts();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  
  // Filter drafts based on search query and filters
  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch = draft.ideaTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           draft.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || draft.contentType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const hasFilters = searchQuery !== '' || typeFilter !== 'all';
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <DraftsHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <DraftsHeader />
        <p className="text-muted-foreground">
          There was an error loading your drafts. Please try again.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <DraftsHeader />
      
      <DraftsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      
      <div className="space-y-4">
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((draft) => (
            <DraftListItem 
              key={draft.id} 
              draft={draft} 
              onDelete={deleteDraft}
            />
          ))
        ) : (
          <DraftsEmptyState hasFilters={hasFilters} />
        )}
      </div>
    </div>
  );
};

export default DraftsPage;
