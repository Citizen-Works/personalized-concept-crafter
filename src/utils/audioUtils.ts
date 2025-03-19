
/**
 * Utility functions for audio recording and processing
 */

/**
 * Determines the best supported MIME type for audio recording in the current browser
 * @returns The supported MIME type string or empty string for browser default
 */
export function getSupportedMimeType(): string {
  const types = [
    'audio/webm', 
    'audio/webm;codecs=opus',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav',
    ''  // Empty string means browser default
  ];
  
  for (const type of types) {
    if (type === '' || MediaRecorder.isTypeSupported(type)) {
      console.log(`Using supported audio MIME type: ${type || 'browser default'}`);
      return type;
    }
  }
  
  // Fallback to default if none supported (shouldn't happen)
  console.log("No explicitly supported types found, using browser default");
  return '';
}

/**
 * Formats seconds into a MM:SS timestamp string
 * @param seconds - The number of seconds to format
 * @returns Formatted time string (MM:SS)
 */
export function formatRecordingTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Creates high-quality audio constraints for voice recording
 * @returns MediaTrackConstraints object for getUserMedia
 */
export function getAudioConstraints(): MediaTrackConstraints {
  return {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  };
}
