
import { supabase } from "@/integrations/supabase/client";

interface CommandResponse {
  response: string;
  action: string;
  data?: any;
}

// Speech recognition interface
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onerror: (event: any) => void;
  onresult: (event: any) => void;
  onend: () => void;
}

// Global variables for speech recognition
let recognition: SpeechRecognition | null = null;
let isListening = false;

// Setup speech recognition
export function setupSpeechRecognition() {
  // Check if browser supports speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    console.error("Speech recognition not supported in this browser");
    return false;
  }

  // Initialize speech recognition
  // @ts-ignore - Using ignore for browser compatibility issues
  const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition;
  recognition = new SpeechRecognitionAPI() as SpeechRecognition;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  return true;
}

// Function to start listening for voice commands
export function startListening(onResult: (command: string) => void, onError?: (error: string) => void) {
  if (!recognition) {
    const isSupported = setupSpeechRecognition();
    if (!isSupported) {
      if (onError) onError("Speech recognition not supported");
      return false;
    }
  }

  if (isListening) {
    return true; // Already listening
  }

  if (recognition) {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      console.log("Recognized: ", transcript);
      
      // Check if command starts with "Nova" or user just said "Nova"
      if (transcript.startsWith("nova")) {
        // If user just said "Nova", prompt them to say a command
        if (transcript === "nova") {
          speakText("Yes, how can I help you?");
          // Start listening again for the actual command
          setTimeout(() => {
            if (recognition) {
              try {
                recognition.start();
              } catch (error) {
                console.error("Error restarting speech recognition after wake word:", error);
              }
            }
          }, 1000);
        } else {
          // Extract the command after "Nova"
          const command = transcript.substring(5).trim();
          if (command) {
            onResult(command);
          } else {
            speakText("I'm listening. Please give me a command.");
            // Start listening again
            setTimeout(() => {
              if (recognition) {
                try {
                  recognition.start();
                } catch (error) {
                  console.error("Error restarting speech recognition after empty command:", error);
                }
              }
            }, 1000);
          }
        }
      } else {
        // If not prefixed with "Nova", still process the command
        // This allows continuous conversation after initial "Nova" wake word
        onResult(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      isListening = false;
      if (onError) onError(`Error: ${event.error}`);
    };

    recognition.onend = () => {
      isListening = false;
      console.log("Speech recognition ended");
    };

    try {
      recognition.start();
      isListening = true;
      return true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      if (onError) onError(`Error starting speech recognition: ${error}`);
      return false;
    }
  }

  return false;
}

// Function to stop listening
export function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    return true;
  }
  return false;
}

// Check if currently listening
export function checkListeningStatus() {
  return isListening;
}

// Send command to Nova backend
export async function sendCommandToNova(command: string): Promise<CommandResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('nova-assistant', {
      body: { command }
    });
    
    if (error) throw error;
    
    // Also store the command in the database
    await storeCommand(command, data.response);
    
    return data;
  } catch (error) {
    console.error("Error sending command to Nova:", error);
    return {
      response: "Sorry, I'm having trouble connecting to my backend services.",
      action: "SPEAK"
    };
  }
}

// Store command in database
async function storeCommand(command: string, response: string) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;
    
    await supabase.from('voice_commands').insert({
      user_id: userId || null,
      command,
      response
    });
  } catch (error) {
    console.error("Error storing command:", error);
    // Non-critical error, so we don't throw
  }
}

// Speech synthesis function
export function speakText(text: string) {
  if (!('speechSynthesis' in window)) {
    console.error("Speech synthesis not supported");
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  // Get all available voices
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find a female voice
  const femaleVoice = voices.find(voice => 
    voice.name.includes('female') || 
    voice.name.includes('Samantha') || 
    voice.name.includes('Google US English Female')
  );
  
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  window.speechSynthesis.speak(utterance);
  
  return new Promise<void>((resolve) => {
    utterance.onend = () => resolve();
  });
}
