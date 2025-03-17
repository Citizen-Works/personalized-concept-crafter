
import { describe, it, expect } from 'vitest';
import { 
  getBestPracticesSection
} from '../contentBestPractices';
import { ContentType } from '@/types';

describe('Content Best Practices', () => {
  describe('getBestPracticesSection', () => {
    it('should return linkedin best practices for linkedin content type', () => {
      const result = getBestPracticesSection('linkedin');
      
      expect(result.title).toBe('# BEST PRACTICES');
      expect(result.content).toContain('LINKEDIN CONTENT BEST PRACTICES');
      expect(result.content).toContain('FORMAT & STRUCTURE');
      expect(result.content).toContain('CONTENT APPROACH');
      expect(result.content).toContain('ENGAGEMENT TACTICS');
    });
    
    it('should return newsletter best practices for newsletter content type', () => {
      const result = getBestPracticesSection('newsletter');
      
      expect(result.title).toBe('# BEST PRACTICES');
      expect(result.content).toContain('headline');
    });
    
    it('should return marketing best practices for marketing content type', () => {
      const result = getBestPracticesSection('marketing');
      
      expect(result.title).toBe('# BEST PRACTICES');
      expect(result.content).toContain('benefit-focused');
    });
    
    it('should return empty string for unknown content type', () => {
      const result = getBestPracticesSection('unknown' as ContentType);
      
      expect(result.title).toBe('# BEST PRACTICES');
      expect(result.content).toBe('');
    });
  });
});
