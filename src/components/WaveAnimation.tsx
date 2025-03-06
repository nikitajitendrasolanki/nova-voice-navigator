
import React from "react";
import { cn } from "@/lib/utils";

interface WaveAnimationProps {
  className?: string;
  isActive?: boolean;
  barCount?: number;
  color?: string;
}

const WaveAnimation: React.FC<WaveAnimationProps> = ({
  className,
  isActive = false,
  barCount = 5,
  color = "#0ea5e9" // nova-500
}) => {
  return (
    <div className={cn("flex items-end justify-center h-12 gap-1", className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-t-full bg-current transition-all duration-300",
            isActive ? `animate-wave-${(i % 5) + 1}` : "h-1"
          )}
          style={{ 
            backgroundColor: isActive ? color : "#e0f2fe", // nova-100 if not active
            height: isActive ? undefined : "4px",
            transformOrigin: "bottom"
          }}
        />
      ))}
    </div>
  );
};

export default WaveAnimation;
