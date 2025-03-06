
import React, { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { startListening, stopListening, checkListeningStatus } from "./NovaBackend";

interface NovaMicProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onToggle?: (isActive: boolean) => void;
  onResult?: (text: string) => void;
}

const NovaMic: React.FC<NovaMicProps> = ({ 
  className, 
  size = "md",
  onToggle,
  onResult
}) => {
  const [isActive, setIsActive] = useState(false);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  // Sync state with actual listening status
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentStatus = checkListeningStatus();
      if (currentStatus !== isActive) {
        setIsActive(currentStatus);
        if (onToggle) onToggle(currentStatus);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [isActive, onToggle]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopListening();
      }
    };
  }, [isActive]);

  const handleClick = () => {
    if (isActive) {
      // Stop listening
      if (stopListening()) {
        setIsActive(false);
        if (onToggle) onToggle(false);
      }
    } else {
      // Start listening
      const success = startListening(
        (text) => {
          if (onResult) onResult(text);
          setIsActive(false);
          if (onToggle) onToggle(false);
        },
        (error) => {
          console.error("Speech recognition error:", error);
          setIsActive(false);
          if (onToggle) onToggle(false);
        }
      );
      
      if (success) {
        setIsActive(true);
        if (onToggle) onToggle(true);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "relative flex items-center justify-center rounded-full transition-all duration-300 ease-in-out",
        isActive ? "bg-nova-500 text-white" : "bg-white text-nova-600 border border-nova-100 hover:bg-nova-50",
        sizeClasses[size],
        className
      )}
      aria-label={isActive ? "Stop listening" : "Start listening"}
    >
      {isActive ? (
        <Mic className="animate-pulse-slow" />
      ) : (
        <Mic />
      )}
      
      {isActive && (
        <div className="absolute -inset-1 rounded-full border-4 border-nova-400/30 animate-pulse-slow"></div>
      )}
    </button>
  );
};

export default NovaMic;
