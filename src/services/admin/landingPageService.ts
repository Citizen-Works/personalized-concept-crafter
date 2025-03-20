
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LandingPageContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  image_url: string | null;
  order: number;
  updated_at: string;
  updated_by: string | null;
  created_at: string;
}

export async function fetchLandingPageContent() {
  try {
    const { data, error } = await supabase
      .from('landing_page_content')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data as LandingPageContent[];
  } catch (error) {
    console.error('Error fetching landing page content:', error);
    toast.error('Failed to load landing page content');
    return [];
  }
}

export async function fetchLandingPageSection(sectionKey: string) {
  try {
    const { data, error } = await supabase
      .from('landing_page_content')
      .select('*')
      .eq('section_key', sectionKey)
      .maybeSingle();
    
    if (error) throw error;
    return data as LandingPageContent | null;
  } catch (error) {
    console.error(`Error fetching section ${sectionKey}:`, error);
    toast.error(`Failed to load section: ${sectionKey}`);
    return null;
  }
}

export async function updateLandingPageContent(content: Partial<LandingPageContent> & { id: string }) {
  try {
    const { data, error } = await supabase
      .from('landing_page_content')
      .update(content)
      .eq('id', content.id)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('Content updated successfully');
    return data as LandingPageContent;
  } catch (error) {
    console.error('Error updating landing page content:', error);
    toast.error('Failed to update content');
    throw error;
  }
}

export async function createLandingPageContent(content: Omit<LandingPageContent, 'id' | 'created_at' | 'updated_at' | 'updated_by'>) {
  try {
    const { data, error } = await supabase
      .from('landing_page_content')
      .insert(content)
      .select()
      .single();
    
    if (error) throw error;
    toast.success('New section created successfully');
    return data as LandingPageContent;
  } catch (error) {
    console.error('Error creating landing page content:', error);
    toast.error('Failed to create new section');
    throw error;
  }
}
