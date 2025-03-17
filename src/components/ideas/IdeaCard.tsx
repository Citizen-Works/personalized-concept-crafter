
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
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  onDeleteIdea,
  getStatusBadgeClasses,
  getTypeBadgeClasses
}) => {
  return (
    <Card key={idea.id} className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{idea.title}</h3>
              <Badge 
                className={`${getStatusBadgeClasses(idea.status)}`}
              >
                {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
              </Badge>
              <Badge 
                className={`${getTypeBadgeClasses(idea.contentType)}`}
              >
                {idea.contentType.charAt(0).toUpperCase() + idea.contentType.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
            <p className="text-xs text-muted-foreground">
              Created {new Date(idea.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/ideas/${idea.id}`}>
                View Details
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
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
