
import { describe, it, expect } from 'vitest';
import { buildBasePrompt } from '../basePromptBuilder';
import { ContentType } from '@/types';

describe('buildBasePrompt', () => {
  it('should build a base prompt with user profile data', () => {
    // Mock data
    const mockUser = {
      id: '123',
      name: 'John Doe',
      title: 'Product Manager',
      company: 'TechCorp',
      industry: 'SaaS'
    };
    
    const mockContentPillars = [
      { id: '1', name: 'Leadership', description: 'Thoughts on leadership' },
      { id: '2', name: 'Product Management', description: 'Product development insights' }
    ];
    
    const mockTargetAudiences = [
      { id: '1', name: 'Tech Leaders', description: 'CTOs and Tech Directors' },
      { id: '2', name: 'Product Managers', description: 'PMs in tech companies' }
    ];
    
    const mockStyleProfile = {
      tone: 'Professional',
      voice: 'Authoritative but friendly',
      examples: ['Example 1', 'Example 2']
    };
    
    const contentType: ContentType = 'linkedin';
    
    // Execute
    const result = buildBasePrompt(mockUser, mockContentPillars, mockTargetAudiences, mockStyleProfile, contentType);
    
    // Assert
    expect(result).toContain('USER PROFILE');
    expect(result).toContain('John Doe');
    expect(result).toContain('Product Manager');
    expect(result).toContain('TechCorp');
    
    expect(result).toContain('CONTENT PILLARS');
    expect(result).toContain('Leadership');
    expect(result).toContain('Product Management');
    
    expect(result).toContain('TARGET AUDIENCE');
    expect(result).toContain('Tech Leaders');
    expect(result).toContain('Product Managers');
    
    expect(result).toContain('WRITING STYLE');
    expect(result).toContain('Professional');
    expect(result).toContain('Authoritative but friendly');
    
    expect(result).toContain('BEST PRACTICES');
    expect(result).toContain('LINKEDIN CONTENT BEST PRACTICES');
  });
});
