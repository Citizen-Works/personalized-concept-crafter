
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Form schema for type safety - removed contentType and contentGoal
export const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  notes: z.string().optional(),
  source: z.enum(["manual", "meeting", "other"]),
  sourceUrl: z.string().optional(),
  callToAction: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

type FormFieldsProps = {
  form: UseFormReturn<FormValues>;
};

const FormFields: React.FC<FormFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter a title for your idea" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your content idea" 
                className="min-h-32 resize-none"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="callToAction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Call to Action</FormLabel>
            <FormControl>
              <Input 
                placeholder="What action should readers take? (e.g., 'Sign up for webinar')" 
                {...field}
              />
            </FormControl>
            <FormDescription>
              Define what you want your audience to do after consuming this content
            </FormDescription>
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Add any specific instructions or context for content generation" 
                className="min-h-24 resize-none"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Source</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        
        {form.watch('source') === 'other' && (
          <FormField
            control={form.control}
            name="sourceUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source URL</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter the source URL" 
                    type="url"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default FormFields;
