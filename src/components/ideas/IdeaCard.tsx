
import React from 'react';
import { Link } from 'react-router-dom';
import { ContentIdea, ContentStatus, ContentType } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from 'lucide-react';

interface IdeaCardProps {
  idea: ContentIdea;
  onDeleteIdea: (id: string) => void;
  getStatusBadgeClasses: (status: ContentStatus) => string;
  getTypeBadgeClasses: (type: ContentType) => string;
  hideStatusBadge?: boolean;
  hideTypeBadge?: boolean;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  onDeleteIdea,
  getStatusBadgeClasses,
  getTypeBadgeClasses,
  hideStatusBadge = false,
  hideTypeBadge = false
}) => {
  return (
    <Card key={idea.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="font-medium text-sm sm:text-base truncate">{idea.title}</h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {!hideStatusBadge && (
                  <Badge 
                    className={`${getStatusBadgeClasses(idea.status)} text-xs whitespace-nowrap`}
                  >
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </Badge>
                )}
                {!hideTypeBadge && (
                  <Badge 
                    className={`${getTypeBadgeClasses(idea.contentType)} text-xs whitespace-nowrap`}
                  >
                    {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
            <p className="text-xs text-muted-foreground">
              Created {new Date(idea.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button variant="outline" size="sm" asChild className="h-8 text-xs sm:text-sm w-full sm:w-auto">
              <Link to={`/ideas/${idea.id}`}>
                View Details
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
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
                <DropdownMenuItem onClick={() => onDeleteIdea(idea.id)}>
                  <Trash className="h-4 w-4 mr-2 text-destructive" />
                  <span className="text-destructive">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
