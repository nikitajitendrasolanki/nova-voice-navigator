import React, { useState, useEffect } from "react";
import { MessageCircle, Mic, Speaker, Sparkles, Brain, Zap } from "lucide-react";
import NovaMic from "@/components/NovaMic";
import WaveAnimation from "@/components/WaveAnimation";
import FeatureCard from "@/components/FeatureCard";
import MainLayout from "@/layouts/MainLayout";
import { toast } from "sonner";
import { getStaggerDelay } from "@/utils/animations";
import { sendCommandToNova, speakText } from "@/components/NovaBackend";

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [lastCommand, setLastCommand] = useState("");
  const [novaResponse, setNovaResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleMicToggle = async (active: boolean) => {
    setIsListening(active);
    if (active) {
      toast.success("Nova is listening...");
    } else {
      const transcript = await navigator.clipboard.readText();
      
      if (transcript && transcript !== lastCommand) {
        setLastCommand(transcript);
        processVoiceCommand(transcript);
      }
    }
  };

  const processVoiceCommand = async (command: string) => {
    try {
      setLastCommand(command);
      
      const response = await sendCommandToNova(command);
      
      setNovaResponse(response.response);
      
      if (response.action === "SPEAK") {
        setIsSpeaking(true);
        await speakText(response.response);
        setIsSpeaking(false);
      } else if (response.action === "SUGGEST_URL") {
        toast.success(
          <div>
            <p>{response.response}</p>
            <button 
              className="mt-2 px-4 py-1 bg-nova-600 text-white rounded-full text-sm"
              onClick={() => window.open(response.data, "_blank")}
            >
              Open link
            </button>
          </div>
        );
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      toast.error("Sorry, I encountered an error processing your request.");
    }
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Natural Conversations",
      description: "Interact with Nova using natural language, just like talking to a friend."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Intelligence",
      description: "Advanced AI that understands context and provides intelligent responses."
    },
    {
      icon: Brain,
      title: "Continuous Learning",
      description: "Nova learns from interactions to provide better assistance over time."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get instant responses with our optimized processing engine."
    }
  ];

  return (
    <MainLayout>
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.1),transparent_50%)]" />
        
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className={`space-y-6 ${fadeIn ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center py-1 px-3 rounded-full bg-nova-50 text-nova-600 text-sm font-medium mb-4 animate-fade-in">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nova-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-nova-500"></span>
                </span>
                Introducing Nova Assistant
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Your voice is <span className="text-nova-600">all you need</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Experience the next generation of voice assistance with Nova. Smarter conversations, faster responses, and a more intuitive experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="px-6 py-3 rounded-full bg-nova-600 text-white font-medium shadow-lg hover:bg-nova-700 transition-colors duration-300 hover:shadow-xl">
                  Get Started for Free
                </button>
                <button className="px-6 py-3 rounded-full border border-nova-200 bg-white text-nova-600 font-medium hover:bg-nova-50 transition-colors duration-300">
                  See How It Works
                </button>
              </div>
            </div>
            
            <div className={`flex justify-center items-center ${fadeIn ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
              <div className="relative bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center animate-float">
                <NovaMic size="lg" onToggle={handleMicToggle} />
                <div className="mt-6 text-center">
                  <WaveAnimation isActive={isListening || isSpeaking} barCount={7} />
                  <p className="mt-4 text-lg font-medium text-gray-700">
                    {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Tap to speak"}
                  </p>
                  
                  {lastCommand && (
                    <div className="mt-4 p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-500">You said:</p>
                      <p className="text-md font-medium">{lastCommand}</p>
                    </div>
                  )}
                  
                  {novaResponse && !isListening && (
                    <div className="mt-4 p-2 bg-nova-50 rounded-lg text-left">
                      <p className="text-sm text-nova-600">Nova:</p>
                      <p className="text-md font-medium">{novaResponse}</p>
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-nova-50 rounded-full border border-nova-100 text-sm font-medium text-nova-700">
                  "Hey Nova, what's the weather today?"
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="features" className="py-20 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Designed for Natural Interaction</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nova combines powerful AI with intuitive design to create the most natural voice assistant experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={getStaggerDelay(index, 100)}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section id="how-it-works" className="py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Nova Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art voice recognition combined with advanced AI to deliver a seamless experience.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-nova-100"></div>
            
            <div className="space-y-24">
              {[
                {
                  title: "Voice Recognition",
                  description: "Nova uses advanced speech recognition to understand what you're saying with incredible accuracy, even in noisy environments.",
                  icon: Mic,
                  position: "left"
                },
                {
                  title: "AI Processing",
                  description: "Your commands are processed by our sophisticated AI that understands context, remembers previous interactions, and learns from each conversation.",
                  icon: Brain,
                  position: "right"
                },
                {
                  title: "Natural Response",
                  description: "Nova responds in a natural, conversational manner using a voice that sounds remarkably human.",
                  icon: Speaker,
                  position: "left"
                }
              ].map((step, index) => (
                <div key={index} className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center`}>
                  <div className={`order-2 ${step.position === 'right' ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-nova-50 text-nova-600 mb-4">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className={`order-1 flex ${step.position === 'right' ? 'md:order-1 md:justify-end' : 'md:order-2 md:justify-start'}`}>
                    <div className="h-full">
                      <div className="h-24 w-24 rounded-full bg-nova-100/50 flex items-center justify-center animate-pulse-slow">
                        <div className="h-16 w-16 rounded-full bg-nova-200/70 flex items-center justify-center">
                          <div className="h-8 w-8 rounded-full bg-nova-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white border-4 border-nova-200 z-10">
                    <span className="text-nova-600 font-bold">{index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-nova-600 to-nova-700 text-white">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to experience Nova?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of users who are already transforming how they interact with technology.
          </p>
          <button className="px-8 py-4 rounded-full bg-white text-nova-600 font-medium text-lg shadow-lg hover:bg-gray-100 transition-colors duration-300 hover:shadow-xl">
            Get Started for Free
          </button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
