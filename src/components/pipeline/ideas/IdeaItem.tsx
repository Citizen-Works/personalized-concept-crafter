
import React from 'react';
import { ContentIdea, ContentType } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Trash, Loader2, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

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
            <CardTitle className="text-base">{idea.title}</CardTitle>
            <CardDescription>
              {displaySource()} • {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {idea.description || "No description provided"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/ideas/${idea.id}`}>
            <ArrowUpRight className="h-4 w-4 mr-1" />
            View Details
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            size="sm" 
            asChild
            title="Generate Content"
          >
            <Link to={`/ideas/${idea.id}`}>
              <Lightbulb className="h-4 w-4 mr-1" />
              Generate Content
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(idea.id)}
            title="Delete"
            disabled={isUpdating}
          >
            {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
