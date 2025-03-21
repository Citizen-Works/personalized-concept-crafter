
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
import { Search, SortDesc, SlidersHorizontal } from "lucide-react";
import DocumentCard from "@/components/documents/DocumentCard";
import DocumentsEmptyState from "@/components/documents/DocumentsEmptyState";
import { Document } from "@/types";

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
  isDocumentProcessing
}) => {
  if (documents.length === 0) {
    return (
      <DocumentsEmptyState
        onOpenUpload={onOpenUpload}
        onOpenAddText={onOpenAddText}
      />
    );
  }

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
            <SelectItem value="meeting_transcript">Meeting Transcript</SelectItem>
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
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No materials match your filters</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setMaterialType("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onView={() => onViewDocument(doc.id)}
              onProcess={onProcessTranscript}
              isProcessing={isDocumentProcessing(doc.id)}
              onEdit={onEditDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceMaterialsContent;
