
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  FileText, 
  FileJson, 
  Archive, 
  Trash2, 
  RefreshCw,
  Edit
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Document, DocumentType } from '@/types';

interface DocumentCardProps {
  document: Document;
  onView?: (document: Document) => void;
  onArchive?: (id: string) => void;
  onProcess?: (id: string) => void;
  isProcessing?: boolean;
  onEdit?: (document: Document) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onArchive,
  onProcess,
  isProcessing,
  onEdit
}) => {
  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case 'transcript':
        return <FileJson className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDocumentTypeName = (type: DocumentType) => {
    switch (type) {
      case 'blog': return 'Blog';
      case 'newsletter': return 'Newsletter';
      case 'whitepaper': return 'Whitepaper';
      case 'case-study': return 'Case Study';
      case 'transcript': return 'Transcript';
      default: return 'Other';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-1 pt-6">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-2">{document.title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(document)}>
                  <FileText className="mr-2 h-4 w-4" />
                  View Document
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(document)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Properties
                </DropdownMenuItem>
              )}
              {onProcess && document.type === 'transcript' && (
                <DropdownMenuItem onClick={() => onProcess(document.id)}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Extract Ideas
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(document.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-2 text-sm text-muted-foreground line-clamp-3">
          {document.content?.substring(0, 120)}
          {document.content && document.content.length > 120 ? '...' : ''}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-2 pb-4 gap-2 border-t">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {getDocumentIcon(document.type)}
          <span>{getDocumentTypeName(document.type)}</span>
        </div>
        
        <div className="flex gap-2">
          {isProcessing ? (
            <Badge variant="outline" className="animate-pulse">
              <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
              Processing
            </Badge>
          ) : (
            <>
              <Badge variant="outline">
                {document.purpose === 'business_context' ? 'Context' : 'Sample'}
              </Badge>
              <Badge variant="outline">
                {formatDistanceToNow(document.createdAt, { addSuffix: true })}
              </Badge>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
