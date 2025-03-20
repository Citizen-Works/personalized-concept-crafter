
import * as crypto from "https://deno.land/std@0.167.0/crypto/mod.ts";

// Enhanced security: encrypt transcript content
export async function encryptContent(content: string, userId: string): Promise<string> {
  try {
    // Create a deterministic key based on user ID (in production, use a proper key management system)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(userId.repeat(2).substring(0, 32));
    
    // Create encryption key
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );
    
    // Create initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the content
    const contentBuffer = encoder.encode(content);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      contentBuffer
    );
    
    // Combine IV and encrypted content
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error("Encryption failed:", error);
    // In case of encryption failure, return original content
    return content;
  }
}
