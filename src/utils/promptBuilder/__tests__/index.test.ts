
import { describe, it, expect } from 'vitest';
import { ContentIdea, ContentSource, ContentStatus, ContentType } from '@/types';
import { buildPrompt } from '../index';

describe('buildPrompt', () => {
  it('builds prompt structure with proper sections', () => {
    // Create a mock content idea
    const mockIdea: ContentIdea = {
      id: 'test-id',
      userId: 'user-123',
      title: 'Test Idea',
      description: 'Test description',
      notes: 'Test notes',
      source: 'manual' as ContentSource,
      status: 'approved' as ContentStatus,
      hasBeenUsed: false,
      createdAt: new Date(),
      contentPillarIds: [],
      targetAudienceIds: []
    };

    // Test for LinkedIn content type
    const linkedinPrompt = buildPrompt(mockIdea, 'linkedin');
    
    expect(linkedinPrompt.sections).toHaveLength(3); // Base sections + LinkedIn section
    expect(linkedinPrompt.sections[0].title).toBe('Content Idea');
    expect(linkedinPrompt.sections[0].content).toBe('Test Idea');
    expect(linkedinPrompt.sections[1].title).toBe('Description');
    expect(linkedinPrompt.sections[1].content).toBe('Test description');
    expect(linkedinPrompt.sections[2].title).toBe('LinkedIn Specific Guidelines');
  });

  it('handles idea without notes', () => {
    // Create a mock content idea without notes
    const mockIdea: ContentIdea = {
      id: 'test-id',
      userId: 'user-123',
      title: 'Test Idea',
      description: 'Test description',
      notes: '',
      source: 'manual' as ContentSource,
      status: 'approved' as ContentStatus,
      hasBeenUsed: false,
      createdAt: new Date(),
      contentPillarIds: [],
      targetAudienceIds: []
    };

    const prompt = buildPrompt(mockIdea, 'newsletter');
    
    expect(prompt.sections).toHaveLength(3); // Just title, description, and newsletter section
    expect(prompt.sections[0].title).toBe('Content Idea');
    expect(prompt.sections[1].title).toBe('Description');
  });
});
