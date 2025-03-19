
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
import { ContentType } from '@/types';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

// Define the content type descriptions
export const contentTypeDescription = {
  linkedin: "Professional content for your LinkedIn audience",
  newsletter: "Engaging content for your email subscribers",
  marketing: "Persuasive content to promote products/services"
};

// Define the goal descriptions
export const goalDescriptions = {
  audience_building: "Grow your audience and increase visibility",
  lead_generation: "Attract new potential customers",
  nurturing: "Build relationships with existing leads",
  conversion: "Turn prospects into customers",
  retention: "Keep existing customers engaged",
  other: "Custom goal"
};

// Form schema for type safety
export const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  notes: z.string().optional(),
  contentType: z.enum(["linkedin", "newsletter", "marketing"]),
  source: z.enum(["manual", "meeting", "other"]),
  sourceUrl: z.string().optional(),
  contentGoal: z.enum(["audience_building", "lead_generation", "nurturing", "conversion", "retention", "other"]),
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
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="contentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {contentTypeDescription[field.value as keyof typeof contentTypeDescription]}
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="contentGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content Goal</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content goal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="audience_building">Audience Building</SelectItem>
                  <SelectItem value="lead_generation">Lead Generation</SelectItem>
                  <SelectItem value="nurturing">Nurturing</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                  <SelectItem value="retention">Retention</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {goalDescriptions[field.value as keyof typeof goalDescriptions]}
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      
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
