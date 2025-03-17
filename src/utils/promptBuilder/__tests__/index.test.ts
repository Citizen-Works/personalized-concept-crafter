
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

describe('PromptBuilder Index', () => {
  it('should export buildBasePrompt from basePromptBuilder', () => {
    const spy = vi.spyOn(basePromptBuilderModule, 'buildBasePrompt').mockImplementation(() => 'mocked base prompt');
    
    const mockUser = { id: '1', name: 'Test User' };
    const mockPillars = [{ id: '1', name: 'Test Pillar' }];
    const mockAudiences = [{ id: '1', name: 'Test Audience' }];
    const mockStyle = { tone: 'Professional' };
    
    buildBasePrompt(mockUser, mockPillars, mockAudiences, mockStyle, 'linkedin');
    
    expect(spy).toHaveBeenCalledWith(mockUser, mockPillars, mockAudiences, mockStyle, 'linkedin');
    
    spy.mockRestore();
  });
  
  it('should export functions from contentSpecificSections', () => {
    const addContentIdeaSpy = vi.spyOn(contentSpecificSectionsModule, 'addContentIdeaToPrompt')
      .mockImplementation(() => 'prompt with content idea');
    const addTaskSpy = vi.spyOn(contentSpecificSectionsModule, 'addTaskToPrompt')
      .mockImplementation(() => 'prompt with task');
    const addCustomInstructionsSpy = vi.spyOn(contentSpecificSectionsModule, 'addCustomInstructionsToPrompt')
      .mockImplementation(() => 'prompt with custom instructions');
    const addLinkedinPostsSpy = vi.spyOn(contentSpecificSectionsModule, 'addLinkedinPostsToPrompt')
      .mockImplementation(() => 'prompt with linkedin posts');
    
    const mockPrompt = 'test prompt';
    const mockIdea = { id: '1', title: 'Test Idea', status: 'active' };
    const mockPosts = [{ id: '1', content: 'Test Post' }];
    
    addContentIdeaToPrompt(mockPrompt, mockIdea as any);
    addTaskToPrompt(mockPrompt, 'linkedin');
    addCustomInstructionsToPrompt(mockPrompt, 'custom');
    addLinkedinPostsToPrompt(mockPrompt, mockPosts as any);
    
    expect(addContentIdeaSpy).toHaveBeenCalledWith(mockPrompt, mockIdea);
    expect(addTaskSpy).toHaveBeenCalledWith(mockPrompt, 'linkedin');
    expect(addCustomInstructionsSpy).toHaveBeenCalledWith(mockPrompt, 'custom');
    expect(addLinkedinPostsSpy).toHaveBeenCalledWith(mockPrompt, mockPosts);
    
    addContentIdeaSpy.mockRestore();
    addTaskSpy.mockRestore();
    addCustomInstructionsSpy.mockRestore();
    addLinkedinPostsSpy.mockRestore();
  });
});
