
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/types";

interface ContentFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: [Date | undefined, Date | undefined];
  setDateRange: (range: [Date | undefined, Date | undefined]) => void;
  contentTypeFilter: ContentType | "all";
  setContentTypeFilter: (type: ContentType | "all") => void;
  onResetFilters: () => void;
}

export const ContentFilterBar: React.FC<ContentFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  contentTypeFilter,
  setContentTypeFilter,
  onResetFilters
}) => {
  // Check if any filters are applied
  const hasActiveFilters = 
    searchQuery !== "" || 
    dateRange[0] !== undefined || 
    dateRange[1] !== undefined || 
    contentTypeFilter !== "all";
  
  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search all content..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-row gap-2">
          <DateRangePicker 
            value={dateRange} 
            onChange={setDateRange} 
            className="w-auto"
          />
          
          <Select 
            value={contentTypeFilter} 
            onValueChange={(value) => setContentTypeFilter(value as ContentType | "all")}
          >
            <SelectTrigger className="w-[150px]">
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
      
      {hasActiveFilters && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onResetFilters}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};
