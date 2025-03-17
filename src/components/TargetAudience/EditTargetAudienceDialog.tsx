
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TargetAudienceForm } from "./TargetAudienceForm";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TargetAudience } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
});

type TargetAudienceFormValues = z.infer<typeof formSchema>;

interface EditTargetAudienceDialogProps {
  audience: TargetAudience;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAudienceEdited: () => void;
}

export function EditTargetAudienceDialog({ 
  audience, 
  open, 
  onOpenChange, 
  onAudienceEdited 
}: EditTargetAudienceDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: TargetAudienceFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("target_audiences")
        .update({
          name: values.name,
          description: values.description || "",
          pain_points: values.painPoints || [],
          goals: values.goals || [],
        })
        .eq("id", audience.id);

      if (error) throw error;
      
      toast.success("Target audience updated successfully!");
      onOpenChange(false);
      onAudienceEdited();
    } catch (error) {
      console.error("Error updating target audience:", error);
      toast.error("Failed to update target audience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Target Audience</DialogTitle>
          <DialogDescription>
            Make changes to your target audience profile
          </DialogDescription>
        </DialogHeader>
        <TargetAudienceForm 
          onSubmit={handleSubmit} 
          initialData={audience} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}
