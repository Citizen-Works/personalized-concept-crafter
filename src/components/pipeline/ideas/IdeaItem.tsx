
import React from 'react';
import { ContentIdea, ContentType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Trash, Loader2, Lightbulb, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from '@/hooks/use-mobile';
import { ResponsiveText } from '@/components/ui/responsive-text';

interface IdeaItemProps {
  idea: ContentIdea;
  isSelected: boolean;
  isUpdating: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  getStatusBadgeClasses: (status: string) => string;
  getTypeBadgeClasses: (type: ContentType | null) => string;
}

export const IdeaItem: React.FC<IdeaItemProps> = ({
  idea,
  isSelected,
  isUpdating,
  onToggleSelect,
  onDelete,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  const isMobile = useIsMobile();
  
  const displaySource = () => {
    switch (idea.source) {
      case 'meeting':
        return 'From meeting transcript';
      case 'manual':
        return 'Manually created';
      case 'transcript':
        return 'From transcript';
      default:
        return idea.source ? `From ${idea.source}` : 'Manually created';
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling
    onDelete(idea.id);
  };

  return (
    <Card key={idea.id} className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <Checkbox 
            id={`select-${idea.id}`} 
            className="mr-2 mt-1"
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(idea.id)}
            disabled={isUpdating}
          />
          <div>
            <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {idea.title}
              {idea.hasBeenUsed && (
                <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Used
                </Badge>
              )}
            </CardTitle>
            <CardDescription className={isMobile ? 'text-xs' : 'text-sm'}>
              {displaySource()} • {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className={`text-muted-foreground ${isMobile ? 'text-xs line-clamp-1' : 'text-sm line-clamp-2'}`}>
            {idea.description || "No description provided"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size={isMobile ? "sm" : "default"} 
          className={isMobile ? "px-2 py-1 text-xs" : ""}
          asChild
        >
          <Link to={`/ideas/${idea.id}`}>
            <ArrowUpRight className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'}`} />
            View
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size={isMobile ? "sm" : "default"} 
            className={isMobile ? "px-2 py-1 text-xs" : ""}
            asChild
            title="Generate Content"
          >
            <Link to={`/ideas/${idea.id}`}>
              <Lightbulb className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1'}`} />
              Generate
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={`text-destructive hover:text-destructive ${isMobile ? 'h-7 w-7' : ''}`}
            onClick={handleDelete}
            title="Delete"
            disabled={isUpdating}
          >
            {isUpdating ? 
              <Loader2 className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} animate-spin`} /> : 
              <Trash className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            }
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
