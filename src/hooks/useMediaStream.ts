
import { useState, useRef, useEffect, useCallback } from 'react';
import { getSupportedMimeType, getAudioConstraints } from '@/utils/audioUtils';
import { toast } from 'sonner';

interface UseMediaStreamReturn {
  stream: MediaStream | null;
  mimeType: string;
  requestMediaStream: () => Promise<{ stream: MediaStream; mimeType: string } | null>;
  stopMediaStream: () => void;
}

/**
 * Hook for requesting and managing a media stream for audio recording
 */
export function useMediaStream(): UseMediaStreamReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const requestMediaStream = useCallback(async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Get supported MIME type before requesting stream
      const supportedMimeType = getSupportedMimeType();
      console.log(`Using MIME type: ${supportedMimeType || 'browser default'}`);

      // Request audio with high quality settings
      const audioStream = await navigator.mediaDevices.getUserMedia({ 
        audio: getAudioConstraints()
      });
      
      // Check if we have a valid audio track
      const audioTracks = audioStream.getAudioTracks();
      if (audioTracks.length === 0) {
        throw new Error("No audio track available");
      }
      
      console.log("Audio track obtained:", audioTracks[0].label);
      
      streamRef.current = audioStream;
      setStream(audioStream);
      setMimeType(supportedMimeType);
      
      return { stream: audioStream, mimeType: supportedMimeType };
    } catch (error) {
      console.error("Error accessing media devices:", error);
      toast.error("Could not access microphone. Please check permissions and try again.");
      return null;
    }
  }, []);

  const stopMediaStream = useCallback(() => {
    if (streamRef.current) {
      console.log("Stopping media stream");
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  return {
    stream,
    mimeType,
    requestMediaStream,
    stopMediaStream
  };
}
