
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TargetAudienceForm } from "./TargetAudienceForm";
import { z } from "zod";
import { useTargetAudiencesAdapter } from "@/hooks/api/adapters/useTargetAudiencesAdapter";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
});

type TargetAudienceFormValues = z.infer<typeof formSchema>;

interface AddTargetAudienceDialogProps {
  onAudienceAdded: () => void;
}

export function AddTargetAudienceDialog({ onAudienceAdded }: AddTargetAudienceDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createTargetAudienceAsync } = useTargetAudiencesAdapter();

  const handleSubmit = async (values: TargetAudienceFormValues) => {
    setIsSubmitting(true);
    try {
      await createTargetAudienceAsync({
        name: values.name,
        description: values.description || "",
        painPoints: values.painPoints || [],
        goals: values.goals || [],
      });
      
      toast.success("Target audience created successfully!");
      setOpen(false);
      onAudienceAdded();
    } catch (error) {
      console.error("Error creating target audience:", error);
      toast.error("Failed to create target audience");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Target Audience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Add Target Audience</DialogTitle>
          <DialogDescription>
            Define who your content is designed to reach and engage
          </DialogDescription>
        </DialogHeader>
        <TargetAudienceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
