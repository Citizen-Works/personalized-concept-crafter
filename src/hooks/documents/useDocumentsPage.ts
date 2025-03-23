
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { Document } from '@/types';

export function useDocumentsPage() {
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
  
  return {
    // State
    isModalOpen,
    setIsModalOpen,
    searchTerm,
    setSearchTerm,
    purposeFilter,
    setPurposeFilter,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    
    // Derived state
    documents,
    filteredDocuments,
    isLoading,
    noDocuments,
    noFilteredResults,
    
    // Handlers
    handleArchive,
    handleViewDocument,
    handleEditDocument,
    resetFilters,
    processTranscript,
    isDocumentProcessing
  };
}
