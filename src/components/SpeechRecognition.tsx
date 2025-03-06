
import React, { useState, useEffect, useCallback } from 'react';
import { startListening, stopListening, checkListeningStatus } from './NovaBackend';
import { Mic, MicOff } from 'lucide-react';

interface SpeechRecognitionProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  autoStart?: boolean;
  className?: string;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  onResult,
  onError,
  onListeningChange,
  autoStart = false,
  className = '',
}) => {
  const [isListening, setIsListening] = useState(false);

  const updateListeningState = useCallback((state: boolean) => {
    setIsListening(state);
    if (onListeningChange) {
      onListeningChange(state);
    }
  }, [onListeningChange]);

  const handleStartListening = useCallback(() => {
    const success = startListening(
      (text) => {
        onResult(text);
        updateListeningState(false);
      },
      (error) => {
        if (onError) onError(error);
        updateListeningState(false);
      }
    );
    
    if (success) {
      updateListeningState(true);
    }
  }, [onResult, onError, updateListeningState]);

  const handleStopListening = useCallback(() => {
    if (stopListening()) {
      updateListeningState(false);
    }
  }, [updateListeningState]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  }, [isListening, handleStartListening, handleStopListening]);

  // Check status periodically to ensure UI is in sync with actual state
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentStatus = checkListeningStatus();
      if (currentStatus !== isListening) {
        updateListeningState(currentStatus);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isListening, updateListeningState]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      handleStartListening();
    }
    
    // Cleanup on unmount
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [autoStart, handleStartListening, isListening]);

  return (
    <button
      onClick={toggleListening}
      className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-in-out ${
        isListening 
          ? "bg-nova-500 text-white" 
          : "bg-white text-nova-600 border border-nova-100 hover:bg-nova-50"
      } ${className}`}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening ? (
        <Mic className="animate-pulse-slow" />
      ) : (
        <Mic />
      )}
      
      {isListening && (
        <div className="absolute -inset-1 rounded-full border-4 border-nova-400/30 animate-pulse-slow"></div>
      )}
    </button>
  );
};

export default SpeechRecognition;
