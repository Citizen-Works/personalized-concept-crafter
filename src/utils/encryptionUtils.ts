
/**
 * Utilities for encrypting and decrypting sensitive content
 */

// Use a standard encryption algorithm with browser native crypto
export const encryptContent = async (content: string, userId: string): Promise<string> => {
  try {
    // Create a deterministic key based on the user ID (simplified version)
    // In production, you would use a more secure key derivation method
    const encoder = new TextEncoder();
    const keyData = encoder.encode(userId.repeat(2).substring(0, 32));
    
    // Import the key for AES encryption
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Generate initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the content
    const contentEncoded = encoder.encode(content);
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      contentEncoded
    );
    
    // Combine IV and encrypted content for storage
    const encryptedArray = new Uint8Array(iv.length + encrypted.byteLength);
    encryptedArray.set(iv, 0);
    encryptedArray.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...encryptedArray));
  } catch (error) {
    console.error('Encryption failed:', error);
    // Fallback to unencrypted content in case of error
    return content;
  }
};

export const decryptContent = async (encryptedContent: string, userId: string): Promise<string> => {
  try {
    // Check if content is encrypted (basic validation)
    // This allows handling of legacy unencrypted content
    if (!encryptedContent || encryptedContent.length < 24 || !isBase64(encryptedContent)) {
      return encryptedContent;
    }
    
    // Create the same deterministic key based on the user ID
    const encoder = new TextEncoder();
    const keyData = encoder.encode(userId.repeat(2).substring(0, 32));
    
    // Import the key for AES decryption
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Convert from base64
    const encryptedArray = new Uint8Array(
      atob(encryptedContent).split('').map(c => c.charCodeAt(0))
    );
    
    // Extract IV and encrypted data
    const iv = encryptedArray.slice(0, 12);
    const encrypted = encryptedArray.slice(12);
    
    // Decrypt the content
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    // Convert back to string
    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption failed:', error);
    // Return the original content if decryption fails
    // This handles legacy unencrypted content
    return encryptedContent;
  }
};

// Helper function to check if a string is base64 encoded
const isBase64 = (str: string): boolean => {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
};
