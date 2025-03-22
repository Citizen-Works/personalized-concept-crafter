
import { Document, DocumentFilterOptions, DocumentCreateInput } from '@/types';

// Define DocumentUpdateInput type
type DocumentUpdateInput = Partial<DocumentCreateInput> & { id: string };

// Store mock documents in memory for development
let mockDocuments: Document[] = [];

// Mock implementation for getting documents
export const fetchDocuments = async (
  userId: string,
  filters?: DocumentFilterOptions
): Promise<Document[]> => {
  console.log('Fetching documents for user:', userId, 'with filters:', filters);
  
  try {
    // This should be replaced with an actual API call in production
    const response = await fetch(`/api/documents?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    // In development, return our in-memory mock data
    return mockDocuments.length > 0 ? mockDocuments : getInitialMockDocuments(userId);
  }
};

// Helper function to generate initial mock documents for development
const getInitialMockDocuments = (userId: string): Document[] => {
  // Only generate initial mock data if we don't have any yet
  if (mockDocuments.length === 0) {
    mockDocuments = [
      {
        id: '1',
        userId: userId,
        title: 'Sample Blog Post',
        content: 'This is a sample blog post content for development purposes.',
        type: 'blog',
        purpose: 'writing_sample',
        status: 'active',
        content_type: 'general',
        createdAt: new Date(),
        processing_status: 'idle',
        has_ideas: false
      },
      {
        id: '2',
        userId: userId,
        title: 'Meeting Transcript',
        content: 'This is a sample transcript from a team meeting.',
        type: 'transcript',
        purpose: 'business_context',
        status: 'active',
        content_type: null,
        createdAt: new Date(),
        processing_status: 'idle',
        has_ideas: false
      },
      {
        id: '3',
        userId: userId,
        title: 'Product Whitepaper',
        content: 'Detailed whitepaper about our new product features.',
        type: 'whitepaper',
        purpose: 'business_context',
        status: 'active',
        content_type: null,
        createdAt: new Date(),
        processing_status: 'idle',
        has_ideas: false
      }
    ];
  }
  return [...mockDocuments];
};

// Get a single document by ID
export const getDocumentById = async (
  userId: string,
  documentId: string
): Promise<Document> => {
  // Here would be actual API call to get document
  try {
    const response = await fetch(`/api/documents/${documentId}?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching document:', error);
    // Look for the document in our mock data
    const doc = mockDocuments.find(d => d.id === documentId);
    if (!doc) {
      throw new Error('Document not found');
    }
    return doc;
  }
};

// Create document
export const createDocument = async (
  userId: string,
  documentData: DocumentCreateInput
): Promise<Document> => {
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
    // For development, create a mock document and add it to our local array
    const newDoc: Document = {
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
    
    // Add the new document to our mock array
    mockDocuments.push(newDoc);
    
    return newDoc;
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
  
  try {
    const response = await fetch(`/api/documents/${documentId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        status,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update document status');
    }
  } catch (error) {
    console.error('Error updating document status:', error);
    // Update the status in our mock data
    const docIndex = mockDocuments.findIndex(d => d.id === documentId);
    if (docIndex !== -1) {
      mockDocuments[docIndex].status = status;
    }
  }
};

// Update document 
export const updateDocument = async (
  userId: string,
  documentData: DocumentUpdateInput
): Promise<Document> => {
  // Here would be actual API call to update document
  console.log('Updating document:', documentData);
  
  try {
    const response = await fetch(`/api/documents/${documentData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...documentData,
        userId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update document');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating document:', error);
    // Update the document in our mock data
    const docIndex = mockDocuments.findIndex(d => d.id === documentData.id);
    if (docIndex !== -1) {
      mockDocuments[docIndex] = {
        ...mockDocuments[docIndex],
        ...documentData,
      };
      return mockDocuments[docIndex];
    }
    
    // Mock return for development if not found
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
  }
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
