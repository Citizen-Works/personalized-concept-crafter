
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContentPillarForm } from "./ContentPillarForm";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentPillar } from "@/types";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type ContentPillarFormValues = z.infer<typeof formSchema>;

interface EditContentPillarDialogProps {
  pillar: ContentPillar;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPillarEdited: () => void;
}

export function EditContentPillarDialog({ 
  pillar, 
  open, 
  onOpenChange, 
  onPillarEdited 
}: EditContentPillarDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: ContentPillarFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("content_pillars")
        .update({
          name: values.name,
          description: values.description || "",
        })
        .eq("id", pillar.id);

      if (error) throw error;
      
      toast.success("Content pillar updated successfully!");
      onOpenChange(false);
      onPillarEdited();
    } catch (error) {
      console.error("Error updating content pillar:", error);
      toast.error("Failed to update content pillar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Content Pillar</DialogTitle>
          <DialogDescription>
            Make changes to your content pillar
          </DialogDescription>
        </DialogHeader>
        <ContentPillarForm 
          onSubmit={handleSubmit} 
          initialData={pillar} 
          isSubmitting={isSubmitting} 
        />
      </DialogContent>
    </Dialog>
  );
}
