
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Lightbulb, Loader2 } from 'lucide-react';
import { ContentType, ContentSource } from '@/types';
import { useIdeas } from '@/hooks/ideas';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { useDrafts } from '@/hooks/useDrafts';

// Content goal types
type ContentGoal = 'audience_building' | 'lead_generation' | 'nurturing' | 'conversion' | 'retention' | 'other';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().optional(),
  notes: z.string().optional(),
  contentType: z.enum(["linkedin", "newsletter", "marketing"]),
  source: z.enum(["manual", "meeting", "other"]),
  sourceUrl: z.string().optional(),
  contentGoal: z.enum(["audience_building", "lead_generation", "nurturing", "conversion", "retention", "other"]),
  callToAction: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const NewIdeaPage = () => {
  const navigate = useNavigate();
  const { createIdea, updateIdea } = useIdeas();
  const { generateContent, isGenerating } = useClaudeAI();
  const { createDraft } = useDrafts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingType, setGeneratingType] = useState<ContentType | null>(null);
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      notes: "",
      contentType: "linkedin" as ContentType,
      source: "manual" as ContentSource,
      sourceUrl: "",
      contentGoal: "audience_building" as ContentGoal,
      callToAction: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format notes to include CTA if provided
      const formattedNotes = values.callToAction 
        ? `${values.notes || ""}\n\nCall to Action: ${values.callToAction}` 
        : values.notes;
      
      // Format description to include content goal
      const formattedDescription = `Content Goal: ${values.contentGoal.replace('_', ' ')}\n\n${values.description || ""}`;
      
      const savedIdea = await createIdea({
        title: values.title,
        description: formattedDescription,
        notes: formattedNotes,
        contentType: values.contentType,
        source: values.source,
        sourceUrl: values.sourceUrl || null,
        status: 'unreviewed',
        meetingTranscriptExcerpt: null
      });
      
      toast.success('Content idea created successfully');
      navigate('/ideas');
    } catch (error) {
      console.error('Error creating content idea:', error);
      toast.error('Failed to create content idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSaveAndGenerate = async (contentType: ContentType) => {
    setGeneratingType(contentType);
    
    try {
      // Get form values
      const values = form.getValues();
      
      if (!form.formState.isValid) {
        await form.trigger();
        if (!form.formState.isValid) {
          toast.error('Please fix form errors before saving');
          setGeneratingType(null);
          return;
        }
      }
      
      // Format notes to include CTA if provided
      const formattedNotes = values.callToAction 
        ? `${values.notes || ""}\n\nCall to Action: ${values.callToAction}` 
        : values.notes;
      
      // Format description to include content goal
      const formattedDescription = `Content Goal: ${values.contentGoal.replace('_', ' ')}\n\n${values.description || ""}`;
      
      // 1. Create the idea
      const savedIdea = await createIdea({
        title: values.title,
        description: formattedDescription,
        notes: formattedNotes,
        contentType: contentType, // Use the selected content type
        source: values.source,
        sourceUrl: values.sourceUrl || null,
        status: 'unreviewed',
        meetingTranscriptExcerpt: null
      });
      
      toast.success('Content idea created successfully');
      
      // 2. Generate content for the idea
      if (savedIdea && savedIdea.id) {
        const generatedContent = await generateContent(savedIdea, contentType);
        
        if (generatedContent) {
          // 3. Create a draft with the generated content
          await createDraft({
            contentIdeaId: savedIdea.id,
            content: generatedContent,
            version: 1,
            feedback: '',
          });
          
          // 4. Update the idea status to drafted
          await updateIdea({
            id: savedIdea.id,
            status: 'drafted'
          });
          
          toast.success(`Draft generated successfully for ${contentType} content`);
        }
      }
      
      // Navigate to ideas page
      navigate('/ideas');
    } catch (error) {
      console.error('Error in save and generate:', error);
      toast.error('Failed to save idea and generate draft');
    } finally {
      setGeneratingType(null);
    }
  };

  const contentTypeDescription = {
    linkedin: "Professional content for your LinkedIn audience",
    newsletter: "Engaging content for your email subscribers",
    marketing: "Persuasive content to promote products/services"
  };

  const goalDescriptions = {
    audience_building: "Grow your audience and increase visibility",
    lead_generation: "Attract new potential customers",
    nurturing: "Build relationships with existing leads",
    conversion: "Turn prospects into customers",
    retention: "Keep existing customers engaged",
    other: "Custom goal"
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link to="/ideas">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Ideas</span>
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Create New Idea</h1>
        <p className="text-muted-foreground">
          Add a new content idea to your collection
        </p>
      </div>
      
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between items-center w-full">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/ideas')}
                  disabled={isSubmitting || !!generatingType}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !!generatingType}
                >
                  {isSubmitting ? 'Creating...' : 'Save Idea'}
                </Button>
              </div>
              
              <div className="w-full border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Save & Generate Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => onSaveAndGenerate('linkedin')}
                    disabled={isSubmitting || !!generatingType}
                    className="w-full"
                  >
                    {generatingType === 'linkedin' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating LinkedIn...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        LinkedIn
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => onSaveAndGenerate('newsletter')}
                    disabled={isSubmitting || !!generatingType}
                    className="w-full"
                  >
                    {generatingType === 'newsletter' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Newsletter...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Newsletter
                      </>
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="secondary"
                    onClick={() => onSaveAndGenerate('marketing')}
                    disabled={isSubmitting || !!generatingType}
                    className="w-full"
                  >
                    {generatingType === 'marketing' ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Marketing...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Marketing
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Save your idea and immediately generate a draft for the selected content type
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default NewIdeaPage;
