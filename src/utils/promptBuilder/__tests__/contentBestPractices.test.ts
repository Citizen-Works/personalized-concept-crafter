
import { describe, it, expect } from 'vitest';
import { 
  getContentBestPractices,
  linkedinBestPractices,
  newsletterBestPractices,
  blogBestPractices,
  generalBestPractices
} from '../contentBestPractices';
import { ContentType } from '@/types';

describe('Content Best Practices', () => {
  describe('getContentBestPractices', () => {
    it('should return linkedin best practices for linkedin content type', () => {
      const result = getContentBestPractices('linkedin');
      
      expect(result).toContain('LINKEDIN CONTENT BEST PRACTICES');
      expect(result).toContain('FORMAT & STRUCTURE');
      expect(result).toContain('CONTENT APPROACH');
      expect(result).toContain('ENGAGEMENT TACTICS');
    });
    
    it('should return newsletter best practices for newsletter content type', () => {
      const result = getContentBestPractices('newsletter');
      
      expect(result).toContain('NEWSLETTER BEST PRACTICES');
    });
    
    it('should return blog best practices for blog content type', () => {
      const result = getContentBestPractices('blog');
      
      expect(result).toContain('BLOG CONTENT BEST PRACTICES');
    });
    
    it('should return general best practices for unknown content type', () => {
      const result = getContentBestPractices('unknown' as ContentType);
      
      expect(result).toContain('GENERAL CONTENT BEST PRACTICES');
    });
  });
  
  describe('Individual Best Practices', () => {
    it('should have defined linkedin best practices', () => {
      expect(linkedinBestPractices).toContain('LINKEDIN CONTENT BEST PRACTICES');
    });
    
    it('should have defined newsletter best practices', () => {
      expect(newsletterBestPractices).toContain('NEWSLETTER BEST PRACTICES');
    });
    
    it('should have defined blog best practices', () => {
      expect(blogBestPractices).toContain('BLOG CONTENT BEST PRACTICES');
    });
    
    it('should have defined general best practices', () => {
      expect(generalBestPractices).toContain('GENERAL CONTENT BEST PRACTICES');
    });
  });
});
