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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[120px] w-full" />
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3">
          <Select value={materialType} onValueChange={setMaterialType}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
            <SelectTrigger className="w-full sm:w-[180px]">
              <SortDesc className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
