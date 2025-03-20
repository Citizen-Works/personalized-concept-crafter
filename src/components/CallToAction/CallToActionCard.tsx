
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink, Archive, RotateCcw } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { CallToAction } from '@/types/strategy';
import { EditCallToActionDialog } from './EditCallToActionDialog';
import { useCallToActions } from '@/hooks/useCallToActions';
import { toast } from 'sonner';

interface CallToActionCardProps {
  callToAction: CallToAction;
  onEdit: () => void;
  onDelete: () => void;
  onArchive: () => void;
}

export const CallToActionCard: React.FC<CallToActionCardProps> = ({ 
  callToAction, 
  onEdit, 
  onDelete,
  onArchive 
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { updateCallToAction } = useCallToActions();

  const handleArchiveToggle = () => {
    updateCallToAction.mutate({
      id: callToAction.id,
      isArchived: !callToAction.isArchived
    }, {
      onSuccess: () => {
        toast.success(callToAction.isArchived ? 'Call to action restored' : 'Call to action archived');
        onArchive();
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this call to action?')) {
      onDelete();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{callToAction.text}</CardTitle>
            <Badge>{callToAction.type}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {callToAction.description && (
            <p className="text-muted-foreground text-sm mb-4">{callToAction.description}</p>
          )}
          {callToAction.url && (
            <p className="text-sm flex items-center">
              <ExternalLink className="h-4 w-4 mr-1 text-muted-foreground" />
              <a href={callToAction.url} target="_blank" rel="noopener noreferrer" className="text-primary truncate">
                {callToAction.url}
              </a>
            </p>
          )}
          {callToAction.usageCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Used in {callToAction.usageCount} {callToAction.usageCount === 1 ? 'piece' : 'pieces'} of content
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleArchiveToggle}>
              {callToAction.isArchived ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restore
                </>
              ) : (
                <>
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </>
              )}
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>

      <EditCallToActionDialog
        callToAction={callToAction}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onCallToActionEdited={onEdit}
      />
    </>
  );
};
