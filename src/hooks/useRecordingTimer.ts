
import { useState, useRef, useEffect, useCallback } from 'react';
import { formatRecordingTime } from '@/utils/audioUtils';

interface UseRecordingTimerReturn {
  recordingTime: number;
  formatTime: (seconds: number) => string;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

/**
 * Hook for managing a recording timer with start, pause, stop, and reset functionality
 */
export function useRecordingTimer(): UseRecordingTimerReturn {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle timer interval
  useEffect(() => {
    if (isActive && !isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isActive, isPaused]);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startTimer = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const stopTimer = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
  }, []);

  const resetTimer = useCallback(() => {
    setRecordingTime(0);
    setIsActive(false);
    setIsPaused(false);
  }, []);

  return {
    recordingTime,
    formatTime: formatRecordingTime,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer
  };
}
