
import { render, screen } from '@testing-library/react';
import { WritingStylePreview } from '../WritingStylePreview';
import { WritingStyleProfile } from '@/types/writingStyle';

describe('WritingStylePreview', () => {
  const mockProfile: Partial<WritingStyleProfile> = {
    voiceAnalysis: 'Professional but friendly voice',
    generalStyleGuide: 'Short paragraphs with clear language',
    vocabularyPatterns: 'Tech terms, industry jargon used sparingly',
    avoidPatterns: 'Overly complex sentences, passive voice',
    linkedinStyleGuide: 'Professional, engagement-focused content',
    newsletterStyleGuide: 'Conversational and informative',
    marketingStyleGuide: 'Benefit-focused with clear CTAs',
  };

  it('renders correctly with all profile data', () => {
    render(<WritingStylePreview writingStyle={mockProfile} />);
    
    expect(screen.getByText('Writing Style Preview')).toBeInTheDocument();
    expect(screen.getByText(/Professional but friendly voice/)).toBeInTheDocument();
    expect(screen.getByText(/Short paragraphs with clear language/)).toBeInTheDocument();
    expect(screen.getByText(/Tech terms, industry jargon used sparingly/)).toBeInTheDocument();
    expect(screen.getByText(/Overly complex sentences, passive voice/)).toBeInTheDocument();
    expect(screen.getByText(/Professional, engagement-focused content/)).toBeInTheDocument();
    expect(screen.getByText(/Conversational and informative/)).toBeInTheDocument();
    expect(screen.getByText(/Benefit-focused with clear CTAs/)).toBeInTheDocument();
  });

  it('renders correctly with snake_case data', () => {
    const snakeCaseProfile = {
      voice_analysis: 'Professional but friendly voice',
      general_style_guide: 'Short paragraphs with clear language',
      vocabulary_patterns: 'Tech terms, industry jargon used sparingly',
      avoid_patterns: 'Overly complex sentences, passive voice',
      linkedin_style_guide: 'Professional, engagement-focused content',
      newsletter_style_guide: 'Conversational and informative',
      marketing_style_guide: 'Benefit-focused with clear CTAs',
    };
    
    render(<WritingStylePreview writingStyle={snakeCaseProfile} />);
    
    expect(screen.getByText(/Professional but friendly voice/)).toBeInTheDocument();
    expect(screen.getByText(/Short paragraphs with clear language/)).toBeInTheDocument();
    expect(screen.getByText(/Tech terms, industry jargon used sparingly/)).toBeInTheDocument();
    expect(screen.getByText(/Overly complex sentences, passive voice/)).toBeInTheDocument();
    expect(screen.getByText(/Professional, engagement-focused content/)).toBeInTheDocument();
    expect(screen.getByText(/Conversational and informative/)).toBeInTheDocument();
    expect(screen.getByText(/Benefit-focused with clear CTAs/)).toBeInTheDocument();
  });

  it('handles empty values gracefully', () => {
    const emptyProfile: Partial<WritingStyleProfile> = {};
    
    render(<WritingStylePreview writingStyle={emptyProfile} />);
    
    expect(screen.getByText('Voice Analysis:')).toBeInTheDocument();
    expect(screen.getByText('General Style Guide:')).toBeInTheDocument();
    expect(screen.getByText('Vocabulary Patterns:')).toBeInTheDocument();
    expect(screen.getByText('Avoid Patterns:')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn Style Guide:')).toBeInTheDocument();
    expect(screen.getByText('Newsletter Style Guide:')).toBeInTheDocument();
    expect(screen.getByText('Marketing Style Guide:')).toBeInTheDocument();
  });

  it('prefers camelCase properties over snake_case when both are present', () => {
    const mixedProfile = {
      voiceAnalysis: 'Camel case voice',
      voice_analysis: 'Snake case voice',
      generalStyleGuide: 'Camel case style',
      general_style_guide: 'Snake case style',
    };
    
    render(<WritingStylePreview writingStyle={mixedProfile} />);
    
    expect(screen.getByText(/Camel case voice/)).toBeInTheDocument();
    expect(screen.getByText(/Camel case style/)).toBeInTheDocument();
    expect(screen.queryByText(/Snake case voice/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Snake case style/)).not.toBeInTheDocument();
  });
});
