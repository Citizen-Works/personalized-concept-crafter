
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDraftsByIdeaId } from '@/hooks/draft/useDraftsByIdeaId';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface IdeaDraftsListProps {
  ideaId: string;
  ideaTitle?: string;
}

export const IdeaDraftsList: React.FC<IdeaDraftsListProps> = ({ ideaId, ideaTitle }) => {
  const navigate = useNavigate();
  const { data: drafts, isLoading, isError } = useDraftsByIdeaId(ideaId);
  
  const navigateToDraft = (draftId: string) => {
    navigate(`/drafts/${draftId}`);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Associated Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isError || !drafts) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Associated Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 text-center text-sm text-muted-foreground">
            Error loading drafts
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">
          {ideaTitle ? `Drafts for "${ideaTitle}"` : `Associated Drafts`} ({drafts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {drafts.length > 0 ? (
          <div className="space-y-4">
            {drafts.map((draft) => {
              // Extract first 30 characters of content as a preview title
              const contentPreview = draft.content && draft.content.length > 0
                ? draft.content.split('\n')[0].substring(0, 30) + (draft.content.split('\n')[0].length > 30 ? '...' : '')
                : 'Untitled Draft';
                
              return (
                <div 
                  key={draft.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/20 transition-colors rounded-md p-2 cursor-pointer"
                  onClick={() => navigateToDraft(draft.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-sm sm:text-base">{contentPreview}</h4>
                        <Badge 
                          variant="outline" 
                          className="capitalize font-normal text-xs bg-blue-50 text-blue-700 border-blue-200"
                        >
                          {draft.contentType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDistanceToNow(draft.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hidden sm:flex mt-2 sm:mt-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 sm:p-8 text-center border rounded-lg bg-muted/10">
            <p className="text-sm text-muted-foreground">
              No drafts have been created for this idea yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
