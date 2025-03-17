
import { describe, it, expect } from 'vitest';
import { 
  buildContentIdeaSection, 
  buildTaskSection, 
  buildCustomInstructionsSection,
  buildLinkedinPostsSection
} from '../contentSpecificSections';
import { ContentIdea, LinkedinPost } from '@/types';

describe('Content Specific Sections', () => {
  describe('buildContentIdeaSection', () => {
    it('should build content idea section', () => {
      const idea: ContentIdea = {
        id: '123',
        userId: 'user123',
        title: 'Test Idea',
        description: 'This is a test idea',
        notes: 'Some notes',
        source: 'manual',
        meetingTranscriptExcerpt: 'Transcript excerpt',
        sourceUrl: null,
        status: 'unreviewed',
        contentType: 'linkedin',
        createdAt: new Date()
      };
      
      const result = buildContentIdeaSection(idea);
      
      expect(result.title).toBe('# CONTENT IDEA');
      expect(result.content).toContain('Test Idea');
      expect(result.content).toContain('This is a test idea');
      expect(result.content).toContain('Some notes');
      expect(result.content).toContain('Transcript excerpt');
    });
  });
  
  describe('buildTaskSection', () => {
    it('should build LinkedIn task section', () => {
      const promptText = 'You are an expert content creator helping John Doe of TechCorp create LinkedIn content';
      const result = buildTaskSection('linkedin', promptText);
      
      expect(result.title).toBe('# TASK');
      expect(result.content).toContain('Write a LinkedIn post');
      expect(result.content).toContain('John Doe');
    });
    
    it('should build newsletter task section', () => {
      const result = buildTaskSection('newsletter', 'base prompt');
      
      expect(result.title).toBe('# TASK');
      expect(result.content).toContain('Create newsletter content');
    });
    
    it('should build marketing task section', () => {
      const result = buildTaskSection('marketing', 'base prompt');
      
      expect(result.title).toBe('# TASK');
      expect(result.content).toContain('Create marketing copy');
    });
  });
  
  describe('buildCustomInstructionsSection', () => {
    it('should build custom instructions section', () => {
      const customInstructions = 'These are custom instructions.';
      
      const result = buildCustomInstructionsSection(customInstructions);
      
      expect(result?.title).toBe('# CUSTOM INSTRUCTIONS');
      expect(result?.content).toContain('These are custom instructions.');
    });
    
    it('should return null for empty custom instructions', () => {
      const result = buildCustomInstructionsSection(null);
      
      expect(result).toBeNull();
    });
  });
  
  describe('buildLinkedinPostsSection', () => {
    it('should build linkedin posts section', () => {
      const posts: LinkedinPost[] = [
        {
          id: '1',
          userId: 'user1',
          content: 'First post content',
          publishedAt: new Date(),
          url: 'https://linkedin.com/post/1',
          createdAt: new Date()
        },
        {
          id: '2',
          userId: 'user1',
          content: 'Second post content',
          publishedAt: new Date(),
          url: 'https://linkedin.com/post/2',
          createdAt: new Date()
        }
      ];
      
      const result = buildLinkedinPostsSection(posts);
      
      expect(result.title).toBe('# EXAMPLES OF PREVIOUS LINKEDIN POSTS');
      expect(result.content).toContain('First post content');
      expect(result.content).toContain('Second post content');
    });
    
    it('should handle empty posts array', () => {
      const result = buildLinkedinPostsSection([]);
      
      expect(result.title).toBe('# EXAMPLES OF PREVIOUS LINKEDIN POSTS');
      expect(result.content).toContain('No previous LinkedIn posts available');
    });
  });
});
