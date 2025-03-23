
import React from 'react';
import DocumentsHeader from '@/components/documents/DocumentsHeader';
import DocumentsSearchAndFilter from '@/components/documents/DocumentsSearchAndFilter';
import DocumentsActionButtons from '@/components/documents/DocumentsActionButtons';
import DocumentsEmptyState from '@/components/documents/DocumentsEmptyState';
import DocumentsEmptyResults from '@/components/documents/DocumentsEmptyResults';
import DocumentsLoadingSkeleton from '@/components/documents/DocumentsLoadingSkeleton';
import DocumentsGrid from '@/components/documents/DocumentsGrid';
import DocumentUploadModal from '@/components/documents/DocumentUploadModal';
import { useDocumentsPage } from '@/hooks/documents/useDocumentsPage';
import { FileText } from 'lucide-react';

const DocumentsPage = () => {
  const {
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
    documents,
    filteredDocuments,
    isLoading,
    noDocuments,
    noFilteredResults,
    handleArchive,
    handleViewDocument,
    handleEditDocument,
    resetFilters,
    processTranscript,
    isDocumentProcessing
  } = useDocumentsPage();

  return (
    <div className="space-y-6 sm:space-y-8">
      <DocumentsHeader onOpenCreateModal={() => setIsModalOpen(true)} />

      {!noDocuments && (
        <>
          <DocumentsSearchAndFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            purposeFilter={purposeFilter}
            setPurposeFilter={setPurposeFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            resetFilters={resetFilters}
          />
          
          <DocumentsActionButtons onOpenModal={() => setIsModalOpen(true)} />
        </>
      )}
      
      {isLoading ? (
        <DocumentsLoadingSkeleton />
      ) : noDocuments ? (
        <DocumentsEmptyState 
          onOpenUpload={() => setIsModalOpen(true)} 
          onOpenAddText={() => setIsModalOpen(true)} 
        />
      ) : noFilteredResults ? (
        <DocumentsEmptyResults resetFilters={resetFilters} />
      ) : (
        <DocumentsGrid
          documents={filteredDocuments}
          onView={handleViewDocument}
          onEdit={handleEditDocument}
          onArchive={handleArchive}
          onProcess={processTranscript}
          isProcessing={isDocumentProcessing}
        />
      )}

      <DocumentUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default DocumentsPage;
