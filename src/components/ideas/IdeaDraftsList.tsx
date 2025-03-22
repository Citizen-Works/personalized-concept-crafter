
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDraftsByIdeaId } from '@/hooks/draft/useDraftsByIdeaId';
import { FileText, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface IdeaDraftsListProps {
  ideaId: string;
  ideaTitle: string;
}

export const IdeaDraftsList: React.FC<IdeaDraftsListProps> = ({ ideaId, ideaTitle }) => {
  const { data: drafts, isLoading, isError } = useDraftsByIdeaId(ideaId);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Drafts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Drafts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            There was an error loading drafts for this idea.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  if (!drafts || drafts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Content Drafts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No drafts have been created for this idea yet.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Extract the first 30 characters of content to use as preview
  const getContentPreview = (content: string): string => {
    if (!content) return "No content";
    const trimmed = content.trim();
    if (trimmed.length <= 30) return trimmed;
    return trimmed.substring(0, 30) + '...';
  };
  
  // Get a color for the content type badge
  const getContentTypeBadgeClass = (type?: string): string => {
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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Content Drafts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {drafts.map((draft) => (
            <Link 
              key={draft.id} 
              to={`/drafts/${draft.id}`} 
              className="block p-3 border rounded-lg hover:bg-muted/20 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    {getContentPreview(draft.content)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Version {draft.version}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(draft.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {draft.contentType && (
                    <Badge 
                      variant="outline" 
                      className={`text-xs capitalize whitespace-nowrap ${getContentTypeBadgeClass(draft.contentType)}`}
                    >
                      {draft.contentType}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs capitalize whitespace-nowrap">
                    {draft.status}
                  </Badge>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
