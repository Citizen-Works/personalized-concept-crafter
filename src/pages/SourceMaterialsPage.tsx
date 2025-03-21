
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  Folder, 
  Search, 
  Upload, 
  Filter, 
  Calendar,
  FileUp,
  PlusCircle,
  SlidersHorizontal
} from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import { Document, DocumentType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SourceMaterialCard } from "@/components/source-materials/SourceMaterialCard";
import { UploadDialog } from "@/components/source-materials/UploadDialog";
import { AddTextDialog } from "@/components/source-materials/AddTextDialog";
import { EmptyState } from "@/components/source-materials/EmptyState";

const SourceMaterialsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [materialType, setMaterialType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [addTextDialogOpen, setAddTextDialogOpen] = useState(false);
  
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
  
  // Fetch documents (both transcripts and other documents)
  const { 
    documents, 
    isLoading, 
    error, 
    refetch,
    processTranscript
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
  
  // Filter and sort documents
  const filteredDocuments = React.useMemo(() => {
    if (!documents) return [];
    
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
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Source Materials</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="p-4">
                    <Skeleton className="h-5 w-2/3" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Source Materials</CardTitle>
            <CardDescription>
              There was a problem loading your source materials. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Source Materials</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleOpenAddText}
          >
            <FileText className="mr-2 h-4 w-4" />
            Add Text
          </Button>
          <Button 
            onClick={handleOpenUpload}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        </div>
      </div>
      
      {documents && documents.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Materials Library</CardTitle>
            <CardDescription>
              Manage your source materials for content creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
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
              
              {filteredDocuments.length === 0 ? (
                <div className="text-center p-8 border rounded-md bg-muted/10">
                  <p className="text-muted-foreground">
                    No materials match your search or filter criteria
                  </p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchQuery("");
                      setMaterialType("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredDocuments.map((doc) => (
                    <SourceMaterialCard 
                      key={doc.id}
                      document={doc}
                      onView={() => handleViewDocument(doc.id)}
                      onProcess={() => handleProcessTranscript(doc.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState 
          onOpenUpload={handleOpenUpload}
          onOpenAddText={handleOpenAddText}
        />
      )}
      
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
          refetch();
          toast({
            title: "Text added",
            description: "Your text has been added to your materials.",
          });
        }}
      />
    </div>
  );
};

export default SourceMaterialsPage;
