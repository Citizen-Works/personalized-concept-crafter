
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DocumentsSearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  purposeFilter: string;
  setPurposeFilter: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  resetFilters: () => void;
}

const DocumentsSearchAndFilter: React.FC<DocumentsSearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  purposeFilter,
  setPurposeFilter,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  resetFilters
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Select value={purposeFilter} onValueChange={setPurposeFilter}>
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Purposes</SelectItem>
            <SelectItem value="writing_sample">Writing Samples</SelectItem>
            <SelectItem value="business_context">Business Context</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="blog">Blog</SelectItem>
            <SelectItem value="newsletter">Newsletter</SelectItem>
            <SelectItem value="whitepaper">Whitepaper</SelectItem>
            <SelectItem value="case-study">Case Study</SelectItem>
            <SelectItem value="transcript">Transcript</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DocumentsSearchAndFilter;
