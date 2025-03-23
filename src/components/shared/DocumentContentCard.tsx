
import React from 'react';
import { Document } from '@/types';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { Loader2, FileText, BookText, FileSpreadsheet, File, Lightbulb } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DocumentContentCardProps {
  document: Document;
  onView: (document: Document) => void;
  onProcess?: (id: string) => void;
  onEdit?: (document: Document) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  isProcessing?: boolean;
  showIdeasCount?: boolean;
}

const DocumentContentCard: React.FC<DocumentContentCardProps> = ({
  document,
  onView,
  onProcess,
  onEdit,
  onArchive,
  onDelete,
  isProcessing = false,
  showIdeasCount = true
}) => {
  const isMobile = useIsMobile();
  
  // Get document icon based on type
  const getDocumentIcon = () => {
    switch (document.type) {
      case 'blog':
        return <FileText className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'whitepaper':
        return <BookText className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'case-study':
        return <FileSpreadsheet className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />;
      case 'transcript':
        return <File className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />;
      default:
        return <File className={isMobile ? 'h-4 w-4' : 'h-5 w-5'} />;
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
  const contentPreview = document.content?.length > (isMobile ? 80 : 120) 
    ? document.content.substring(0, isMobile ? 80 : 120) + '...' 
    : document.content;

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardHeader className={`pb-2 ${isMobile ? 'px-3 pt-3' : ''}`}>
        <div className="flex items-start gap-2">
          <div className={`p-2 rounded-md bg-primary/10 text-primary ${isMobile ? 'mt-0.5' : ''}`}>
            {getDocumentIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className={isMobile ? 'text-base line-clamp-1' : 'text-lg'}>
              {document.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className={isMobile ? "text-xs" : "text-sm"}>
                {getDocumentTypeName()}
              </Badge>
              <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                {formatDistanceToNow(new Date(document.createdAt), { addSuffix: true })}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className={`flex-1 ${isMobile ? 'px-3 py-2' : ''}`}>
        <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'} line-clamp-3`}>
          {contentPreview || "No content available"}
        </p>
        
        {showIdeasCount && document.has_ideas && (
          <div className="mt-2 flex items-center">
            <Badge variant="secondary" className="gap-1">
              <Lightbulb className="h-3 w-3" />
              <span>{document.ideas_count} {document.ideas_count === 1 ? 'idea' : 'ideas'}</span>
            </Badge>
          </div>
        )}
      </CardContent>

      <CardFooter className={`border-t bg-muted/20 ${isMobile ? 'px-3 py-2' : ''}`}>
        <div className="w-full flex justify-between gap-2">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={() => onView(document)}
            className={isMobile ? "text-xs px-2 py-1 h-7" : ""}
          >
            View
          </Button>
          
          {onProcess && (
            <Button
              variant="default"
              size={isMobile ? "sm" : "default"}
              onClick={() => onProcess(document.id)}
              disabled={isProcessing}
              className={isMobile ? "text-xs px-2 py-1 h-7" : ""}
            >
              {isProcessing ? (
                <>
                  <Loader2 className={`mr-1 animate-spin ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  Processing
                </>
              ) : (
                'Process'
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default DocumentContentCard;
