
import { describe, it, expect } from 'vitest';
import { buildBasePromptStructure } from '../basePromptBuilder';
import { ContentType } from '@/types';

describe('buildBasePromptStructure', () => {
  it('should build a base prompt with user profile data', () => {
    // Mock data
    const mockUser = {
      id: '123',
      email: 'john@example.com',
      name: 'John Doe',
      businessName: 'TechCorp',
      businessDescription: 'A tech company',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      jobTitle: 'Product Manager',
      createdAt: new Date()
    };
    
    const mockContentPillars = [
      { id: '1', userId: 'user1', name: 'Leadership', description: 'Thoughts on leadership', createdAt: new Date() },
      { id: '2', userId: 'user1', name: 'Product Management', description: 'Product development insights', createdAt: new Date() }
    ];
    
    const mockTargetAudiences = [
      { id: '1', userId: 'user1', name: 'Tech Leaders', description: 'CTOs and Tech Directors', painPoints: ['Scaling teams'], goals: ['Improve efficiency'], createdAt: new Date() },
      { id: '2', userId: 'user1', name: 'Product Managers', description: 'PMs in tech companies', painPoints: ['Feature prioritization'], goals: ['Build better products'], createdAt: new Date() }
    ];
    
    const mockStyleProfile = {
      id: 'style1',
      userId: 'user1',
      voiceAnalysis: 'Professional',
      generalStyleGuide: 'Clear and concise',
      exampleQuotes: ['Example 1', 'Example 2'],
      vocabularyPatterns: 'Technical terms',
      avoidPatterns: 'Jargon',
      linkedinStyleGuide: 'Professional but friendly',
      linkedinExamples: ['Example 1', 'Example 2'],
      newsletterStyleGuide: 'Informative',
      newsletterExamples: ['Example 1', 'Example 2'],
      marketingStyleGuide: 'Persuasive',
      marketingExamples: ['Example 1', 'Example 2'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const contentType: ContentType = 'linkedin';
    
    // Execute
    const result = buildBasePromptStructure(mockUser, mockContentPillars, mockTargetAudiences, mockStyleProfile, contentType);
    
    // Assert
    expect(result.sections.length).toBeGreaterThan(0);
    expect(result.sections[0].content).toContain('John Doe');
    
    // Find business context section
    const businessSection = result.sections.find(section => section.title === '# BUSINESS CONTEXT');
    expect(businessSection?.content).toContain('A tech company');
    
    // Find content pillars section
    const pillarsSection = result.sections.find(section => section.title === '# CONTENT PILLARS');
    expect(pillarsSection?.content).toContain('Leadership');
    expect(pillarsSection?.content).toContain('Product Management');
    
    // Find target audiences section
    const audiencesSection = result.sections.find(section => section.title === '# TARGET AUDIENCES');
    expect(audiencesSection?.content).toContain('Tech Leaders');
    expect(audiencesSection?.content).toContain('Product Managers');
    
    // Check writing style sections
    const styleSection = result.sections.find(section => section.title === '# WRITING STYLE ANALYSIS');
    expect(styleSection?.content).toContain('Professional');
  });
});
