import { describe, it, expect, vi } from 'vitest';
import { ContentIdea, ContentType } from '@/types';
import { getContentSpecificSections } from '../contentSpecificSections';

describe('getContentSpecificSections', () => {
  it('should return LinkedIn specific sections when contentType is linkedin', () => {
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
    
    const contentType: ContentType = 'linkedin';
    
    const sections = getContentSpecificSections(idea, contentType);
    
    expect(sections).toContainEqual(
      expect.objectContaining({
        title: expect.stringContaining('LinkedIn'),
      })
    );
  });
  
  it('should return newsletter specific sections when contentType is newsletter', () => {
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
    
    const contentType: ContentType = 'newsletter';
    
    const sections = getContentSpecificSections(idea, contentType);
    
    expect(sections).toContainEqual(
      expect.objectContaining({
        title: expect.stringContaining('Newsletter'),
      })
    );
  });
  
  it('should return marketing specific sections when contentType is marketing', () => {
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
    
    const contentType: ContentType = 'marketing';
    
    const sections = getContentSpecificSections(idea, contentType);
    
    expect(sections).toContainEqual(
      expect.objectContaining({
        title: expect.stringContaining('Marketing'),
      })
    );
  });
  
  it('should extract content from notes if available', () => {
    const idea: ContentIdea = {
      id: '123',
      userId: 'user123',
      title: 'Test Idea',
      description: 'This is a test idea',
      notes: JSON.stringify({
        targetIcp: 'Marketing professionals',
        contentPillar: 'Content Strategy',
        keyPoints: ['Point 1', 'Point 2'],
        ctaSuggestion: 'Sign up for our newsletter'
      }),
      source: 'manual',
      status: 'approved',
      hasBeenUsed: false,
      createdAt: new Date(),
    };
    
    const contentType: ContentType = 'linkedin';
    
    const sections = getContentSpecificSections(idea, contentType);
    
    // Check if the parsed notes data is included in the sections
    const contentSection = sections.find(section => 
      section.content.includes('Marketing professionals') ||
      section.content.includes('Content Strategy')
    );
    
    expect(contentSection).toBeDefined();
  });
  
  it('should handle invalid JSON in notes gracefully', () => {
    const idea: ContentIdea = {
      id: '123',
      userId: 'user123',
      title: 'Test Idea',
      description: 'This is a test idea',
      notes: 'This is not valid JSON',
      source: 'manual',
      status: 'approved',
      hasBeenUsed: false,
      createdAt: new Date(),
    };
    
    const contentType: ContentType = 'linkedin';
    
    // Should not throw an error
    expect(() => getContentSpecificSections(idea, contentType)).not.toThrow();
    
    const sections = getContentSpecificSections(idea, contentType);
    expect(sections.length).toBeGreaterThan(0);
  });
});
