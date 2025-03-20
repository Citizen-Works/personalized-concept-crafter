
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PromptTemplate {
  id: string;
  template_key: string;
  content: string;
  description: string | null;
  category: string;
  content_type: string | null;
  is_active: boolean;
  updated_at: string;
  updated_by: string | null;
  created_at: string;
  version: number;
  parent_version: string | null;
}

export async function fetchPromptTemplates() {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .order('category')
      .order('template_key');
    
    if (error) throw error;
    return data as PromptTemplate[];
  } catch (error) {
    console.error('Error fetching prompt templates:', error);
    toast.error('Failed to load prompt templates');
    return [];
  }
}

export async function fetchPromptTemplate(templateKey: string) {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) throw error;
    return data as PromptTemplate | null;
  } catch (error) {
    console.error(`Error fetching template ${templateKey}:`, error);
    toast.error(`Failed to load template: ${templateKey}`);
    return null;
  }
}

export async function updatePromptTemplate(template: Partial<PromptTemplate> & { id: string }) {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .update(template)
      .eq('id', template.id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Template updated successfully');
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error updating prompt template:', error);
    toast.error('Failed to update template');
    throw error;
  }
}

export async function createPromptTemplate(template: Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at' | 'updated_by' | 'version' | 'parent_version'>) {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .insert(template)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('New template created successfully');
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error creating prompt template:', error);
    toast.error('Failed to create new template');
    throw error;
  }
}

export async function createVersionedPromptTemplate(
  originalId: string, 
  updatedContent: Partial<PromptTemplate>
) {
  try {
    // Get the original template
    const { data: original, error: fetchError } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('id', originalId)
      .single();
    
    if (fetchError) throw fetchError;

    // Create a new version
    const newTemplate = {
      ...original,
      ...updatedContent,
      parent_version: originalId,
      version: original.version + 1
    };
    
    // Remove id to create a new record
    delete newTemplate.id;
    
    // Update original to be inactive
    const { error: updateError } = await supabase
      .from('prompt_templates')
      .update({ is_active: false })
      .eq('id', originalId);
    
    if (updateError) throw updateError;
    
    // Insert the new version
    const { data: newVersion, error: insertError } = await supabase
      .from('prompt_templates')
      .insert(newTemplate)
      .select()
      .single();
    
    if (insertError) throw insertError;
    
    toast.success('New template version created successfully');
    return newVersion as PromptTemplate;
  } catch (error) {
    console.error('Error creating versioned template:', error);
    toast.error('Failed to create new template version');
    throw error;
  }
}

export async function fetchTemplateVersionHistory(templateKey: string) {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('template_key', templateKey)
      .order('version', { ascending: false });
    
    if (error) throw error;
    return data as PromptTemplate[];
  } catch (error) {
    console.error(`Error fetching template history for ${templateKey}:`, error);
    toast.error('Failed to load template history');
    return [];
  }
}

export async function activatePromptTemplateVersion(templateId: string) {
  try {
    // First, get the template to find its key
    const { data: template, error: fetchError } = await supabase
      .from('prompt_templates')
      .select('template_key')
      .eq('id', templateId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Deactivate all versions of this template
    const { error: deactivateError } = await supabase
      .from('prompt_templates')
      .update({ is_active: false })
      .eq('template_key', template.template_key);
    
    if (deactivateError) throw deactivateError;
    
    // Activate the selected version
    const { data, error: activateError } = await supabase
      .from('prompt_templates')
      .update({ is_active: true })
      .eq('id', templateId)
      .select()
      .single();
    
    if (activateError) throw activateError;
    
    toast.success('Template version activated successfully');
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error activating template version:', error);
    toast.error('Failed to activate template version');
    throw error;
  }
}
