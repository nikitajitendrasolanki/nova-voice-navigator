
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

// Wikipedia search function
function searchWikipedia(query: string) {
  // Mock implementation
  return {
    title: query,
    summary: `This is a mock summary for "${query}". In a real implementation, this would fetch actual data from Wikipedia's API.`
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
  // Time commands
  else if (command.includes('what is the time') || command.includes('current time')) {
    const now = new Date();
    const currentTime = now.toLocaleTimeString();
    return { 
      response: `The current time is ${currentTime}`,
      action: "SPEAK"
    };
  }
  // Date commands
  else if (command.includes('what is the date') || command.includes('today\'s date')) {
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return { 
      response: `Today is ${currentDate}`,
      action: "SPEAK"
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
      response += `${index + 1}. ${article.title} from ${article.source}. ${article.description} `;
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
  // Wikipedia commands
  else if (command.includes('search for') || command.includes('wikipedia')) {
    let query = command;
    if (command.includes('search for')) {
      query = command.split('search for')[1].trim();
    } else if (command.includes('wikipedia')) {
      query = command.replace('wikipedia', '').trim();
    }
    
    const results = searchWikipedia(query);
    return { 
      response: `According to Wikipedia, ${results.summary}`,
      action: "SPEAK" 
    };
  }
  // Greeting commands
  else if (command.includes('hello') || command.includes('hi nova')) {
    return { 
      response: "Hello! How can I assist you today?",
      action: "SPEAK" 
    };
  }
  // Goodbye commands
  else if (command.includes('goodbye') || command.includes('bye')) {
    return { 
      response: "Goodbye! Have a nice day!",
      action: "SPEAK" 
    };
  }
  // Help command
  else if (command.includes('help') || command.includes('what can you do')) {
    return {
      response: "I can help with weather updates, news headlines, opening websites, telling the time and date, searching Wikipedia, and more. Just ask me what you need!",
      action: "SPEAK"
    };
  }
  // Music command (mock)
  else if (command.includes('play music')) {
    return {
      response: "I would play music for you, but I'm currently running in a browser. You can open a music streaming service instead.",
      action: "SPEAK",
      data: {
        suggestion: "https://open.spotify.com"
      }
    };
  }
  // Joke command
  else if (command.includes('tell me a joke') || command.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "What do you call a fish with no eyes? Fsh!",
      "How does a penguin build its house? Igloos it together!",
      "Why don't skeletons fight each other? They don't have the guts."
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      response: randomJoke,
      action: "SPEAK"
    };
  }
  // Calculator functionality
  else if (command.includes('calculate') || 
          command.includes('what is') && 
          (command.includes('+') || command.includes('-') || 
           command.includes('×') || command.includes('÷') || 
           command.includes('*') || command.includes('/'))) {
    
    try {
      // Extract the math expression
      let expression = command.replace('calculate', '').replace('what is', '').trim();
      
      // Replace common math terms with operators
      expression = expression.replace('plus', '+')
                             .replace('minus', '-')
                             .replace('times', '*')
                             .replace('divided by', '/')
                             .replace('×', '*')
                             .replace('÷', '/');
      
      // Use Function constructor to safely evaluate the expression
      // eslint-disable-next-line no-new-func
      const result = new Function(`return ${expression}`)();
      
      return {
        response: `The result of ${expression} is ${result}`,
        action: "SPEAK"
      };
    } catch (error) {
      return {
        response: "Sorry, I couldn't calculate that. Please try a simpler expression.",
        action: "SPEAK"
      };
    }
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
