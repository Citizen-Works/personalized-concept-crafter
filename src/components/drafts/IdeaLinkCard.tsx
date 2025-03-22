
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIdeas } from '@/hooks/ideas';
import { Loader2, FileText, ExternalLink, CheckCircle } from 'lucide-react';
import { ContentType } from '@/types';
import { getStatusBadgeClasses } from '@/components/ideas/BadgeUtils';

interface IdeaLinkCardProps {
  contentIdeaId: string;
  contentType?: ContentType;
}

export const IdeaLinkCard: React.FC<IdeaLinkCardProps> = ({ contentIdeaId, contentType }) => {
  const navigate = useNavigate();
  const { getIdea } = useIdeas();
  const { data: idea, isLoading, error } = getIdea(contentIdeaId);

  // Get a color for the content type badge
  const getContentTypeBadgeClass = (type?: ContentType): string => {
    switch (type?.toLowerCase()) {
      case 'linkedin':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'newsletter':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'blog':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'email':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'twitter':
      case 'post':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-muted/20">
        <CardContent className="p-4 flex justify-center items-center min-h-[120px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error || !idea) {
    return (
      <Card className="bg-muted/20 border-destructive/20">
        <CardContent className="p-4">
          <div className="text-center p-4">
            <p className="text-muted-foreground">
              Unable to load source content idea
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Source Content Idea</h3>
          </div>
          <div className="flex space-x-2">
            <Badge className={getStatusBadgeClasses(idea.status)}>
              {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
            </Badge>
            {idea.hasBeenUsed && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Used
              </Badge>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-base mb-1">{idea.title}</h4>
          {idea.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <p>Created: {new Date(idea.createdAt).toLocaleDateString()}</p>
          {contentType && (
            <Badge 
              variant="outline" 
              className={`capitalize ${getContentTypeBadgeClass(contentType)}`}
            >
              {contentType.charAt(0).toUpperCase() + contentType.slice(1)} Content
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted/10 px-4 py-2 flex justify-end">
        <Button 
          size="sm" 
          variant="ghost" 
          className="text-xs gap-1"
          onClick={() => navigate(`/ideas/${idea.id}`)}
        >
          View Idea <ExternalLink className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};
