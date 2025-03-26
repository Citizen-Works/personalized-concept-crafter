import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentStatus } from "@/types";
import { Trash, CheckCircle } from "lucide-react";
import { getStatusBadgeClasses } from './BadgeUtils';

interface IdeaActionsProps {
  id: string;
  status: ContentStatus;
  hasBeenUsed: boolean;
  onDeleteIdea: () => void;
}

const IdeaActions: React.FC<IdeaActionsProps> = ({ 
  id, 
  status, 
  hasBeenUsed,
  onDeleteIdea
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Status</span>
          <Badge className={getStatusBadgeClasses(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Usage indicator */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Usage:</span>
            {hasBeenUsed ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Used for content</span>
              </div>
            ) : (
              <span>Not used yet</span>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              variant="destructive"
              className="w-full"
              onClick={onDeleteIdea}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Idea
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaActions;
