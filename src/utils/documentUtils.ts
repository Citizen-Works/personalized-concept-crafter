
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
    const pdfParse = (await import('pdf-parse')).default;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Parse Word documents using mammoth
const parseWordFile = async (file: File): Promise<string> => {
  try {
    const mammoth = (await import('mammoth')).default;
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  } catch (error) {
    console.error('Error parsing Word document:', error);
    throw new Error(`Failed to parse Word document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
