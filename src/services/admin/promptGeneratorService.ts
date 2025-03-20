
import { supabase } from '@/integrations/supabase/client';
import { PromptTemplate } from './promptTemplateService';
import { PromptSection, PromptStructure } from '@/utils/promptBuilder/types';
import { 
  getBestPracticesSection,
  buildContentIdeaSection,
  buildLinkedinPostsSection,
  buildCustomInstructionsSection,
  buildTaskSection,
  buildNewsletterExamplesSection,
  buildMarketingExamplesSection,
  buildBusinessContextDocsSection,
  buildAvoidPatternsSection,
  buildPersonalStoriesSection
} from '@/utils/promptBuilder';

// This is a service that bridges the gap between code-based prompts and database-stored prompts

// Function to extract template functions from the codebase
export async function extractAndGenerateBaseTemplates() {
  try {
    // First check if we already have templates in the database
    const { data: existingTemplates, error: checkError } = await supabase
      .from('prompt_templates')
      .select('template_key')
      .limit(1);
    
    if (checkError) throw checkError;
    
    // Skip if we already have templates
    if (existingTemplates && existingTemplates.length > 0) {
      console.log('Templates already exist in the database. Skipping extraction.');
      return;
    }
    
    // Generate templates from the codebase
    const templates = generateTemplatesFromCode();
    
    // Insert templates into the database
    if (templates.length > 0) {
      const { error: insertError } = await supabase
        .from('prompt_templates')
        .insert(templates);
      
      if (insertError) throw insertError;
      console.log('Base templates successfully generated and stored.');
    }
  } catch (error) {
    console.error('Error extracting and generating templates:', error);
    throw error;
  }
}

// Function to generate templates from the codebase
function generateTemplatesFromCode() {
  const templates = [];
  
  // Extract best practices sections
  const contentTypes = ['linkedin', 'newsletter', 'marketing'];
  contentTypes.forEach(type => {
    const section = getBestPracticesSection(type as any);
    templates.push({
      template_key: `best_practices_${type}`,
      content: section.content,
      description: `Best practices for ${type} content generation`,
      category: 'best_practices',
      content_type: type,
      is_active: true
    });
  });
  
  // Content specific templates
  templates.push({
    template_key: 'linkedin_posts_section',
    content: '# EXAMPLE LINKEDIN POSTS\n\nHere are some examples of my previous LinkedIn posts for reference:\n\n{posts}',
    description: 'Template for LinkedIn posts examples',
    category: 'examples',
    content_type: 'linkedin',
    is_active: true
  });
  
  templates.push({
    template_key: 'newsletter_examples_section',
    content: '# NEWSLETTER EXAMPLES\n\nHere are examples of my newsletter style for reference:\n\n{examples}',
    description: 'Template for newsletter examples',
    category: 'examples',
    content_type: 'newsletter',
    is_active: true
  });
  
  templates.push({
    template_key: 'marketing_examples_section',
    content: '# MARKETING MATERIAL EXAMPLES\n\nHere are examples of my marketing material style for reference:\n\n{examples}',
    description: 'Template for marketing material examples',
    category: 'examples',
    content_type: 'marketing',
    is_active: true
  });
  
  templates.push({
    template_key: 'business_context_section',
    content: '# BUSINESS CONTEXT DOCUMENTS\n\nHere is additional business context to reference when creating content:\n\n{documents}',
    description: 'Template for business context documents',
    category: 'context',
    content_type: null,
    is_active: true
  });
  
  templates.push({
    template_key: 'patterns_to_avoid_section',
    content: '# PATTERNS TO AVOID\n\nPlease avoid these patterns in your writing:\n\n{patterns}',
    description: 'Template for patterns to avoid in writing',
    category: 'style',
    content_type: null,
    is_active: true
  });
  
  templates.push({
    template_key: 'content_idea_section',
    content: '# CONTENT IDEA DETAILS\n\nTitle: {title}\nDescription: {description}\nContent Type: {contentType}\n\nNotes: {notes}',
    description: 'Template for content idea details',
    category: 'idea',
    content_type: null,
    is_active: true
  });
  
  templates.push({
    template_key: 'personal_stories_section',
    content: '# PERSONAL STORIES\n\nHere are personal stories that may be relevant to this content:\n\n{stories}',
    description: 'Template for personal stories',
    category: 'context',
    content_type: null,
    is_active: true
  });
  
  // Task templates for different content types
  contentTypes.forEach(type => {
    let taskContent = '';
    
    if (type === 'linkedin') {
      taskContent = '# TASK\n\nUsing my writing style, content pillars, target audience, and the content idea provided, please generate a complete LinkedIn post that matches my voice and focuses on the key message of the content idea.';
    } else if (type === 'newsletter') {
      taskContent = '# TASK\n\nUsing my writing style, content pillars, target audience, and the content idea provided, please generate a complete newsletter that matches my voice and focuses on the key message of the content idea.';
    } else if (type === 'marketing') {
      taskContent = '# TASK\n\nUsing my writing style, content pillars, target audience, and the content idea provided, please generate marketing content that matches my voice and focuses on the key message of the content idea.';
    }
    
    templates.push({
      template_key: `task_${type}`,
      content: taskContent,
      description: `Task template for ${type} content generation`,
      category: 'task',
      content_type: type,
      is_active: true
    });
  });
  
  return templates;
}

// Function to retrieve a template from the database or fall back to code
export async function getPromptTemplate(templateKey: string, fallbackToCode = true) {
  try {
    // First try to get from database
    const { data, error } = await supabase
      .from('prompt_templates')
      .select('*')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .maybeSingle();
    
    if (error) throw error;
    
    // If found in database, return the content
    if (data) return data.content;
    
    // If not found and fallback is enabled, use code-based function
    if (fallbackToCode) {
      return getCodeBasedTemplate(templateKey);
    }
    
    return null;
  } catch (error) {
    console.error(`Error getting prompt template ${templateKey}:`, error);
    
    // As a final fallback, try code-based
    if (fallbackToCode) {
      return getCodeBasedTemplate(templateKey);
    }
    
    return null;
  }
}

// Function to get a template from the codebase
function getCodeBasedTemplate(templateKey: string) {
  // This is a simplified version - in a real implementation, this would be more comprehensive
  const contentTypeMatch = templateKey.match(/best_practices_(.+)/);
  if (contentTypeMatch) {
    const contentType = contentTypeMatch[1];
    const section = getBestPracticesSection(contentType as any);
    return section.content;
  }
  
  // Additional template keys could be handled here
  
  return null;
}
