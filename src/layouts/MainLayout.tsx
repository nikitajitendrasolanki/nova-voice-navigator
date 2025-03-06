
import React from "react";
import NovaLogo from "@/components/NovaLogo";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <NovaLogo />
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium px-4 py-2 rounded-full text-nova-600 hover:bg-nova-50 transition-colors">
              Sign In
            </button>
            <button className="text-sm font-medium px-4 py-2 rounded-full bg-nova-600 text-white shadow-md hover:bg-nova-700 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>
      <main className={cn("flex-1", className)}>
        {children}
      </main>
      <footer className="border-t border-border/40 bg-background py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <NovaLogo variant="small" />
            <span className="text-sm text-muted-foreground ml-2">© {new Date().getFullYear()} Nova AI. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
