import React, { useState } from 'react';
import { format } from 'date-fns';
import { Archive, BarChart, ExternalLink, MoreHorizontal, Trash, ChevronUp, ChevronDown, Copy, FileText, CheckCircle } from 'lucide-react';
import { ContentType } from '@/types';
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

interface PublishedContentCardProps {
  id: string;
  title: string;
  content: string;
  contentType: ContentType;
  createdAt: string | Date;
  onArchive: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onStatusChange?: (id: string, status: 'draft' | 'ready') => void;
}

export const PublishedContentCard: React.FC<PublishedContentCardProps> = ({
  id,
  title,
  content,
  contentType,
  createdAt,
  onArchive,
  onDeleteRequest,
  onStatusChange
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success("Content copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy content:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge className={getTypeBadgeClasses(contentType)}>
            {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className={cn(
            "text-sm whitespace-pre-wrap",
            !isExpanded && "line-clamp-4"
          )}>
            {content}
          </div>
          <button
            type="button"
            className="w-full py-2 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors flex items-center justify-center gap-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Published on {format(new Date(createdAt), 'MMM d, yyyy')}
        </div>
        <div className="flex gap-2">
          <Button
            variant={isCopied ? "outline" : "default"}
            onClick={handleCopy}
            className="gap-1"
          >
            <Copy className="h-4 w-4" />
            {isCopied ? "Copied!" : "Copy"}
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled 
                  className="opacity-60"
                >
                  <BarChart className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Performance metrics coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  disabled 
                  className="opacity-60"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on platform feature coming soon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onStatusChange && (
                <>
                  <DropdownMenuItem onClick={() => onStatusChange(id, 'draft')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Move to Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange(id, 'ready')}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Move to Ready
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => onArchive(id)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteRequest(id)}
                className="text-destructive"
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};
