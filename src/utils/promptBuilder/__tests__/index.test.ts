import { describe, it, expect, vi } from 'vitest';
import { buildPrompt } from '../index';
import { ContentIdea, ContentType } from '@/types';

describe('buildPrompt', () => {
  it('should build a prompt with all sections', () => {
    const idea: ContentIdea = {
      id: '123',
      userId: 'user123',
      title: 'Test Idea',
      description: 'This is a test idea',
      notes: 'Some notes about the idea',
      source: 'manual',
      status: 'approved',
      hasBeenUsed: false,
      createdAt: new Date(),
    };
    
    const contentType: ContentType = 'linkedin';
    
    const prompt = buildPrompt(idea, contentType);
    
    expect(prompt).toContain('# Content Idea');
    expect(prompt).toContain('Test Idea');
    expect(prompt).toContain('This is a test idea');
    expect(prompt).toContain('Some notes about the idea');
  });
  
  it('should include content type specific sections', () => {
    const idea: ContentIdea = {
      id: '123',
      userId: 'user123',
      title: 'LinkedIn Post Idea',
      description: 'This is a LinkedIn post idea',
      notes: 'Some notes about the LinkedIn post',
      source: 'manual',
      status: 'approved',
      hasBeenUsed: false,
      createdAt: new Date(),
    };
    
    const linkedinPrompt = buildPrompt(idea, 'linkedin');
    expect(linkedinPrompt).toContain('LinkedIn Post Guidelines');
    
    const newsletterPrompt = buildPrompt(idea, 'newsletter');
    expect(newsletterPrompt).toContain('Newsletter Guidelines');
    
    const marketingPrompt = buildPrompt(idea, 'marketing');
    expect(marketingPrompt).toContain('Marketing Content Guidelines');
  });
  
  it('should handle empty notes', () => {
    const idea: ContentIdea = {
      id: '123',
      userId: 'user123',
      title: 'Test Idea',
      description: 'This is a test idea',
      notes: '',
      source: 'manual',
      status: 'approved',
      hasBeenUsed: false,
      createdAt: new Date(),
    };
    
    const prompt = buildPrompt(idea, 'linkedin');
    
    expect(prompt).toContain('# Content Idea');
    expect(prompt).toContain('Test Idea');
    expect(prompt).not.toContain('## Additional Notes');
  });
  
  it('should include writing style if provided', () => {
    const idea: ContentIdea = {
      id: '123',
      userId: 'user123',
      title: 'Test Idea',
      description: 'This is a test idea',
      notes: 'Some notes',
      source: 'manual',
      status: 'approved',
      hasBeenUsed: false,
      createdAt: new Date(),
    };
    
    const writingStyle = {
      voiceAnalysis: 'Professional and authoritative',
      generalStyleGuide: 'Use clear, concise language',
      linkedinStyleGuide: 'Engage with questions',
      newsletterStyleGuide: 'Tell stories',
      marketingStyleGuide: 'Focus on benefits',
      vocabularyPatterns: 'Technical terms',
      avoidPatterns: 'Jargon, clichés'
    };
    
    const prompt = buildPrompt(idea, 'linkedin', writingStyle);
    
    expect(prompt).toContain('Professional and authoritative');
    expect(prompt).toContain('Use clear, concise language');
    expect(prompt).toContain('Engage with questions');
  });
  
  it('should handle missing writing style', () => {
    const idea: ContentIdea = {
      id: '123',
      userId: 'user123',
      title: 'Test Idea',
      description: 'This is a test idea',
      notes: 'Some notes',
      source: 'manual',
      status: 'approved',
      hasBeenUsed: false,
      createdAt: new Date(),
    };
    
    const prompt = buildPrompt(idea, 'linkedin');
    
    expect(prompt).not.toContain('## Writing Style');
  });
});
