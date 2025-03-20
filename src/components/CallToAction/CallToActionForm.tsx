
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CallToAction } from '@/types/strategy';

const CTA_TYPES = [
  "Learn More",
  "Subscribe",
  "Register",
  "Sign Up",
  "Contact Us",
  "Book Now",
  "Get Started",
  "Download",
  "Free Trial",
  "Buy Now",
  "Read More",
  "Other"
];

const formSchema = z.object({
  text: z.string().min(1, "Text is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  url: z.union([z.string().url("Must be a valid URL").optional(), z.literal("")]),
  customType: z.string().optional(),
});

type CallToActionFormValues = z.infer<typeof formSchema>;

interface CallToActionFormProps {
  onSubmit: (values: { text: string; description: string; type: string; url: string }) => void;
  initialData?: CallToAction;
  isSubmitting: boolean;
}

export function CallToActionForm({
  onSubmit,
  initialData,
  isSubmitting,
}: CallToActionFormProps) {
  const form = useForm<CallToActionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: initialData?.text || "",
      description: initialData?.description || "",
      type: initialData?.type || "",
      url: initialData?.url || "",
      customType: initialData?.type && !CTA_TYPES.includes(initialData.type) ? initialData.type : "",
    },
  });

  const selectedType = form.watch("type");
  const isCustomType = selectedType === "Other";

  const handleSubmit = (values: CallToActionFormValues) => {
    const finalValues = {
      text: values.text,
      description: values.description || "",
      type: isCustomType ? values.customType || "Other" : values.type,
      url: values.url || "",
    };
    onSubmit(finalValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Get your free consultation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain when and how to use this call to action"
                  className="resize-none min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CTA_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {isCustomType && (
          <FormField
            control={form.control}
            name="customType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Watch Demo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://example.com/contact" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {initialData ? "Update" : "Create"} Call To Action
          </Button>
        </div>
      </form>
    </Form>
  );
}
