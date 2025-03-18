
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { TargetAudience } from "@/types";
import { NameField, DescriptionField } from "./FormFields";
import { TagInput } from "./TagInput";
import { FormActions } from "./FormActions";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  painPoints: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
});

type TargetAudienceFormValues = z.infer<typeof formSchema>;

interface TargetAudienceFormProps {
  onSubmit: (values: TargetAudienceFormValues) => void;
  initialData?: TargetAudience;
  isSubmitting: boolean;
}

export function TargetAudienceForm({
  onSubmit,
  initialData,
  isSubmitting,
}: TargetAudienceFormProps) {
  const form = useForm<TargetAudienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      painPoints: initialData?.painPoints || [],
      goals: initialData?.goals || [],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        <NameField form={form} />
        <DescriptionField form={form} />
        
        <TagInput
          name="painPoints"
          label="Pain Points"
          description="What challenges does this audience face?"
          placeholder="Add a pain point"
          form={form}
        />

        <TagInput
          name="goals"
          label="Goals"
          description="What are this audience's objectives or aspirations?"
          placeholder="Add a goal"
          form={form}
        />

        <FormActions 
          isSubmitting={isSubmitting} 
          isEditing={!!initialData} 
        />
      </form>
    </Form>
  );
}
