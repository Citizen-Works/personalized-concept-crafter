
import React from "react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Eye, 
  Lightbulb, 
  FileType,
  Calendar,
  MessageCircle
} from "lucide-react";
import { Document } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface SourceMaterialCardProps {
  document: Document;
  onView: () => void;
  onProcess: () => void;
}

export const SourceMaterialCard = ({
  document,
  onView,
  onProcess
}: SourceMaterialCardProps) => {
  const isTranscript = document.type === 'transcript';
  const documentTypeLabel = isTranscript ? 'Transcript' : 'Document';
  const isProcessing = document.processing_status === 'processing';
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <CardTitle 
              className="text-lg cursor-pointer hover:text-primary transition-colors"
              onClick={onView}
            >
              {document.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1 text-xs"
              >
                <FileType className="h-3 w-3" />
                {documentTypeLabel}
              </Badge>
              {document.has_ideas && (
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900"
                >
                  <Lightbulb className="h-3 w-3" />
                  Ideas Generated
                </Badge>
              )}
              {isProcessing && (
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900"
                >
                  Processing
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm line-clamp-2">
          {document.content?.substring(0, 200) || "No content preview available."}
          {document.content && document.content.length > 200 && "..."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 text-xs text-muted-foreground">
        <span className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDistanceToNow(document.createdAt, { addSuffix: true })}
        </span>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onView}
            className="h-8 px-2"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onProcess}
            className="h-8 px-2"
            disabled={isProcessing}
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Extract Ideas
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
