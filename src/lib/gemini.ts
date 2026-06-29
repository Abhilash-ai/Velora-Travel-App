import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure the API key exists
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("Missing VITE_GEMINI_API_KEY in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

const SYSTEM_INSTRUCTION = `
You are Velora, an elite, highly intelligent, and luxurious travel concierge. 
Your goal is to help users plan unforgettable journeys, specifically focusing on the most beautiful and culturally rich destinations (especially across India and global wonders).

When asked to plan an itinerary, ALWAYS structure it beautifully using Markdown:
- Use H3 (###) for Days (e.g. "### Day 1: Arrival & Immersion")
- Use bolding (**Morning**, **Afternoon**, **Evening**) for times of day.
- Keep your tone sophisticated, warm, and inspiring.
- Include a brief travel tip or local fact for the destination.
- Do not use generic corporate language; sound like a passionate local expert.
`;

export const startTravelChat = () => {
  // Mock fallback if API key is missing
  if (!API_KEY) {
    return {
      sendMessage: async (text: string) => {
        await new Promise(resolve => setTimeout(resolve, 1500)); // simulate network delay
        
        const destinationMatch = text.match(/explore\s+([^.]+)/i);
        const destinationName = destinationMatch ? destinationMatch[1].trim() : "your destination";

        const mockResponse = `
### Your Luxurious Getaway to ${destinationName}

That sounds like a spectacular choice! As your elite concierge, here is a curated taste of what your journey could look like:

**Morning**
Start your day with a private, exclusive guided tour of the local wonders, ensuring you experience the magic before the crowds arrive. 

**Afternoon**
Indulge in a world-class culinary experience at a highly sought-after restaurant, featuring a bespoke menu designed just for you.

**Evening**
Relax at your premium 5-star suite with breathtaking, unobstructed views of the horizon as the sun sets.

*(Note: I am currently running in prototype mode without an active API key, so this is a simulated response! But I can assure you the real experience is purely magical.)*
`;
        return {
          response: {
            text: () => mockResponse
          }
        };
      }
    };
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  return model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello! Who are you?" }],
      },
      {
        role: "model",
        parts: [{ text: "Hello! I am Velora, your elite travel concierge. Where are you dreaming of going today?" }],
      },
    ],
  });
};

