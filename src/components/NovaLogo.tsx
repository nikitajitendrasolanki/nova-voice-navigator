
import React from "react";
import { cn } from "@/lib/utils";

interface NovaLogoProps {
  className?: string;
  variant?: "default" | "small" | "large";
}

const NovaLogo: React.FC<NovaLogoProps> = ({ className, variant = "default" }) => {
  const sizeClasses = {
    small: "text-xl",
    default: "text-3xl",
    large: "text-5xl"
  };

  return (
    <div className={cn("flex items-center font-bold tracking-tight", sizeClasses[variant], className)}>
      <span className="text-nova-600">Nova</span>
      <div className="ml-1 h-2 w-2 rounded-full bg-nova-500 animate-pulse-slow"></div>
    </div>
  );
};

export default NovaLogo;
