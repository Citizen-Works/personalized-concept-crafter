
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDocuments } from "@/hooks/useDocuments";
import { useToast } from "@/hooks/use-toast";
import SourceMaterialsHeader from "@/components/source-materials/SourceMaterialsHeader";
import SourceMaterialsContent from "@/components/source-materials/SourceMaterialsContent";
import SourceMaterialsLoading from "@/components/source-materials/SourceMaterialsLoading";
import SourceMaterialsError from "@/components/source-materials/SourceMaterialsError";
import AddTextDialog from "@/components/source-materials/AddTextDialog";
import UploadDialog from "@/components/source-materials/UploadDialog";
import EditDocumentDialog from "@/components/documents/EditDocumentDialog";
import { Document } from "@/types";

const SourceMaterialsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [materialType, setMaterialType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [addTextDialogOpen, setAddTextDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Initialize the filter states from URL params
  useEffect(() => {
    const typeParam = searchParams.get("type");
    const sortParam = searchParams.get("sort");
    const searchParam = searchParams.get("search");
    
    if (typeParam) setMaterialType(typeParam);
    if (sortParam) setSortOrder(sortParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [searchParams]);
  
  // Fetch documents
  const { 
    documents, 
    isLoading, 
    error, 
    refetch,
    processTranscript,
    isDocumentProcessing
  } = useDocuments();
  
  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (materialType !== "all") {
      params.set("type", materialType);
    } else {
      params.delete("type");
    }
    
    if (sortOrder !== "newest") {
      params.set("sort", sortOrder);
    } else {
      params.delete("sort");
    }
    
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    
    setSearchParams(params, { replace: true });
  }, [materialType, sortOrder, searchQuery, setSearchParams]);
  
  useEffect(() => {
    // Log documents every time they change
    console.log('Documents in SourceMaterialsPage:', documents);
  }, [documents]);
  
  // Filter and sort documents
  const filteredDocuments = React.useMemo(() => {
    console.log('Filtering documents:', documents);
    
    if (!documents || documents.length === 0) {
      console.log('No documents to filter');
      return [];
    }
    
    let filtered = [...documents];
    
    // Filter by material type
    if (materialType !== "all") {
      filtered = filtered.filter(doc => 
        doc.type?.toLowerCase() === materialType
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.content?.toLowerCase().includes(query)
      );
    }
    
    // Sort documents
    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return b.createdAt.getTime() - a.createdAt.getTime();
        case "oldest":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [documents, materialType, searchQuery, sortOrder]);
  
  const handleProcessTranscript = async (id: string) => {
    try {
      await processTranscript(id);
      toast({
        title: "Processing started",
        description: "We're extracting ideas from this material",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Processing failed",
        description: "Failed to extract ideas from this material",
      });
    }
  };
  
  const handleOpenUpload = () => {
    setUploadDialogOpen(true);
  };
  
  const handleOpenAddText = () => {
    setAddTextDialogOpen(true);
  };
  
  const handleViewDocument = (id: string) => {
    navigate(`/source-materials/${id}`);
  };
  
  const handleEditDocument = (document: Document) => {
    setSelectedDocument(document);
    setEditDialogOpen(true);
  };
  
  if (isLoading) {
    return <SourceMaterialsLoading />;
  }
  
  if (error) {
    return <SourceMaterialsError onRetry={refetch} />;
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <SourceMaterialsHeader 
        onOpenAddText={handleOpenAddText}
        onOpenUpload={handleOpenUpload}
      />
      
      <SourceMaterialsContent 
        documents={documents || []}
        filteredDocuments={filteredDocuments}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        materialType={materialType}
        setMaterialType={setMaterialType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onViewDocument={handleViewDocument}
        onProcessTranscript={handleProcessTranscript}
        onOpenUpload={handleOpenUpload}
        onOpenAddText={handleOpenAddText}
        onEditDocument={handleEditDocument}
        isDocumentProcessing={isDocumentProcessing}
      />
      
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={() => {
          refetch();
          toast({
            title: "Upload successful",
            description: "Your file has been uploaded.",
          });
        }}
      />
      
      <AddTextDialog
        open={addTextDialogOpen}
        onOpenChange={setAddTextDialogOpen}
        onSuccess={() => {
          console.log("AddTextDialog onSuccess called, triggering refetch");
          refetch();
          toast({
            title: "Text added",
            description: "Your text has been added to your materials.",
          });
        }}
      />
      
      <EditDocumentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        document={selectedDocument}
      />
    </div>
  );
};

export default SourceMaterialsPage;
