
import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  delay?: number; // delay for animation in ms
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
  delay = 0
}) => {
  return (
    <div
      className={cn(
        "group p-6 rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:shadow-lg animate-fade-in-up", 
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-nova-50 text-nova-600 group-hover:bg-nova-100 transition-colors duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

export default FeatureCard;
