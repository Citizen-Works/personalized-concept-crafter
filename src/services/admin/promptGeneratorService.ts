
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  buildBasePrompt,
  getBestPracticesSection,
  buildBusinessContextSection,
  buildContentPillarsSection,
  buildTargetAudiencesSection,
  buildWritingStyleSections
} from '@/utils/promptBuilder';
import { PromptTemplate } from './promptTemplateService';
import { ContentPillar, TargetAudience } from '@/types';
import { WritingStyleProfile } from '@/types/writingStyle';

// Define a simple User interface that matches what's needed in this file
interface User {
  id: string;
  name: string;
  businessName: string;
  businessDescription: string;
  email: string;
  linkedinUrl: string;
  jobTitle: string;
  createdAt: Date;
}

// Templates are organized into major categories
const TEMPLATE_CATEGORIES = {
  BASE: 'base',
  CONTENT_TYPE: 'content_type',
  BEST_PRACTICES: 'best_practices'
};

// Check if prompt templates already exist in the database
export async function checkPromptTemplatesExist(): Promise<boolean> {
  try {
    const { count, error } = await supabase
      .from('prompt_templates')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return (count || 0) > 0;
  } catch (error) {
    console.error('Error checking for prompt templates:', error);
    return false;
  }
}

// Extract base templates from available functions and store in the database
export async function extractAndGenerateBaseTemplates(): Promise<boolean> {
  try {
    // Check if templates already exist
    const exists = await checkPromptTemplatesExist();
    if (exists) {
      console.log('Prompt templates already exist in the database');
      return true;
    }
    
    console.log('Extracting prompt templates from code...');
    
    const currentUser = await supabase.auth.getUser();
    const userId = currentUser.data.user?.id;
    
    // Create dummy data for testing functions
    const dummyUser: User = { 
      id: 'dummy', 
      name: 'Dummy User', 
      businessName: 'Dummy Business', 
      businessDescription: 'A test business',
      email: 'dummy@example.com',
      linkedinUrl: '',
      jobTitle: 'Tester',
      createdAt: new Date()
    };
    
    const dummyPillars: ContentPillar[] = [{
      id: '1', 
      userId: 'dummy',
      name: 'Test Pillar', 
      description: 'Test description',
      createdAt: new Date()
    }];
    
    const dummyAudiences: TargetAudience[] = [{
      id: '1', 
      userId: 'dummy',
      name: 'Test Audience', 
      description: 'Test audience', 
      painPoints: ['pain'], 
      goals: ['goal'],
      createdAt: new Date()
    }];
    
    // Create a dummy style profile that matches both interfaces
    const dummyStyleProfile: WritingStyleProfile = {
      id: 'dummy',
      userId: 'dummy',
      user_id: 'dummy',
      voiceAnalysis: 'Test voice',
      voice_analysis: 'Test voice',
      generalStyleGuide: 'Test style',
      general_style_guide: 'Test style',
      exampleQuotes: [],
      vocabularyPatterns: '',
      vocabulary_patterns: '',
      avoidPatterns: '',
      avoid_patterns: '',
      linkedinStyleGuide: '',
      linkedin_style_guide: '',
      linkedinExamples: [],
      newsletterStyleGuide: '',
      newsletter_style_guide: '',
      newsletterExamples: [],
      marketingStyleGuide: '',
      marketing_style_guide: '',
      marketingExamples: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Extract different parts of the prompt structure as templates
    // Base templates
    const businessSection = buildBusinessContextSection(dummyUser);
    const contentPillarsSection = buildContentPillarsSection(dummyPillars);
    const targetAudiencesSection = buildTargetAudiencesSection(dummyAudiences);
    
    const baseTemplates = {
      'business_context': businessSection ? businessSection.content : '',
      'content_pillars': contentPillarsSection ? contentPillarsSection.content : '',
      'target_audiences': targetAudiencesSection ? targetAudiencesSection.content : '',
    };
    
    // Content type specific style guides
    const contentTypes = ['linkedin', 'newsletter', 'marketing'];
    const contentTypeTemplates = {};
    
    for (const contentType of contentTypes) {
      const styleSections = buildWritingStyleSections(dummyStyleProfile, contentType as any);
      if (styleSections && styleSections.length > 0) {
        contentTypeTemplates[contentType] = {
          'style_guide': styleSections[0].content || '', // Use first section as example
        };
      } else {
        contentTypeTemplates[contentType] = {
          'style_guide': '',
        };
      }
    }
    
    // Best practices for different content types
    const bestPracticesTemplates = {};
    for (const contentType of contentTypes) {
      const section = getBestPracticesSection(contentType as any);
      if (section) {
        bestPracticesTemplates[contentType] = section.content;
      } else {
        bestPracticesTemplates[contentType] = '';
      }
    }
    
    // Prepare templates for database
    const baseTemplateEntries = Object.entries(baseTemplates).map(([key, content]) => ({
      template_key: `base_${key}`,
      content: content,
      description: `Base template for ${key} prompts`,
      category: TEMPLATE_CATEGORIES.BASE,
      content_type: null,
      is_active: true,
      updated_by: userId
    }));
    
    // Content type specific templates
    const contentTypeEntries = [];
    for (const [contentType, sections] of Object.entries(contentTypeTemplates)) {
      for (const [sectionKey, content] of Object.entries(sections)) {
        contentTypeEntries.push({
          template_key: `content_type_${contentType}_${sectionKey}`,
          content: content,
          description: `${contentType} specific section for ${sectionKey}`,
          category: TEMPLATE_CATEGORIES.CONTENT_TYPE,
          content_type: contentType,
          is_active: true,
          updated_by: userId
        });
      }
    }
    
    // Best practices templates
    const bestPracticesEntries = Object.entries(bestPracticesTemplates).map(([key, content]) => ({
      template_key: `best_practices_${key}`,
      content: content,
      description: `Best practices for ${key}`,
      category: TEMPLATE_CATEGORIES.BEST_PRACTICES,
      content_type: key,
      is_active: true,
      updated_by: userId
    }));
    
    // Combine all template entries
    const allTemplates = [
      ...baseTemplateEntries,
      ...contentTypeEntries,
      ...bestPracticesEntries
    ];
    
    // Insert templates in batches to avoid hitting Supabase limits
    const BATCH_SIZE = 50;
    for (let i = 0; i < allTemplates.length; i += BATCH_SIZE) {
      const batch = allTemplates.slice(i, i + BATCH_SIZE);
      const { error } = await supabase
        .from('prompt_templates')
        .insert(batch);
      
      if (error) throw error;
      
      console.log(`Inserted batch ${i/BATCH_SIZE + 1} of ${Math.ceil(allTemplates.length/BATCH_SIZE)}`);
    }
    
    console.log('Successfully extracted and stored prompt templates');
    return true;
  } catch (error) {
    console.error('Error generating base templates:', error);
    return false;
  }
}

// Get a specific prompt template from database, or fall back to code
export async function getPromptTemplate(templateKey: string): Promise<string> {
  try {
    // Try to get from database first
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single();
    
    // If found in database, return that
    if (!error && data) {
      return (data as PromptTemplate).content;
    }
    
    // Otherwise fall back to code-based templates
    console.log(`Template ${templateKey} not found in database, falling back to code`);
    
    // Example fallback logic based on template key
    if (templateKey.startsWith('base_business_context')) {
      const section = buildBusinessContextSection(null);
      return section ? section.content : '';
    } else if (templateKey.startsWith('base_content_pillars')) {
      const section = buildContentPillarsSection([]);
      return section ? section.content : '';
    } else if (templateKey.startsWith('base_target_audiences')) {
      const section = buildTargetAudiencesSection([]);
      return section ? section.content : '';
    } else if (templateKey.startsWith('best_practices_')) {
      const contentType = templateKey.replace('best_practices_', '');
      const section = getBestPracticesSection(contentType as any);
      return section ? section.content : '';
    }
    
    return '';
  } catch (error) {
    console.error(`Error fetching prompt template ${templateKey}:`, error);
    return '';
  }
}
