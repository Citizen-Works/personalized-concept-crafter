
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContentSpecificStyleCard } from '../ContentSpecificStyleCard';

describe('ContentSpecificStyleCard', () => {
  const mockOnChange = vi.fn();
  const mockLinkedinValue = 'Test LinkedIn style';
  const mockNewsletterValue = 'Test newsletter style';
  const mockMarketingValue = 'Test marketing style';

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with the correct title and description', () => {
    render(
      <ContentSpecificStyleCard 
        linkedinValue={mockLinkedinValue} 
        newsletterValue={mockNewsletterValue} 
        marketingValue={mockMarketingValue} 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Platform-Specific Writing Styles')).toBeInTheDocument();
    expect(screen.getByText('Define how your voice adapts across different platforms')).toBeInTheDocument();
  });

  it('displays the provided values in the textareas', () => {
    render(
      <ContentSpecificStyleCard 
        linkedinValue={mockLinkedinValue} 
        newsletterValue={mockNewsletterValue} 
        marketingValue={mockMarketingValue} 
        onChange={mockOnChange} 
      />
    );
    
    const linkedinTextarea = screen.getByPlaceholderText('How you write specifically for LinkedIn');
    const newsletterTextarea = screen.getByPlaceholderText('How you write for email newsletters');
    const marketingTextarea = screen.getByPlaceholderText('How you write for marketing materials');
    
    expect(linkedinTextarea).toHaveValue(mockLinkedinValue);
    expect(newsletterTextarea).toHaveValue(mockNewsletterValue);
    expect(marketingTextarea).toHaveValue(mockMarketingValue);
  });

  it('calls onChange handler when text is entered in LinkedIn textarea', () => {
    render(
      <ContentSpecificStyleCard 
        linkedinValue={mockLinkedinValue} 
        newsletterValue={mockNewsletterValue} 
        marketingValue={mockMarketingValue} 
        onChange={mockOnChange} 
      />
    );
    
    const linkedinTextarea = screen.getByPlaceholderText('How you write specifically for LinkedIn');
    fireEvent.change(linkedinTextarea, { target: { value: 'New LinkedIn content' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange handler when text is entered in Newsletter textarea', () => {
    render(
      <ContentSpecificStyleCard 
        linkedinValue={mockLinkedinValue} 
        newsletterValue={mockNewsletterValue} 
        marketingValue={mockMarketingValue} 
        onChange={mockOnChange} 
      />
    );
    
    const newsletterTextarea = screen.getByPlaceholderText('How you write for email newsletters');
    fireEvent.change(newsletterTextarea, { target: { value: 'New newsletter content' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange handler when text is entered in Marketing textarea', () => {
    render(
      <ContentSpecificStyleCard 
        linkedinValue={mockLinkedinValue} 
        newsletterValue={mockNewsletterValue} 
        marketingValue={mockMarketingValue} 
        onChange={mockOnChange} 
      />
    );
    
    const marketingTextarea = screen.getByPlaceholderText('How you write for marketing materials');
    fireEvent.change(marketingTextarea, { target: { value: 'New marketing content' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('displays section labels correctly', () => {
    render(
      <ContentSpecificStyleCard 
        linkedinValue={mockLinkedinValue} 
        newsletterValue={mockNewsletterValue} 
        marketingValue={mockMarketingValue} 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('LinkedIn Style')).toBeInTheDocument();
    expect(screen.getByText('Newsletter Style')).toBeInTheDocument();
    expect(screen.getByText('Marketing Style')).toBeInTheDocument();
  });
});
