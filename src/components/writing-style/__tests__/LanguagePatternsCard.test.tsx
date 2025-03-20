
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguagePatternsCard } from '../LanguagePatternsCard';

describe('LanguagePatternsCard', () => {
  const mockOnChange = vi.fn();
  const mockVocabularyValue = 'Test vocabulary patterns';
  const mockAvoidValue = 'Test avoid patterns';

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with the correct title and description', () => {
    render(
      <LanguagePatternsCard 
        vocabularyValue={mockVocabularyValue} 
        avoidValue={mockAvoidValue} 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Language Patterns')).toBeInTheDocument();
    expect(screen.getByText('Define specific vocabulary and patterns to use or avoid')).toBeInTheDocument();
  });

  it('displays the provided values in the textareas', () => {
    render(
      <LanguagePatternsCard 
        vocabularyValue={mockVocabularyValue} 
        avoidValue={mockAvoidValue} 
        onChange={mockOnChange} 
      />
    );
    
    const vocabularyTextarea = screen.getByPlaceholderText('Words, phrases or expressions you frequently use');
    const avoidTextarea = screen.getByPlaceholderText('Words, phrases or structures you never use');
    
    expect(vocabularyTextarea).toHaveValue(mockVocabularyValue);
    expect(avoidTextarea).toHaveValue(mockAvoidValue);
  });

  it('calls onChange handler when text is entered in vocabulary textarea', () => {
    render(
      <LanguagePatternsCard 
        vocabularyValue={mockVocabularyValue} 
        avoidValue={mockAvoidValue} 
        onChange={mockOnChange} 
      />
    );
    
    const vocabularyTextarea = screen.getByPlaceholderText('Words, phrases or expressions you frequently use');
    fireEvent.change(vocabularyTextarea, { target: { value: 'New vocabulary content' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('calls onChange handler when text is entered in avoid textarea', () => {
    render(
      <LanguagePatternsCard 
        vocabularyValue={mockVocabularyValue} 
        avoidValue={mockAvoidValue} 
        onChange={mockOnChange} 
      />
    );
    
    const avoidTextarea = screen.getByPlaceholderText('Words, phrases or structures you never use');
    fireEvent.change(avoidTextarea, { target: { value: 'New avoid content' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('displays section labels correctly', () => {
    render(
      <LanguagePatternsCard 
        vocabularyValue={mockVocabularyValue} 
        avoidValue={mockAvoidValue} 
        onChange={mockOnChange} 
      />
    );
    
    expect(screen.getByText('Vocabulary & Phrases to Use')).toBeInTheDocument();
    expect(screen.getByText('Patterns to Avoid')).toBeInTheDocument();
  });
});
