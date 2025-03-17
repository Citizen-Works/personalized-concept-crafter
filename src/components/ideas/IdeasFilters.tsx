
import React from 'react';
import { ContentType } from '@/types';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ChevronDown, Filter } from 'lucide-react';

interface IdeasFiltersProps {
  statusFilter: string;
  typeFilter: string;
  setStatusFilter: (status: any) => void;
  setTypeFilter: (type: any) => void;
}

const IdeasFilters: React.FC<IdeasFiltersProps> = ({ 
  statusFilter, 
  typeFilter, 
  setStatusFilter, 
  setTypeFilter 
}) => {
  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setStatusFilter('all')}>
            All Statuses
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('unreviewed')}>
            Unreviewed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('approved')}>
            Approved
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('drafted')}>
            Drafted
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('ready')}>
            Ready
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStatusFilter('published')}>
            Published
          </DropdownMenuItem>
          
          <DropdownMenuLabel className="mt-2">Filter by Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setTypeFilter('all')}>
            All Types
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTypeFilter('linkedin')}>
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTypeFilter('newsletter')}>
            Newsletter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTypeFilter('marketing')}>
            Marketing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Select onValueChange={(val) => setTypeFilter(val as ContentType | 'all')} value={typeFilter}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Content Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="linkedin">LinkedIn</SelectItem>
          <SelectItem value="newsletter">Newsletter</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default IdeasFilters;
