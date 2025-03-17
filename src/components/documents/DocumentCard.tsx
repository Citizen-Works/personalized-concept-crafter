
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText } from "lucide-react";
import { Document } from "@/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { useDocuments } from "@/hooks/useDocuments";

interface DocumentCardProps {
  document: Document;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const { updateDocumentStatus } = useDocuments();
  
  const handleToggleStatus = () => {
    const newStatus = document.status === "active" ? "archived" : "active";
    updateDocumentStatus({ id: document.id, status: newStatus });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 mr-4">
            <CardTitle className="text-lg truncate">{document.title}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleToggleStatus}>
                {document.status === "active" ? "Archive" : "Unarchive"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">{document.type}</Badge>
          <Badge variant={document.purpose === "writing_sample" ? "secondary" : "outline"}>
            {document.purpose === "writing_sample" ? "Writing Sample" : "Business Context"}
          </Badge>
          {document.content_type && (
            <Badge>{document.content_type}</Badge>
          )}
          <Badge variant={document.status === "active" ? "default" : "destructive"}>
            {document.status === "active" ? "Active" : "Archived"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {document.content || "No content"}
        </p>
      </CardContent>
      <CardFooter className="pt-4 pb-4">
        <Button variant="outline" size="sm" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          View Document
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
