
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2, Archive, ArchiveRestore } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { TargetAudience } from "@/types";
import { EditTargetAudienceDialog } from "./EditTargetAudienceDialog";

interface TargetAudienceCardProps {
  audience: TargetAudience;
  onEdit: () => void;
  onDelete: () => void;
  onArchiveToggle?: () => void;
  isArchived?: boolean;
}

export function TargetAudienceCard({ 
  audience, 
  onEdit, 
  onDelete,
  onArchiveToggle,
  isArchived = false
}: TargetAudienceCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  return (
    <>
      <Card className={`h-full flex flex-col ${isArchived ? 'bg-muted/50 border-dashed' : ''}`}>
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <CardTitle className="text-lg">{audience.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {onArchiveToggle && (
                <DropdownMenuItem onClick={onArchiveToggle}>
                  {isArchived ? (
                    <>
                      <ArchiveRestore className="mr-2 h-4 w-4" />
                      Restore
                    </>
                  ) : (
                    <>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          {audience.description ? (
            <p className="text-sm text-muted-foreground">{audience.description}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description provided</p>
          )}
          
          {audience.painPoints && audience.painPoints.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Pain Points:</h4>
              <div className="flex flex-wrap gap-1">
                {audience.painPoints.map((point, index) => (
                  <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {point}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {audience.goals && audience.goals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Goals:</h4>
              <div className="flex flex-wrap gap-1">
                {audience.goals.map((goal, index) => (
                  <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{audience.name}" target audience. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEditDialog && (
        <EditTargetAudienceDialog 
          audience={audience} 
          open={showEditDialog} 
          onOpenChange={setShowEditDialog}
          onAudienceEdited={onEdit}
        />
      )}
    </>
  );
}
