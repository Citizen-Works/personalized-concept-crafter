
// Instead of dynamically importing the libraries, we'll import them directly
import { Buffer } from 'buffer';

export const parseDocumentContent = async (file: File): Promise<string> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  // Handle PDF files
  if (fileType === 'pdf') {
    return parsePdfFile(file);
  }
  
  // Handle Word documents
  if (fileType === 'docx' || fileType === 'doc') {
    return parseWordFile(file);
  }
  
  // Default: handle as text file (txt, md, etc.)
  return parseTextFile(file);
};

// Parse plain text files
const parseTextFile = async (file: File): Promise<string> => {
  const reader = new FileReader();
  
  return new Promise<string>((resolve, reject) => {
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read text file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read text file"));
    };
    
    reader.readAsText(file);
  });
};

// Parse PDF files using pdf-parse
const parsePdfFile = async (file: File): Promise<string> => {
  try {
    // Static import is not feasible for browser-side code with pdf-parse
    // We'll use a more reliable dynamic import pattern
    const arrayBuffer = await file.arrayBuffer();
    
    // Use a try-catch for the dynamic import
    try {
      const pdfParse = (await import('pdf-parse')).default;
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (error) {
      console.error('Error importing pdf-parse:', error);
      throw new Error('PDF parsing library could not be loaded. Try using a text file instead.');
    }
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Parse Word documents using mammoth
const parseWordFile = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Use a more reliable dynamic import pattern with error handling
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.default.extractRawText({ arrayBuffer });
      return result.value || '';
    } catch (importError) {
      console.error('Error importing mammoth library:', importError);
      // Provide a more helpful error message
      throw new Error('Word document parsing library could not be loaded. Try using a text file format instead.');
    }
  } catch (error) {
    console.error('Error parsing Word document:', error);
    throw new Error(`Failed to parse Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
