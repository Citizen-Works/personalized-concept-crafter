
/**
 * Utility functions for audio recording and processing
 */

/**
 * Determines the best supported MIME type for audio recording in the current browser
 * @returns The supported MIME type string or empty string for browser default
 */
export function getSupportedMimeType(): string {
  // Try these types in order of preference
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav',
    ''  // Empty string means browser default
  ];
  
  // Loop through types and find first supported one
  for (const type of types) {
    // Skip empty string initially
    if (type === '') continue;
    
    if (MediaRecorder.isTypeSupported(type)) {
      console.log(`Using supported audio MIME type: ${type}`);
      return type;
    }
  }
  
  // Fallback to default if none supported
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
    autoGainControl: true,
    // Request high quality audio if available
    sampleRate: { ideal: 48000 },
    channelCount: { ideal: 1 }
  };
}
