import { transcribeAudio as transcribeAudioUtil } from '@/utils/documentProcessing';

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

// Track if there's an active transcription to prevent duplicate toasts
let isActiveTranscription = false;

/**
 * Transcribes audio data to text using the API
 * @param audioBlob - The recorded audio blob
 * @param onProgress - Callback for progress updates during transcription
 * @returns Promise with the transcribed text
 */
export const transcribeAudio = async (
  audioBlob: Blob, 
  onProgress: (progress: number, stage: string) => void
): Promise<string> => {
  if (isActiveTranscription) {
    console.warn("Another transcription is already in progress");
    return "";
  }
  
  isActiveTranscription = true;
  
  try {
    return await transcribeAudioUtil(audioBlob, onProgress);
  } finally {
    isActiveTranscription = false;
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
      try {
        const base64data = reader.result as string;
        if (!base64data) {
          reject(new Error('Failed to read audio data - empty result'));
          return;
        }
        
        // Extract only the base64 part after the comma
        const base64 = base64data.split(',')[1];
        if (!base64) {
          reject(new Error('Failed to extract base64 data'));
          return;
        }
        
        resolve(base64);
      } catch (e) {
        reject(new Error('Error processing audio data: ' + e.message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read audio data: ' + reader.error?.message));
    };
    
    reader.readAsDataURL(blob);
  });
};
