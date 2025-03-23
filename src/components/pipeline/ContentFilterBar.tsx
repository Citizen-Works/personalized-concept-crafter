
import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/types";
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const isMobile = useIsMobile();
  
  // Check if any filters are applied
  const hasActiveFilters = 
    searchQuery !== "" || 
    dateRange[0] !== undefined || 
    dateRange[1] !== undefined || 
    contentTypeFilter !== "all";
  
  // Mobile filter sheet component
  const MobileFilters = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-10 w-10"
          aria-label="Filter content"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Apply filters to narrow your content results
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="mobile-date-range" className="text-sm font-medium">
              Date Range
            </label>
            <DateRangePicker 
              value={dateRange} 
              onChange={setDateRange} 
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="mobile-content-type" className="text-sm font-medium">
              Content Type
            </label>
            <Select 
              value={contentTypeFilter} 
              onValueChange={(value) => setContentTypeFilter(value as ContentType | "all")}
            >
              <SelectTrigger className="w-full" id="mobile-content-type">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={onResetFilters} 
              className="w-full mt-4"
            >
              <X className="h-4 w-4 mr-2" />
              Reset All Filters
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
  
  if (isMobile) {
    return (
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <MobileFilters />
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex-none">Active filters:</span>
            {dateRange[0] && <span className="bg-muted/50 px-2 py-1 rounded-full">Date filter</span>}
            {contentTypeFilter !== "all" && (
              <span className="bg-muted/50 px-2 py-1 rounded-full">
                {contentTypeFilter.charAt(0).toUpperCase() + contentTypeFilter.slice(1)}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
  
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
