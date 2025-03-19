
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentIdea } from '@/types';
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpRight, Edit, FileEdit, MoreHorizontal, Trash } from "lucide-react";

interface IdeaCardProps {
  idea: ContentIdea;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDeleteClick: (id: string) => void;
  getStatusBadgeClasses: (status: string) => string;
  getTypeBadgeClasses: (type: string) => string;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  idea,
  isSelected,
  onToggleSelect,
  onDeleteClick,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  return (
    <Card key={idea.id} className="overflow-hidden transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <Checkbox 
            id={`select-${idea.id}`} 
            className="mr-2 mt-1"
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(idea.id)}
          />
          <div className="space-y-1 w-full">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base">{idea.title}</CardTitle>
              <Badge className={getStatusBadgeClasses(idea.status)}>
                {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Created {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {idea.description || "No description provided"}
          </p>
          <Badge className={`ml-2 shrink-0 ${getTypeBadgeClasses(idea.contentType)}`}>
            {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
          </Badge>
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
          >
            <Link to={`/ideas/${idea.id}/generate`}>
              <FileEdit className="h-4 w-4 mr-1" />
              Generate Draft
            </Link>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/ideas/${idea.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteClick(idea.id)}
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
