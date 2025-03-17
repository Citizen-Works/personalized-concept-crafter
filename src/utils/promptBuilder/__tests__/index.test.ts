
import { describe, it, expect, vi } from 'vitest';
import { 
  buildBasePrompt, 
  addContentIdeaToPrompt, 
  addTaskToPrompt, 
  addCustomInstructionsToPrompt, 
  addLinkedinPostsToPrompt 
} from '../index';
import * as basePromptBuilderModule from '../basePromptBuilder';
import * as contentSpecificSectionsModule from '../contentSpecificSections';
import { ContentType } from '@/types';

describe('PromptBuilder Index', () => {
  it('should export buildBasePrompt function', () => {
    const spy = vi.spyOn(basePromptBuilderModule, 'buildBasePromptStructure').mockImplementation(() => ({ sections: [] }));
    
    const mockUser = { 
      id: '1', 
      name: 'Test User',
      email: 'test@example.com',
      businessName: 'Test Business',
      businessDescription: 'A test business',
      linkedinUrl: 'https://linkedin.com/test',
      jobTitle: 'Test Title',
      createdAt: new Date()
    };
    const mockPillars = [{ id: '1', userId: 'user1', name: 'Test Pillar', description: 'Test description', createdAt: new Date() }];
    const mockAudiences = [{ 
      id: '1', 
      userId: 'user1', 
      name: 'Test Audience', 
      description: 'Test description',
      painPoints: ['Test pain'],
      goals: ['Test goal'],
      createdAt: new Date()
    }];
    const mockStyle = { 
      id: 'style1',
      userId: 'user1',
      voiceAnalysis: 'Test voice',
      generalStyleGuide: 'Test style',
      exampleQuotes: ['Test quote'],
      vocabularyPatterns: 'Test patterns',
      avoidPatterns: 'Test avoid',
      linkedinStyleGuide: 'Test LinkedIn',
      linkedinExamples: ['Test LinkedIn example'],
      newsletterStyleGuide: 'Test newsletter',
      newsletterExamples: ['Test newsletter example'],
      marketingStyleGuide: 'Test marketing',
      marketingExamples: ['Test marketing example'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    buildBasePrompt(mockUser, mockPillars, mockAudiences, mockStyle, 'linkedin' as ContentType);
    
    expect(spy).toHaveBeenCalledWith(mockUser, mockPillars, mockAudiences, mockStyle, 'linkedin');
    
    spy.mockRestore();
  });
  
  it('should export functions from contentSpecificSections', () => {
    const mockContentIdeaSpy = vi.spyOn(contentSpecificSectionsModule, 'buildContentIdeaSection')
      .mockImplementation(() => ({ title: '', content: '' }));
    const mockTaskSpy = vi.spyOn(contentSpecificSectionsModule, 'buildTaskSection')
      .mockImplementation(() => ({ title: '', content: '' }));
    const mockCustomInstructionsSpy = vi.spyOn(contentSpecificSectionsModule, 'buildCustomInstructionsSection')
      .mockImplementation(() => ({ title: '', content: '' }));
    const mockLinkedinPostsSpy = vi.spyOn(contentSpecificSectionsModule, 'buildLinkedinPostsSection')
      .mockImplementation(() => ({ title: '', content: '' }));
    
    const mockPrompt = 'test prompt';
    const mockIdea = { 
      id: '1', 
      userId: 'user1',
      title: 'Test Idea', 
      description: '',
      notes: '',
      source: 'manual',
      meetingTranscriptExcerpt: null,
      sourceUrl: null,
      status: 'unreviewed',
      contentType: 'linkedin',
      createdAt: new Date()
    };
    const mockPosts = [{ 
      id: '1', 
      userId: 'user1',
      content: 'Test Post',
      publishedAt: new Date(),
      url: 'https://linkedin.com/post/1',
      createdAt: new Date()
    }];
    
    addContentIdeaToPrompt(mockPrompt, mockIdea);
    addTaskToPrompt(mockPrompt, 'linkedin');
    addCustomInstructionsToPrompt(mockPrompt, 'custom');
    addLinkedinPostsToPrompt(mockPrompt, mockPosts);
    
    expect(mockContentIdeaSpy).toHaveBeenCalled();
    expect(mockTaskSpy).toHaveBeenCalled();
    expect(mockCustomInstructionsSpy).toHaveBeenCalled();
    expect(mockLinkedinPostsSpy).toHaveBeenCalled();
    
    mockContentIdeaSpy.mockRestore();
    mockTaskSpy.mockRestore();
    mockCustomInstructionsSpy.mockRestore();
    mockLinkedinPostsSpy.mockRestore();
  });
});
