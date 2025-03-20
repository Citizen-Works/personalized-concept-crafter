
import { render, screen } from '@testing-library/react';
import { PlatformStyleTab } from '../PlatformStyleTab';

describe('PlatformStyleTab', () => {
  const mockHandleInputChange = vi.fn();
  const mockProps = {
    linkedinStyleGuide: 'Test LinkedIn style',
    newsletterStyleGuide: 'Test newsletter style',
    marketingStyleGuide: 'Test marketing style',
    handleInputChange: mockHandleInputChange,
  };

  beforeEach(() => {
    mockHandleInputChange.mockClear();
  });

  it('renders all necessary components', () => {
    render(<PlatformStyleTab {...mockProps} />);
    
    // Check that component structure is correct with expected sections
    expect(screen.getByText('Platform-Specific Writing Styles')).toBeInTheDocument();
    expect(screen.getByText('Style Tips')).toBeInTheDocument();
  });

  it('passes correct props to ContentSpecificStyleCard component', () => {
    render(<PlatformStyleTab {...mockProps} />);
    
    // Check that values are passed to textareas
    const linkedinTextarea = screen.getByPlaceholderText('How you write specifically for LinkedIn');
    const newsletterTextarea = screen.getByPlaceholderText('How you write for email newsletters');
    const marketingTextarea = screen.getByPlaceholderText('How you write for marketing materials');
    
    expect(linkedinTextarea).toHaveValue('Test LinkedIn style');
    expect(newsletterTextarea).toHaveValue('Test newsletter style');
    expect(marketingTextarea).toHaveValue('Test marketing style');
  });

  it('renders style tips for each platform', () => {
    render(<PlatformStyleTab {...mockProps} />);
    
    // Check that all tips sections are present
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Newsletter')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    
    // Check for some specific tips
    expect(screen.getByText('Keep paragraphs short and skimmable')).toBeInTheDocument();
    expect(screen.getByText('Personal and conversational tone works best')).toBeInTheDocument();
    expect(screen.getByText('Focus on benefits rather than features')).toBeInTheDocument();
  });
});
