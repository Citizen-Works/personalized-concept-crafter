
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
    // Validate audio data
    if (!audioBlob || audioBlob.size === 0) {
      throw new Error("No audio detected. Please check your microphone and try again.");
    }
    
    // Log audio metadata for debugging
    console.log("Audio metadata:", {
      type: audioBlob.type,
      size: audioBlob.size,
      lastModified: new Date().toISOString()
    });
    
    // Update stage to preparing
    onProgress(10, 'preparing');
    
    // Convert blob to base64
    const base64Audio = await blobToBase64(audioBlob, (progress) => {
      // Calculate progress from 10% to 40%
      const calculatedProgress = 10 + (progress * 30);
      onProgress(Math.round(calculatedProgress), 'preparing');
    });
    
    // Validate base64 data
    if (!base64Audio || base64Audio.length === 0) {
      throw new Error("Failed to encode audio. Please try again.");
    }
    
    // Update stage to uploading
    onProgress(50, 'uploading');
    
    // Make API call to transcribe audio
    const response = await fetch(`${window.location.origin}/api/functions/transcribe-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ 
        audio: base64Audio,
        fileType: audioBlob.type || 'audio/webm' 
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("Transcription API error:", errorData);
      throw new Error(`Transcription failed: ${response.statusText || 'Error communicating with transcription service'}`);
    }
    
    // Update stage to transcribing
    onProgress(70, 'transcribing');
    
    const result = await response.json();
    
    // Check if result contains text
    if (!result.text || result.text.trim() === '') {
      throw new Error("No speech detected in the audio. Please speak clearly and try again.");
    }
    
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
