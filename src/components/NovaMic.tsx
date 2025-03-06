
import React, { useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface NovaMicProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  onToggle?: (isActive: boolean) => void;
}

const NovaMic: React.FC<NovaMicProps> = ({ 
  className, 
  size = "md",
  onToggle
}) => {
  const [isActive, setIsActive] = useState(false);

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24"
  };

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    onToggle?.(newState);
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
