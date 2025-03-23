
import React from 'react';
import { ContentCard } from './ContentCard';
import { Document, DocumentType } from '@/types';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  FileText, 
  Archive, 
  Edit, 
  Trash2, 
  Lightbulb,
  FileJson
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';

interface DocumentContentCardProps {
  document: Document;
  onView?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onArchive?: (id: string) => void;
  onProcess?: (id: string) => void;
  onDelete?: (id: string) => void;
  isProcessing?: boolean;
  showIdeasCount?: boolean;
}

const DocumentContentCard: React.FC<DocumentContentCardProps> = ({
  document,
  onView,
  onEdit,
  onArchive,
  onProcess,
  onDelete,
  isProcessing = false,
  showIdeasCount = true
}) => {
  // Helper function to get document type icon
  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case 'transcript':
        return <FileJson className="h-4 w-4 mr-1" />;
      default:
        return <FileText className="h-4 w-4 mr-1" />;
    }
  };

  // Get formatted document type name
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

  // Create dropdown actions
  const actionDropdown = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
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
        {onProcess && (
          <DropdownMenuItem onClick={() => onProcess(document.id)}>
            <Lightbulb className="mr-2 h-4 w-4" />
            Extract Ideas
          </DropdownMenuItem>
        )}
        {onArchive && (
          <DropdownMenuItem onClick={() => onArchive(document.id)}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={() => onDelete(document.id)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Create custom badges for the document
  const documentBadges = (
    <div className="flex flex-wrap gap-1 mt-2">
      <Badge variant="outline" className="flex items-center gap-1">
        {getDocumentIcon(document.type)}
        {getDocumentTypeName(document.type)}
      </Badge>
      {document.purpose && (
        <Badge variant="outline" className="flex items-center gap-1">
          {document.purpose === 'business_context' ? 'Context' : 'Sample'}
        </Badge>
      )}
      {showIdeasCount && document.has_ideas && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          {document.ideas_count || 0} Ideas
        </Badge>
      )}
      {isProcessing && (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse">
          Processing
        </Badge>
      )}
    </div>
  );

  return (
    <ContentCard
      id={document.id}
      title={document.title}
      description={document.content?.substring(0, 150) + (document.content && document.content.length > 150 ? '...' : '')}
      createdAt={document.createdAt}
      actions={actionDropdown}
      detailPath={onView ? undefined : `/documents/${document.id}`}
    >
      {documentBadges}
    </ContentCard>
  );
};

export default DocumentContentCard;
