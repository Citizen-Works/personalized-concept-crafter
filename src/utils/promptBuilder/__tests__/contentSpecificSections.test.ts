
import { describe, it, expect } from 'vitest';
import { ContentType } from '@/types';
import { getContentSpecificSections } from '../contentSpecificSections';

describe('getContentSpecificSections', () => {
  it('returns LinkedIn specific guidelines for linkedin type', () => {
    const sections = getContentSpecificSections('linkedin');
    
    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe('LinkedIn Specific Guidelines');
    expect(sections[0].content).toContain('Keep posts professional but conversational');
  });

  it('returns newsletter specific guidelines for newsletter type', () => {
    const sections = getContentSpecificSections('newsletter');
    
    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe('Newsletter Specific Guidelines');
    expect(sections[0].content).toContain('Include a clear, engaging subject line');
  });

  it('returns marketing specific guidelines for marketing type', () => {
    const sections = getContentSpecificSections('marketing');
    
    expect(sections).toHaveLength(1);
    expect(sections[0].title).toBe('Marketing Content Specific Guidelines');
    expect(sections[0].content).toContain('Focus on benefits rather than features');
  });

  it('returns empty array for unrecognized content type', () => {
    // @ts-ignore - Testing invalid input
    const sections = getContentSpecificSections('invalid-type');
    
    expect(sections).toHaveLength(0);
  });
});
