
import { describe, it, expect } from 'vitest';
import { PromptSection, PromptStructure } from '../types';

describe('PromptBuilder Types', () => {
  it('should define PromptSection type', () => {
    const section: PromptSection = {
      title: 'Test Section',
      content: 'Test Content'
    };
    
    expect(section.title).toBe('Test Section');
    expect(section.content).toBe('Test Content');
  });
  
  it('should define PromptStructure type', () => {
    const structure: PromptStructure = {
      sections: [
        {
          title: 'Section 1',
          content: 'Content 1'
        },
        {
          title: 'Section 2',
          content: 'Content 2'
        }
      ]
    };
    
    expect(structure.sections.length).toBe(2);
    expect(structure.sections[0].title).toBe('Section 1');
    expect(structure.sections[1].content).toBe('Content 2');
  });
});
