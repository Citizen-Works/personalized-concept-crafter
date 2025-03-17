
import React from 'react';
import { Input } from "@/components/ui/input";
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
import { ContentType } from '@/types';

type DraftsFiltersProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  typeFilter: ContentType | 'all';
  setTypeFilter: (type: ContentType | 'all') => void;
};

export const DraftsFilters: React.FC<DraftsFiltersProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  typeFilter, 
  setTypeFilter 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
      <div className="flex-1 max-w-md">
        <Input
          placeholder="Search drafts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
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
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
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
      </div>
    </div>
  );
};
