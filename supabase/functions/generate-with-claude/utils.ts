
// Utility functions

/**
 * Sanitizes input text to prevent JSON parsing issues
 */
export function sanitizeInput(text: string): string {
  if (!text) return "";
  
  // Replace HTML-like content and problematic characters
  return text
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[^\x20-\x7E\x0A\x0D\x09]/g, "") // Keep only printable ASCII, newlines, returns, and tabs
    .trim();
}

/**
 * Creates a logging message based on task type and content
 */
export function createLogMessage(task: string | undefined, contentType: string | undefined, idea: any): string {
  if (task === 'writing_style_preview') {
    return `Generating ${contentType || 'writing style'} preview with Claude`;
  } else if (task === 'transcript_analysis') {
    return `Analyzing transcript for content ideas: ${idea?.title || 'Untitled'}`;
  } else if (contentType && idea) {
    return `Generating ${contentType} content with Claude for idea: ${idea?.title || 'Untitled'}`;
  }
  
  return 'Generating content with Claude';
}

/**
 * Formats and validates JSON content
 */
export function formatJsonContent(content: string): string {
  // Remove any markdown code block formatting if present
  content = content.replace(/```json\s+/g, '').replace(/```\s*$/g, '');
  
  // Parse and stringify to ensure it's valid JSON
  const parsedJson = JSON.parse(content);
  
  // Re-stringify to ensure clean JSON formatting
  return JSON.stringify(parsedJson);
}
