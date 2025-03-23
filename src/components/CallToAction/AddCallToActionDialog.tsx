
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
import { CallToActionForm } from "./CallToActionForm";
import { useCallToActionsAdapter } from "@/hooks/api/adapters/useCallToActionsAdapter";
import { toast } from "sonner";

interface AddCallToActionDialogProps {
  onCallToActionAdded: () => void;
  buttonLabel?: string;
}

export function AddCallToActionDialog({ 
  onCallToActionAdded, 
  buttonLabel = "Add Call To Action" 
}: AddCallToActionDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createCallToActionAsync } = useCallToActionsAdapter();

  const handleSubmit = async (values: { text: string; description: string; type: string; url: string }) => {
    setIsSubmitting(true);
    try {
      await createCallToActionAsync({
        text: values.text,
        description: values.description || "",
        type: values.type,
        url: values.url || ""
      });
      
      toast.success("Call to action created successfully!");
      setOpen(false);
      onCallToActionAdded();
    } catch (error) {
      console.error("Error creating call to action:", error);
      toast.error("Failed to create call to action");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          {buttonLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Call To Action</DialogTitle>
          <DialogDescription>
            Create a call to action to guide your audience
          </DialogDescription>
        </DialogHeader>
        <CallToActionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
