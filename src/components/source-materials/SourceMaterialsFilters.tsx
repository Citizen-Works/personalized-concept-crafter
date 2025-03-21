
import React from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

interface SourceMaterialsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  materialType: string;
  setMaterialType: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const SourceMaterialsFilters: React.FC<SourceMaterialsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  materialType,
  setMaterialType,
  sortOrder,
  setSortOrder
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select value={materialType} onValueChange={setMaterialType}>
        <SelectTrigger>
          <div className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by type" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Materials</SelectItem>
          <SelectItem value="transcript">Transcripts</SelectItem>
          <SelectItem value="document">Documents</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={sortOrder} onValueChange={setSortOrder}>
        <SelectTrigger>
          <div className="flex items-center">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SourceMaterialsFilters;
