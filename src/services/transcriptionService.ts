
/**
 * Service responsible for handling audio transcription API calls
 */

// Centralized type definitions for transcription process
export type TranscriptionStage = 'idle' | 'preparing' | 'uploading' | 'transcribing' | 'complete';

export interface TranscriptionProgressCallback {
  (progress: number, stage: TranscriptionStage): void;
}

export interface TranscriptionResult {
  text: string;
}

/**
 * Transcribes audio data to text using the API
 * @param audioBlob - The recorded audio blob
 * @param onProgress - Callback for progress updates during transcription
 * @returns Promise with the transcribed text
 */
export const transcribeAudio = async (
  audioBlob: Blob, 
  onProgress: TranscriptionProgressCallback
): Promise<string> => {
  try {
    // Update stage to preparing
    onProgress(10, 'preparing');
    
    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob, (progress) => {
      // Calculate progress from 10% to 40%
      const calculatedProgress = 10 + (progress * 30);
      onProgress(Math.round(calculatedProgress), 'preparing');
    });
    
    // Update stage to uploading
    onProgress(50, 'uploading');
    
    // Make API call to transcribe audio
    const response = await fetch(`${window.location.origin}/api/functions/transcribe-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ audio: base64Audio })
    });
    
    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.statusText}`);
    }
    
    // Update stage to transcribing
    onProgress(70, 'transcribing');
    
    const result = await response.json();
    
    // Update stage to complete
    onProgress(100, 'complete');
    
    return result.text;
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
};

/**
 * Converts a Blob to base64 string with progress reporting
 * @param blob - The binary blob to convert
 * @param onProgress - Progress callback
 * @returns Promise with the base64 string
 */
const blobToBase64 = (blob: Blob, onProgress: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = event.loaded / event.total;
        onProgress(progress);
      }
    };
    
    reader.onloadend = () => {
      const base64data = reader.result as string;
      // Extract only the base64 part after the comma
      const base64 = base64data.split(',')[1];
      resolve(base64);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read audio data'));
    };
    
    reader.readAsDataURL(blob);
  });
};
