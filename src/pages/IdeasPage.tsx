import React, { useState } from 'react';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';
import IdeasHeader from '@/components/ideas/IdeasHeader';
import IdeasTabs from '@/components/ideas/IdeasTabs';
import { getStatusBadgeClasses, getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';
import { ContentStatus, ContentType } from '@/types';

const IdeasPage = () => {
  const { ideas, isLoading, isError, deleteIdea } = useIdeas();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'all'>('all');
  // Type filter still needed for the IdeasHeader component interface
  const [typeFilter, setTypeFilter] = useState<ContentType | 'all'>('all');
  
  const filteredIdeas = ideas.filter((idea) => {
    // Filter by search
    const matchesSearch = (idea.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (idea.description && idea.description.toLowerCase().includes(searchQuery.toLowerCase()))) || false;
    
    // Filter by status
    let matchesStatus;
    if (statusFilter === 'all') {
      // In "all" view, only show approved ideas
      matchesStatus = idea.status === 'approved';
    } else {
      // Otherwise, show ideas matching the selected status
      matchesStatus = idea.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });
  
  const handleDeleteIdea = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this idea?')) {
      try {
        console.log("Deleting idea with ID:", id); // Add logging
        await deleteIdea(id);
        toast.success("Idea moved to rejected status");
      } catch (error) {
        console.error('Error deleting idea:', error);
        toast.error("Failed to delete idea");
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Ideas</h1>
          <p className="text-muted-foreground">
            Browse and manage your content ideas
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Content Ideas</h1>
          <p className="text-muted-foreground">
            Browse and manage your content ideas
          </p>
        </div>
        <p className="text-muted-foreground">
          There was an error loading your ideas. Please try again.
        </p>
      </div>
    );
  }
  
  const searchActive = searchQuery !== '' || statusFilter !== 'all';
  
  return (
    <div className="space-y-8">
      <IdeasHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />
      
      <IdeasTabs 
        filteredIdeas={filteredIdeas}
        onDeleteIdea={handleDeleteIdea}
        searchActive={searchActive}
        getStatusBadgeClasses={getStatusBadgeClasses}
        getTypeBadgeClasses={getTypeBadgeClasses}
      />
    </div>
  );
};

export default IdeasPage;
