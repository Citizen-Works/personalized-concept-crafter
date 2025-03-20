
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

export async function fetchPromptTemplates(): Promise<PromptTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .order('category', { ascending: true })
      .order('template_key', { ascending: true });
    
    if (error) throw error;
    
    return data as PromptTemplate[];
  } catch (error) {
    console.error('Error fetching prompt templates:', error);
    toast.error('Failed to load prompt templates');
    return [];
  }
}

export async function fetchPromptTemplate(templateKey: string): Promise<PromptTemplate | null> {
  try {
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error fetching prompt template:', error);
    toast.error('Failed to load template');
    return null;
  }
}

export async function updatePromptTemplate(template: Partial<PromptTemplate> & { id: string }): Promise<PromptTemplate | null> {
  try {
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('prompt_templates')
      .update({
        content: template.content,
        description: template.description,
        category: template.category,
        content_type: template.content_type,
        is_active: template.is_active,
        updated_by: currentUser.data.user?.id
      })
      .eq('id', template.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Prompt template updated');
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error updating prompt template:', error);
    toast.error('Failed to update prompt template');
    return null;
  }
}

export async function createPromptTemplate(template: Omit<PromptTemplate, 'id' | 'created_at' | 'updated_at' | 'version' | 'updated_by' | 'parent_version'>): Promise<PromptTemplate | null> {
  try {
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('prompt_templates')
      .insert({
        template_key: template.template_key,
        content: template.content,
        description: template.description,
        category: template.category,
        content_type: template.content_type,
        is_active: template.is_active,
        updated_by: currentUser.data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('New prompt template created');
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error creating prompt template:', error);
    toast.error('Failed to create prompt template');
    return null;
  }
}

export async function fetchTemplateVersionHistory(templateKey: string): Promise<PromptTemplate[]> {
  try {
    // First get the current template
    const { data: currentTemplate, error: currentError } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('template_key', templateKey)
      .order('version', { ascending: false })
      .limit(1)
      .single();
    
    if (currentError) throw currentError;
    
    // Then get all versions
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('template_key', templateKey)
      .order('version', { ascending: false });
    
    if (error) throw error;
    
    return data as PromptTemplate[];
  } catch (error) {
    console.error('Error fetching template history:', error);
    toast.error('Failed to load template history');
    return [];
  }
}

export async function createVersionedPromptTemplate(originalId: string, updates: Partial<PromptTemplate>): Promise<PromptTemplate | null> {
  try {
    // Get the original template
    const { data: original, error: getError } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('id', originalId)
      .single();
    
    if (getError) throw getError;
    
    const original_template = original as PromptTemplate;
    const currentUser = await supabase.auth.getUser();
    
    // Create a new version
    const { data, error } = await supabase
      .from('prompt_templates')
      .insert({
        template_key: original_template.template_key,
        content: updates.content || original_template.content,
        description: updates.description || original_template.description,
        category: updates.category || original_template.category,
        content_type: updates.content_type || original_template.content_type,
        is_active: true, // The new version is active
        version: original_template.version + 1, // Increment version
        parent_version: original_template.id, // Reference the parent
        updated_by: currentUser.data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Set the old version to inactive
    await supabase
      .from('prompt_templates')
      .update({ is_active: false })
      .eq('id', originalId);
    
    toast.success('New template version created');
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error creating versioned template:', error);
    toast.error('Failed to create new template version');
    return null;
  }
}

export async function activatePromptTemplateVersion(versionId: string): Promise<PromptTemplate | null> {
  try {
    // Get the template to activate
    const { data: toActivate, error: getError } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('id', versionId)
      .single();
    
    if (getError) throw getError;
    
    const templateToActivate = toActivate as PromptTemplate;
    
    // Mark all other versions of this template as inactive
    await supabase
      .from('prompt_templates')
      .update({ is_active: false })
      .eq('template_key', templateToActivate.template_key);
    
    // Activate the selected version
    const { data, error } = await supabase
      .from('prompt_templates')
      .update({ is_active: true })
      .eq('id', versionId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Template version activated');
    return data as PromptTemplate;
  } catch (error) {
    console.error('Error activating template version:', error);
    toast.error('Failed to activate template version');
    return null;
  }
}
