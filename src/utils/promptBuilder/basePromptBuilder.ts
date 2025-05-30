
import { PromptSection, PromptStructure } from './types';
import { ContentPillar, TargetAudience, ContentType } from '@/types';
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

/**
 * Creates the business context section for the prompt
 */
export function buildBusinessContextSection(user: User | null): PromptSection {
  let content = '';
  
  if (user) {
    content += `${user.businessDescription || 'Not specified'}\n\n`;
    
    if (user.jobTitle) {
      content += `Job Title: ${user.jobTitle}\n\n`;
    }
  } else {
    content += 'Not specified\n\n';
  }
  
  return {
    title: '# BUSINESS CONTEXT',
    content
  };
}

/**
 * Creates the content pillars section for the prompt
 */
export function buildContentPillarsSection(contentPillars: ContentPillar[]): PromptSection {
  let content = '';
  
  if (contentPillars.length > 0) {
    contentPillars.forEach(pillar => {
      content += `- ${pillar.name}: ${pillar.description}\n`;
    });
    content += '\n';
  } else {
    content += '- No content pillars defined\n\n';
  }
  
  return {
    title: '# CONTENT PILLARS',
    content
  };
}

/**
 * Creates the target audiences section for the prompt
 */
export function buildTargetAudiencesSection(targetAudiences: TargetAudience[]): PromptSection {
  let content = '';
  
  if (targetAudiences.length > 0) {
    targetAudiences.forEach(audience => {
      content += `- ${audience.name}: ${audience.description}\n`;
      if (audience.painPoints && audience.painPoints.length > 0) {
        content += `  Pain points: ${audience.painPoints.join(', ')}\n`;
      }
      if (audience.goals && audience.goals.length > 0) {
        content += `  Goals: ${audience.goals.join(', ')}\n`;
      }
    });
    content += '\n';
  } else {
    content += '- No target audiences defined\n\n';
  }
  
  return {
    title: '# TARGET AUDIENCES',
    content
  };
}

/**
 * Creates the writing style sections for the prompt
 */
export function buildWritingStyleSections(
  styleProfile: WritingStyleProfile | null, 
  contentType: ContentType
): PromptSection[] {
  const sections: PromptSection[] = [];
  
  if (styleProfile) {
    // Voice Analysis Section
    sections.push({
      title: '# WRITING STYLE ANALYSIS',
      content: styleProfile.voiceAnalysis || 'No voice analysis available.\n'
    });
    
    // General Style Guide Section
    sections.push({
      title: '# GENERAL STYLE GUIDE',
      content: styleProfile.generalStyleGuide || 'No general style guide available.\n'
    });
    
    // Content Type Specific Style
    let contentTypeStyleTitle = '';
    let contentTypeStyleContent = '';
    
    if (contentType === 'linkedin') {
      contentTypeStyleTitle = '# LINKEDIN-SPECIFIC STYLE';
      contentTypeStyleContent = styleProfile.linkedinStyleGuide || 'No LinkedIn style guide available.\n';
    } else if (contentType === 'newsletter') {
      contentTypeStyleTitle = '# NEWSLETTER-SPECIFIC STYLE';
      contentTypeStyleContent = styleProfile.newsletterStyleGuide || 'No Newsletter style guide available.\n';
    } else if (contentType === 'marketing') {
      contentTypeStyleTitle = '# MARKETING-SPECIFIC STYLE';
      contentTypeStyleContent = styleProfile.marketingStyleGuide || 'No Marketing style guide available.\n';
    }
    
    sections.push({
      title: contentTypeStyleTitle,
      content: contentTypeStyleContent
    });
    
    // Vocabulary Patterns Section
    sections.push({
      title: '# VOCABULARY PATTERNS TO USE',
      content: styleProfile.vocabularyPatterns || 'No vocabulary patterns specified.\n'
    });
  } else {
    sections.push({
      title: '# WRITING STYLE GUIDE',
      content: 'No writing style profile available.\n\n'
    });
  }
  
  return sections;
}

/**
 * Builds the base prompt structure with all sections
 * Reordered to put most important information towards the end
 */
export function buildBasePromptStructure(
  user: User | null, 
  contentPillars: ContentPillar[], 
  targetAudiences: TargetAudience[], 
  styleProfile: WritingStyleProfile | null,
  contentType: ContentType
): PromptStructure {
  const sections: PromptSection[] = [];
  
  // Introduction section
  let introContent = 'You are an expert content creator helping ';
  if (user) {
    introContent += `${user.name} of ${user.businessName} `;
    
    if (contentType === 'linkedin') {
      introContent += 'create a LinkedIn post that perfectly matches their authentic voice and style and grabs the attention of their target audience.\n\n';
    } else if (contentType === 'newsletter') {
      introContent += 'create newsletter content that perfectly matches their authentic voice and style.\n\n';
    } else if (contentType === 'marketing') {
      introContent += 'create marketing copy that perfectly matches their authentic voice and style.\n\n';
    }
  } else {
    introContent += 'the user create content that perfectly matches their authentic voice and style.\n\n';
  }
  
  sections.push({ title: '', content: introContent });
  
  // Add initial context (less important context first)
  sections.push(buildBusinessContextSection(user));
  
  // Add writing style sections (moved up as they provide general guidance)
  const styleProfileSections = buildWritingStyleSections(styleProfile, contentType);
  sections.push(...styleProfileSections);
  
  // Add content pillars and target audiences (moved down as they're more relevant to specific content)
  sections.push(buildContentPillarsSection(contentPillars));
  sections.push(buildTargetAudiencesSection(targetAudiences));
  
  return { sections };
}
