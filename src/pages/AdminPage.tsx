
import React, { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DocumentProcessingStatus } from "@/types/documents";
import { Loader2, CheckCircle, XCircle, AlertTriangle, FileText, RefreshCw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useTranscriptProcessing } from '@/hooks/transcripts/useTranscriptProcessing';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const AdminPage = () => {
  const { user } = useAuth();
  const { documents, isLoading, updateDocumentStatus, processTranscript } = useDocuments();
  const { processingDocuments, handleProcessTranscript, isDocumentProcessing, cancelProcessing } = useTranscriptProcessing(documents);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the admin page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: DocumentProcessingStatus) => {
    switch (status) {
      case 'idle':
        return <Badge variant="outline">Idle</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completed
        </Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleRetryProcessing = (documentId: string) => {
    handleProcessTranscript(documentId, true);
    toast.info("Retrying document processing");
  };

  const handleCancelProcessing = (documentId: string) => {
    cancelProcessing(documentId);
  };

  const handleArchiveDocument = (documentId: string) => {
    updateDocumentStatus({ id: documentId, status: 'archived' });
    toast.success("Document archived successfully");
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => toast.success("Data refreshed")}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="processing">Processing Status</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents Management</CardTitle>
              <CardDescription>
                View and manage all documents in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ideas</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No documents found
                          </TableCell>
                        </TableRow>
                      ) : (
                        documents.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell className="font-medium">{doc.title}</TableCell>
                            <TableCell>{format(doc.createdAt, "MMM d, yyyy")}</TableCell>
                            <TableCell>{getStatusBadge(doc.processing_status)}</TableCell>
                            <TableCell>{doc.has_ideas ? doc.ideas_count : "None"}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {doc.processing_status === 'processing' || isDocumentProcessing(doc.id) ? (
                                    <DropdownMenuItem 
                                      className="text-red-600 focus:text-red-600"
                                      onClick={() => handleCancelProcessing(doc.id)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Processing
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleRetryProcessing(doc.id)}>
                                      <RefreshCw className="h-4 w-4 mr-2" />
                                      Process Document
                                    </DropdownMenuItem>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem 
                                        onSelect={(e) => e.preventDefault()}
                                        className="text-red-600 focus:text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Archive Document
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will archive the document "{doc.title}". This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          onClick={() => handleArchiveDocument(doc.id)}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Archive
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Processing Status</CardTitle>
              <CardDescription>
                Monitor and manage document processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Processing stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Active Processing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{processingDocuments.size}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Failed Processing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {documents.filter(d => d.processing_status === 'failed').length}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Ideas Generated
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {documents.reduce((total, doc) => total + (doc.ideas_count || 0), 0)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* In-progress documents */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Currently Processing</h3>
                  {Array.from(processingDocuments).length === 0 ? (
                    <div className="text-muted-foreground text-center py-8 border rounded-md">
                      No documents currently being processed
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Array.from(processingDocuments).map(docId => {
                        const doc = documents.find(d => d.id === docId);
                        return doc ? (
                          <div key={docId} className="flex justify-between items-center p-4 border rounded-md">
                            <div>
                              <div className="font-medium">{doc.title}</div>
                              <div className="text-sm text-muted-foreground">Started at: {format(doc.createdAt, "MMM d, yyyy HH:mm")}</div>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelProcessing(docId)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                <AlertTriangle className="h-16 w-16 text-yellow-500" />
                <h3 className="text-lg font-medium">User Management Coming Soon</h3>
                <p className="text-muted-foreground max-w-md">
                  This feature is currently under development and will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system settings and parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Processing Timeout
                      </CardTitle>
                      <CardDescription>
                        Maximum time allowed for document processing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span>5 minutes</span>
                        <Button variant="outline" size="sm" disabled>
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        Ideas Per Document
                      </CardTitle>
                      <CardDescription>
                        Maximum number of ideas to extract per document
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span>5 ideas</span>
                        <Button variant="outline" size="sm" disabled>
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <p className="text-muted-foreground max-w-md">
                    Additional system settings will be available in future updates.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button disabled>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
