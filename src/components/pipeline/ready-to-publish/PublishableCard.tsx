
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Check, Copy, MoreHorizontal, Trash } from 'lucide-react';
import { ContentType } from '@/types';
import { getTypeBadgeClasses } from '@/components/ideas/BadgeUtils';

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
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { DraftWithIdea } from '@/hooks/useDrafts';

interface PublishableCardProps {
  draft: DraftWithIdea;
  onCopy: (content: string, id: string) => void;
  onMarkAsPublished: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  copiedId: string | null;
}

export const PublishableCard: React.FC<PublishableCardProps> = ({ 
  draft,
  onCopy,
  onMarkAsPublished,
  onDeleteRequest,
  copiedId
}) => {
  return (
    <Card key={draft.id} className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle>{draft.ideaTitle}</CardTitle>
          <Badge className={getTypeBadgeClasses(draft.contentType)}>
            {draft.contentType.charAt(0).toUpperCase() + draft.contentType.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
          {draft.content}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Ready {formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}
        </div>
        <div className="flex gap-2">
          <Button 
            variant={copiedId === draft.id ? "outline" : "default"}
            onClick={() => onCopy(draft.content, draft.id)}
          >
            <Copy className="h-4 w-4 mr-2" />
            {copiedId === draft.id ? "Copied!" : "Copy"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => onMarkAsPublished(draft.id)}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark as Published
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
                  <Calendar className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Schedule feature coming soon</p>
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
              <DropdownMenuItem 
                onClick={() => onDeleteRequest(draft.id)}
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
