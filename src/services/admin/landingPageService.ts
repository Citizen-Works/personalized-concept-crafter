
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

export async function fetchLandingPageContent(): Promise<LandingPageContent[]> {
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

export async function fetchLandingPageSection(sectionKey: string): Promise<LandingPageContent | null> {
  try {
    const { data, error } = await supabase
      .from('landing_page_content')
      .select('*')
      .eq('section_key', sectionKey)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data as LandingPageContent;
  } catch (error) {
    console.error('Error fetching landing page section:', error);
    toast.error('Failed to load section');
    return null;
  }
}

export async function updateLandingPageContent(content: Partial<LandingPageContent> & { id: string }): Promise<LandingPageContent | null> {
  try {
    const { data, error } = await supabase
      .from('landing_page_content')
      .update({
        title: content.title,
        content: content.content,
        image_url: content.image_url,
        order: content.order,
        updated_by: (await supabase.auth.getUser()).data.user?.id
      })
      .eq('id', content.id)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('Landing page content updated');
    return data as LandingPageContent;
  } catch (error) {
    console.error('Error updating landing page content:', error);
    toast.error('Failed to update landing page content');
    return null;
  }
}

export async function createLandingPageContent(content: Omit<LandingPageContent, 'id' | 'created_at' | 'updated_at' | 'updated_by'>): Promise<LandingPageContent | null> {
  try {
    const currentUser = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('landing_page_content')
      .insert({
        section_key: content.section_key,
        title: content.title,
        content: content.content,
        image_url: content.image_url,
        order: content.order,
        updated_by: currentUser.data.user?.id
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success('New landing page section created');
    return data as LandingPageContent;
  } catch (error) {
    console.error('Error creating landing page content:', error);
    toast.error('Failed to create landing page section');
    return null;
  }
}
