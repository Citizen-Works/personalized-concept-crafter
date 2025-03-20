
import { useState, useEffect } from 'react';

/**
 * Hook for managing persistent processing state in localStorage
 */
export const useProcessingStorage = () => {
  // Initialize state from localStorage if available
  const [processingDocuments, setProcessingDocuments] = useState<Set<string>>(new Set<string>());
  
  // Load processing documents from localStorage on initial load
  useEffect(() => {
    const storedProcessingDocs = localStorage.getItem('processingDocuments');
    if (storedProcessingDocs) {
      try {
        const parsedDocs = new Set<string>(JSON.parse(storedProcessingDocs));
        if (parsedDocs.size > 0) {
          setProcessingDocuments(parsedDocs);
        }
      } catch (e) {
        console.error('Error parsing processing documents from localStorage:', e);
      }
    }
  }, []);

  // Update localStorage when processing documents change
  useEffect(() => {
    if (processingDocuments.size > 0) {
      localStorage.setItem('processingDocuments', JSON.stringify([...processingDocuments]));
    } else {
      localStorage.removeItem('processingDocuments');
    }
  }, [processingDocuments]);
  
  // Function to safely update the processing documents
  const updateProcessingDocuments = (updater: (prev: Set<string>) => Set<string>) => {
    setProcessingDocuments(prevSet => {
      const updatedSet = updater(prevSet);
      return updatedSet;
    });
    
    // Return the updated value for immediate use
    return updater(processingDocuments);
  };

  return {
    processingDocuments,
    updateProcessingDocuments
  };
};
