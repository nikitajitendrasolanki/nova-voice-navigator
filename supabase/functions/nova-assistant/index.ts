
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

// Weather API function
function getWeather(location = "Mumbai") {
  // In a real implementation, you would call a weather API here
  // For now using mock data
  const weatherData = {
    locations: {
      "mumbai": { temperature: "28°C", status: "Sunny" },
      "new york": { temperature: "18°C", status: "Cloudy" },
      "london": { temperature: "15°C", status: "Rainy" },
      "tokyo": { temperature: "24°C", status: "Clear" },
      "sydney": { temperature: "22°C", status: "Partly Cloudy" }
    }
  };

  // Default to Mumbai if location not found
  const locationLower = location.toLowerCase();
  const weatherInfo = weatherData.locations[locationLower] || weatherData.locations["mumbai"];
  
  return weatherInfo;
}

// News API function
function getNews() {
  // In a real implementation, you would call a news API here
  return [
    { title: "New technology breakthrough announced", source: "Tech News", description: "Scientists have developed a new AI model that can understand human emotions." },
    { title: "Global climate conference begins", source: "World News", description: "Leaders from around the world gather to discuss climate change solutions." },
    { title: "Stock markets reach new heights", source: "Financial News", description: "Major indices hit record levels amid strong corporate earnings." },
    { title: "Healthcare innovation award winners announced", source: "Medical News", description: "Startups focused on preventative care dominate this year's healthcare innovation awards." },
    { title: "New renewable energy project launched", source: "Energy News", description: "The world's largest floating solar farm begins operations in Southeast Asia." }
  ];
}

// Email function - mock implementation
function sendEmail(recipient: string, subject: string, body: string) {
  // In a real implementation, you would use an email service or API
  console.log(`Sending email to ${recipient} with subject: ${subject}`);
  
  // Return success for mock implementation
  return {
    success: true,
    message: `Email sent to ${recipient} successfully.`
  };
}

function processCommand(command: string) {
  command = command.toLowerCase();
  
  // Web browsing commands
  if (command.includes('open google')) {
    return { 
      response: "Opening Google for you.",
      action: "SUGGEST_URL",
      data: "https://www.google.com"
    };
  }
  else if (command.includes('open youtube')) {
    return { 
      response: "Opening YouTube for you.",
      action: "SUGGEST_URL",
      data: "https://www.youtube.com"
    };
  }
  else if (command.includes('open linkedin')) {
    return { 
      response: "Opening LinkedIn for you.",
      action: "SUGGEST_URL",
      data: "https://www.linkedin.com"
    };
  }
  // Weather commands
  else if (command.includes('weather')) {
    // Extract location if provided
    let location = "Mumbai";
    const locationMatches = command.match(/weather in (\w+)/i);
    if (locationMatches && locationMatches[1]) {
      location = locationMatches[1];
    }
    
    const weather = getWeather(location);
    return { 
      response: `The temperature in ${location} is ${weather.temperature} and the weather is ${weather.status}.`,
      action: "SPEAK" 
    };
  }
  // News commands
  else if (command.includes('news') || command.includes('headlines')) {
    const news = getNews();
    let response = "Here are the top headlines: ";
    
    news.forEach((article, index) => {
      response += `${index + 1}. ${article.title} from ${article.source}. `;
    });
    
    return { 
      response,
      action: "SPEAK",
      data: news
    };
  }
  // Email commands
  else if (command.includes('send email') || command.includes('send an email')) {
    // In a real implementation, you'd prompt for recipient, subject, and body
    // For this mock, we'll return instructions
    return {
      response: "To send an email, please provide the recipient, subject, and message content.",
      action: "SPEAK",
      data: {
        nextAction: "COLLECT_EMAIL_DETAILS"
      }
    };
  }
  // Default response
  else {
    return { 
      response: "I'm sorry, I didn't understand that command. Try saying 'help' to see what I can do.",
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
    const { command, userId } = await req.json() as CommandRequest;
    
    if (!command) {
      return new Response(
        JSON.stringify({ error: "Command is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process the command and get a response
    const result = processCommand(command);
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
