
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIdeas } from '@/hooks/ideas';
import { useClaudeAI } from '@/hooks/useClaudeAI';
import { useDrafts } from '@/hooks/useDrafts';
import { toast } from 'sonner';
import { ContentType } from '@/types';
import { useForm } from 'react-hook-form';
import { FormValues, formSchema } from './FormFields';
import { zodResolver } from '@hookform/resolvers/zod';

export const useNewIdeaForm = () => {
  const navigate = useNavigate();
  const { createIdeaAsync, updateIdea } = useIdeas();
  const { generateContent, isGenerating } = useClaudeAI();
  const { createDraft } = useDrafts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingType, setGeneratingType] = useState<ContentType | null>(null);
  
  // Initialize form with simplified schema
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      notes: "",
      source: "manual",
      sourceUrl: "",
      callToAction: "",
    },
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format notes to include CTA if provided, but no content goal
      let formattedNotes = values.notes || "";
      
      // Add CTA if provided
      if (values.callToAction) {
        formattedNotes = `${formattedNotes}\n\nCall to Action: ${values.callToAction}`;
      }
      
      await createIdeaAsync({
        title: values.title,
        description: values.description || "",
        notes: formattedNotes,
        contentType: null, // No longer required
        source: values.source,
        sourceUrl: values.sourceUrl || null,
        status: 'approved',
        meetingTranscriptExcerpt: null
      });
      
      toast.success('Content idea created successfully');
      navigate('/pipeline?tab=ideas');
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
      if (!form.formState.isValid) {
        await form.trigger();
        if (!form.formState.isValid) {
          toast.error('Please fix form errors before saving');
          setGeneratingType(null);
          return;
        }
      }
      
      // Get form values
      const values = form.getValues();
      
      // Format notes to include CTA if provided, but no content goal
      let formattedNotes = values.notes || "";
      
      // Add CTA if provided
      if (values.callToAction) {
        formattedNotes = `${formattedNotes}\n\nCall to Action: ${values.callToAction}`;
      }
      
      // 1. Create the idea - use the async version to get the result
      const savedIdea = await createIdeaAsync({
        title: values.title,
        description: values.description || "",
        notes: formattedNotes,
        contentType: contentType, // Needed for generation
        source: values.source,
        sourceUrl: values.sourceUrl || null,
        status: 'approved',
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
      navigate('/pipeline?tab=ideas');
    } catch (error) {
      console.error('Error in save and generate:', error);
      toast.error('Failed to save idea and generate draft');
    } finally {
      setGeneratingType(null);
    }
  };

  return {
    form,
    isSubmitting,
    generatingType,
    isGenerating,
    onSubmit,
    onSaveAndGenerate,
    onCancel: () => navigate('/pipeline?tab=ideas')
  };
};
