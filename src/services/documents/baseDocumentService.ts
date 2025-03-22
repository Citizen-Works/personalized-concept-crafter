
import { Document, DocumentFilterOptions, DocumentCreateInput } from '@/types';

// Define DocumentUpdateInput type
type DocumentUpdateInput = Partial<DocumentCreateInput> & { id: string };

// Mock implementation for getting documents
export const fetchDocuments = async (
  userId: string,
  filters?: DocumentFilterOptions
): Promise<Document[]> => {
  // Here would be actual API call to fetch documents
  // For development, return mock data
  console.log('Fetching documents for user:', userId, 'with filters:', filters);
  
  try {
    // This should be replaced with an actual API call in production
    const response = await fetch(`/api/documents?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching documents:', error);
    // In development, we can return empty array so the mock data in useDocuments will be used
    return [];
  }
};

// Get a single document by ID
export const getDocumentById = async (
  userId: string,
  documentId: string
): Promise<Document> => {
  // Here would be actual API call to get document
  const response = await fetch(`/api/documents/${documentId}?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch document');
  }
  return await response.json();
};

// Create document
export const createDocument = async (
  userId: string,
  documentData: DocumentCreateInput
): Promise<Document> => {
  // Here would be actual API call to create document
  console.log('Creating document for user:', userId, 'with data:', documentData);
  
  try {
    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...documentData,
        userId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create document');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating document:', error);
    // For development, return a mock successful response
    return {
      id: `mock-${Date.now()}`,
      userId,
      title: documentData.title,
      content: documentData.content || '',
      type: documentData.type,
      purpose: documentData.purpose,
      status: 'active',
      content_type: documentData.content_type,
      createdAt: new Date(),
      processing_status: 'idle',
      has_ideas: false
    };
  }
};

// Update document status
export const updateDocumentStatus = async (
  userId: string,
  documentId: string,
  status: 'active' | 'archived'
): Promise<void> => {
  // Here would be actual API call to update document status
  console.log('Updating document status:', documentId, status);
};

// Update document 
export const updateDocument = async (
  userId: string,
  documentData: DocumentUpdateInput
): Promise<Document> => {
  // Here would be actual API call to update document
  console.log('Updating document:', documentData);
  
  // Mock return for development
  return {
    id: documentData.id,
    userId,
    title: documentData.title || 'Updated Document',
    content: documentData.content || '',
    type: documentData.type || 'other',
    purpose: documentData.purpose || 'business_context',
    status: 'active',
    content_type: documentData.content_type,
    createdAt: new Date(),
    processing_status: 'idle',
    has_ideas: false
  };
};

// Upload a file and return the file URL
export const uploadFile = async (
  userId: string,
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // Here would be actual file upload to storage
  // This is a simplified mock
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        resolve(`https://storage.example.com/${path}`);
      }
    }, 300);
  });
};
