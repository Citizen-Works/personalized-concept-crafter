
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CallToActionForm } from "./CallToActionForm";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CallToAction } from '@/types/strategy';

interface EditCallToActionDialogProps {
  callToAction: CallToAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCallToActionEdited: () => void;
}

export function EditCallToActionDialog({ 
  callToAction, 
  open, 
  onOpenChange, 
  onCallToActionEdited 
}: EditCallToActionDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: { text: string; description: string; type: string; url: string }) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("call_to_actions")
        .update({
          text: values.text,
          description: values.description || null,
          type: values.type,
          url: values.url || null,
        })
        .eq("id", callToAction.id);

      if (error) throw error;
      
      toast.success("Call to action updated successfully!");
      onOpenChange(false);
      onCallToActionEdited();
    } catch (error) {
      console.error("Error updating call to action:", error);
      toast.error("Failed to update call to action");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Call To Action</DialogTitle>
          <DialogDescription>
            Make changes to your call to action
          </DialogDescription>
        </DialogHeader>
        <CallToActionForm 
          onSubmit={handleSubmit} 
          initialData={callToAction} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}
