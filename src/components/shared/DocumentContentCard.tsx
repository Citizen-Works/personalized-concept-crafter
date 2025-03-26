import React from 'react';
import { Document } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, FileText, BookText, FileSpreadsheet, File, Lightbulb, ExternalLink } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DocumentContentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onProcess?: (id: string) => void;
  onEdit?: (document: Document) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  isProcessing?: boolean;
  showIdeasCount?: boolean;
  className?: string;
}

const DocumentContentCard: React.FC<DocumentContentCardProps> = ({
  document,
  onView,
  onProcess,
  onEdit,
  onArchive,
  onDelete,
  isProcessing = false,
  showIdeasCount = true,
  className = ''
}) => {
  const isMobile = useIsMobile();
  
  // Get document icon based on type
  const getDocumentIcon = () => {
    switch (document.type) {
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'whitepaper':
        return <BookText className="h-4 w-4" />;
      case 'case-study':
        return <FileSpreadsheet className="h-4 w-4" />;
      case 'transcript':
        return <File className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  // Get document type display name
  const getDocumentTypeName = () => {
    switch (document.type) {
      case 'blog':
        return 'Blog Post';
      case 'whitepaper':
        return 'Whitepaper';
      case 'case-study':
        return 'Case Study';
      case 'transcript':
        return 'Transcript';
      default:
        return document.type?.charAt(0).toUpperCase() + document.type?.slice(1) || 'Document';
    }
  };

  // Truncate content to a suitable preview length
  const contentPreview = document.content?.length > 120
    ? document.content.substring(0, 120) + '...' 
    : document.content;

  return (
    <Card className={`${className} hover:bg-muted/50 transition-colors`}>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                {getDocumentIcon()}
              </div>
              <CardTitle className="text-base font-medium">
                {document.title}
              </CardTitle>
            </div>
            <div className={cn("flex items-center gap-2 flex-wrap text-sm text-muted-foreground")}>
              <Badge variant="outline" className="text-xs">
                {getDocumentTypeName()}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
              </span>
              {showIdeasCount && document.has_ideas && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Lightbulb className="h-3 w-3" />
                  <span>{document.ideas_count} {document.ideas_count === 1 ? 'idea' : 'ideas'}</span>
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onView(document)}
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View document</span>
            </Button>
            {onProcess && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onProcess(document.id)}
                disabled={isProcessing}
                className="h-8"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Process'
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {contentPreview || "No content available"}
        </p>
      </CardContent>
    </Card>
  );
};

export default DocumentContentCard;
