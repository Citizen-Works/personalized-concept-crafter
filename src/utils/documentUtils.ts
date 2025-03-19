
export const parseDocumentContent = async (file: File): Promise<string> => {
  const reader = new FileReader();
  
  return new Promise<string>((resolve, reject) => {
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    
    reader.readAsText(file);
  });
};
