
import { describe, it, expect } from 'vitest';
import { 
  addContentIdeaToPrompt, 
  addTaskToPrompt, 
  addCustomInstructionsToPrompt,
  addLinkedinPostsToPrompt
} from '../contentSpecificSections';
import { ContentIdea, LinkedinPost } from '@/types';

describe('Content Specific Sections', () => {
  const basePrompt = 'This is the base prompt.';
  
  describe('addContentIdeaToPrompt', () => {
    it('should add content idea to the prompt', () => {
      const idea: ContentIdea = {
        id: '123',
        title: 'Test Idea',
        description: 'This is a test idea',
        target_keyword: 'testing',
        status: 'active',
        created_at: new Date().toISOString(),
        user_id: 'user123',
        content_type: 'linkedin'
      };
      
      const result = addContentIdeaToPrompt(basePrompt, idea);
      
      expect(result).toContain('This is the base prompt.');
      expect(result).toContain('CONTENT IDEA');
      expect(result).toContain('Test Idea');
      expect(result).toContain('This is a test idea');
      expect(result).toContain('testing');
    });
  });
  
  describe('addTaskToPrompt', () => {
    it('should add linkedin task to the prompt', () => {
      const result = addTaskToPrompt(basePrompt, 'linkedin');
      
      expect(result).toContain('This is the base prompt.');
      expect(result).toContain('TASK');
      expect(result).toContain('LinkedIn post');
    });
    
    it('should add newsletter task to the prompt', () => {
      const result = addTaskToPrompt(basePrompt, 'newsletter');
      
      expect(result).toContain('This is the base prompt.');
      expect(result).toContain('TASK');
      expect(result).toContain('newsletter');
    });
  });
  
  describe('addCustomInstructionsToPrompt', () => {
    it('should add custom instructions to the prompt', () => {
      const customInstructions = 'These are custom instructions.';
      
      const result = addCustomInstructionsToPrompt(basePrompt, customInstructions);
      
      expect(result).toContain('This is the base prompt.');
      expect(result).toContain('CUSTOM INSTRUCTIONS');
      expect(result).toContain('These are custom instructions.');
    });
    
    it('should handle empty custom instructions', () => {
      const result = addCustomInstructionsToPrompt(basePrompt, '');
      
      expect(result).toBe(basePrompt);
    });
  });
  
  describe('addLinkedinPostsToPrompt', () => {
    it('should add linkedin posts to the prompt', () => {
      const posts: LinkedinPost[] = [
        {
          id: '1',
          content: 'First post content',
          published_at: new Date().toISOString(),
          engagement: { likes: 10, comments: 5, shares: 2 }
        },
        {
          id: '2',
          content: 'Second post content',
          published_at: new Date().toISOString(),
          engagement: { likes: 20, comments: 8, shares: 3 }
        }
      ];
      
      const result = addLinkedinPostsToPrompt(basePrompt, posts);
      
      expect(result).toContain('This is the base prompt.');
      expect(result).toContain('RECENT LINKEDIN POSTS');
      expect(result).toContain('First post content');
      expect(result).toContain('Second post content');
    });
    
    it('should handle empty posts array', () => {
      const result = addLinkedinPostsToPrompt(basePrompt, []);
      
      expect(result).toBe(basePrompt);
    });
  });
});
