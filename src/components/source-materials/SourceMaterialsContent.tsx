
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Search, SortDesc, SlidersHorizontal, Upload, Plus } from "lucide-react";
import SourceMaterialsList from "./SourceMaterialsList";
import { DocumentContentCard } from '@/components/shared';
import { Document } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface SourceMaterialsContentProps {
  documents: Document[];
  filteredDocuments: Document[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  materialType: string;
  setMaterialType: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  onViewDocument: (id: string) => void;
  onProcessTranscript: (id: string) => void;
  onOpenUpload: () => void;
  onOpenAddText: () => void;
  onEditDocument: (document: Document) => void;
  isDocumentProcessing: (id: string) => boolean;
  isLoading?: boolean;
}

const SourceMaterialsContent: React.FC<SourceMaterialsContentProps> = ({
  documents,
  filteredDocuments,
  searchQuery,
  setSearchQuery,
  materialType,
  setMaterialType,
  sortOrder,
  setSortOrder,
  onViewDocument,
  onProcessTranscript,
  onOpenUpload,
  onOpenAddText,
  onEditDocument,
  isDocumentProcessing,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-muted/10">
        <h3 className="text-lg font-medium mb-2">No Source Materials Yet</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          Add source materials to extract content ideas and improve your content generation.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onOpenAddText}>
            <Plus className="h-4 w-4 mr-2" />
            Add Text
          </Button>
          <Button onClick={onOpenUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>
    );
  }

  const clearFilters = () => {
    setSearchQuery("");
    setMaterialType("all");
    setSortOrder("newest");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,auto] gap-4">
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
          <SelectTrigger className="w-full md:w-40">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Type" />
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
        
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-full md:w-40">
            <SortDesc className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <SourceMaterialsList
        filteredDocuments={filteredDocuments}
        onViewDocument={onViewDocument}
        onProcessTranscript={onProcessTranscript}
        onClearFilters={clearFilters}
        isDocumentProcessing={isDocumentProcessing}
      />
    </div>
  );
};

export default SourceMaterialsContent;
