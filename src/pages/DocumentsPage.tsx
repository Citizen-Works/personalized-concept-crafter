
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload, Search, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';
import { useDocuments } from '@/hooks/useDocuments';
import { Document } from '@/types';
import { DocumentContentCard } from '@/components/shared';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [purposeFilter, setPurposeFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  
  const { 
    documents, 
    isLoading, 
    updateDocumentStatus,
    processTranscript,
    isDocumentProcessing,
  } = useDocuments();
  
  const filteredDocuments = documents.filter((doc: Document) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurpose = purposeFilter === "all" || doc.purpose === purposeFilter;
    const matchesType = typeFilter === "all" || doc.type === typeFilter;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    
    return matchesSearch && matchesPurpose && matchesType && matchesStatus;
  });
  
  const noDocuments = documents.length === 0 && !isLoading;
  const noFilteredResults = documents.length > 0 && filteredDocuments.length === 0;

  const handleArchive = (id: string) => {
    updateDocumentStatus({ id, status: 'archived' });
  };

  const handleViewDocument = (document: Document) => {
    // Navigate to document detail page
    window.location.href = `/documents/${document.id}`;
  };

  const handleEditDocument = (document: Document) => {
    // Open edit dialog
    window.dispatchEvent(
      new CustomEvent('edit-document', { detail: { document } })
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setPurposeFilter("all");
    setTypeFilter("all");
    setStatusFilter("active");
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your content documents and writing samples
        </p>
      </div>

      {!noDocuments && (
        <>
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
          
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" className="gap-1 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button className="gap-1 w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Document
            </Button>
          </div>
        </>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[220px] rounded-lg" />
          ))}
        </div>
      ) : noDocuments ? (
        <div className="flex flex-col items-center justify-center p-4 sm:p-12 text-center border rounded-lg bg-muted/10">
          <FileText className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Documents Yet</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-md">
            Upload writing samples, articles, or other documents to help the AI understand your writing style.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" className="gap-1 w-full" onClick={() => setIsModalOpen(true)}>
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
            <Button className="gap-1 w-full" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Document
            </Button>
          </div>
        </div>
      ) : noFilteredResults ? (
        <div className="flex flex-col items-center justify-center p-4 sm:p-12 text-center border rounded-lg bg-muted/10">
          <Search className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No matching documents</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((document) => (
            <DocumentContentCard
              key={document.id}
              document={document}
              onView={handleViewDocument}
              onEdit={handleEditDocument}
              onArchive={handleArchive}
              onProcess={processTranscript}
              isProcessing={isDocumentProcessing(document.id)}
            />
          ))}
        </div>
      )}

      <DocumentUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DocumentsPage;
