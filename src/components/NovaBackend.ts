
import { supabase } from "@/integrations/supabase/client";

interface CommandResponse {
  response: string;
  action: string;
  data?: any;
}

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
