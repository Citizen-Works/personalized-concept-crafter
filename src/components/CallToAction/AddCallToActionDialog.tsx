
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/context/auth';
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
  const { user } = useAuth();

  const handleSubmit = async (values: { text: string; description: string; type: string; url: string }) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("call_to_actions").insert({
        text: values.text,
        description: values.description || null,
        type: values.type,
        url: values.url || null,
        user_id: user.id,
      });

      if (error) throw error;
      
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
