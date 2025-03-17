
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import IdeasFilters from './IdeasFilters';
import IdeasSearch from './IdeasSearch';

interface IdeasHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  typeFilter: string;
  setStatusFilter: (status: any) => void;
  setTypeFilter: (type: any) => void;
}

const IdeasHeader: React.FC<IdeasHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  typeFilter,
  setStatusFilter,
  setTypeFilter
}) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Content Ideas</h1>
        <p className="text-muted-foreground">
          Browse and manage your content ideas
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <IdeasSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <IdeasFilters
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            setStatusFilter={setStatusFilter}
            setTypeFilter={setTypeFilter}
          />
          
          <Button asChild className="ml-auto">
            <Link to="/ideas/new" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              New Idea
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default IdeasHeader;
