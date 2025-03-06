
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CommandRequest {
  command: string;
  userId?: string;
}

// Mock implementations of the Python functions
function getWeather() {
  // In a real implementation, you would call a weather API here
  return {
    temperature: "28°C",
    status: "Sunny"
  };
}

function getNews() {
  // In a real implementation, you would call a news API here
  return [
    { title: "New technology breakthrough announced", source: "Tech News", description: "Scientists have developed a new AI model that can understand human emotions." },
    { title: "Global climate conference begins", source: "World News", description: "Leaders from around the world gather to discuss climate change solutions." },
    { title: "Stock markets reach new heights", source: "Financial News", description: "Major indices hit record levels amid strong corporate earnings." }
  ];
}

function processCommand(command: string) {
  command = command.toLowerCase();
  
  if (command.includes('open google')) {
    return { 
      response: "I would open Google for you, but I'm running in a browser already. You can visit google.com directly.",
      action: "SUGGEST_URL",
      data: "https://www.google.com"
    };
  }
  else if (command.includes('open youtube')) {
    return { 
      response: "I would open YouTube for you, but I'm running in a browser already. You can visit youtube.com directly.",
      action: "SUGGEST_URL",
      data: "https://www.youtube.com"
    };
  }
  else if (command.includes('open linkedin')) {
    return { 
      response: "I would open LinkedIn for you, but I'm running in a browser already. You can visit linkedin.com directly.",
      action: "SUGGEST_URL",
      data: "https://www.linkedin.com"
    };
  }
  else if (command.includes('what is the time')) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    return { 
      response: `The current time is ${currentTime}`,
      action: "SPEAK"
    };
  }
  else if (command.includes('weather')) {
    const weather = getWeather();
    return { 
      response: `The temperature is ${weather.temperature} and the weather is ${weather.status}.`,
      action: "SPEAK" 
    };
  }
  else if (command.includes('news')) {
    const news = getNews();
    let response = "Here are the top headlines: ";
    
    news.forEach((article, index) => {
      response += `${index + 1}. ${article.title} from ${article.source}. ${article.description} `;
    });
    
    return { 
      response,
      action: "SPEAK",
      data: news
    };
  }
  else if (command.includes('hello') || command.includes('hi nova')) {
    return { 
      response: "Hello! How can I assist you today?",
      action: "SPEAK" 
    };
  }
  else if (command.includes('goodbye') || command.includes('bye')) {
    return { 
      response: "Goodbye! Have a nice day!",
      action: "SPEAK" 
    };
  }
  else {
    return { 
      response: "I'm sorry, I didn't understand that command. Could you try again?",
      action: "SPEAK" 
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === 'POST') {
      const { command, userId } = await req.json() as CommandRequest;
      
      if (!command) {
        return new Response(
          JSON.stringify({ error: "Command is required" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Process the command and get a response
      const result = processCommand(command);
      
      // Store the command and response in the database (if we're connected to a user)
      // This would be implemented with actual Supabase client code in a real app
      
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
