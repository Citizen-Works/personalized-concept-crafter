
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
import { ContentPillarForm } from "./ContentPillarForm";
import { z } from "zod";
import { useContentPillarsAdapter } from "@/hooks/api/adapters/useContentPillarsAdapter";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type ContentPillarFormValues = z.infer<typeof formSchema>;

interface AddContentPillarDialogProps {
  onPillarAdded: () => void;
}

export function AddContentPillarDialog({ onPillarAdded }: AddContentPillarDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createContentPillar } = useContentPillarsAdapter();

  const handleSubmit = async (values: ContentPillarFormValues) => {
    setIsSubmitting(true);
    try {
      createContentPillar({
        name: values.name,
        description: values.description || "",
      });
      
      toast.success("Content pillar created successfully!");
      setOpen(false);
      onPillarAdded();
    } catch (error) {
      console.error("Error creating content pillar:", error);
      toast.error("Failed to create content pillar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Add Content Pillar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Content Pillar</DialogTitle>
          <DialogDescription>
            Define a key topic or theme that will form part of your content strategy
          </DialogDescription>
        </DialogHeader>
        <ContentPillarForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
}
