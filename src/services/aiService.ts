import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import type { Schema } from '@google/generative-ai';

import { searchDestinations } from './semanticSearch';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export interface GeneratedStop {
  time: string;
  name: string;
  desc: string;
  category: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  stops: GeneratedStop[];
}

// Define the expected JSON schema for Gemini 1.5 Flash
const itinerarySchema: Schema = {
  type: SchemaType.ARRAY,
  description: "An array of days in the travel itinerary.",
  items: {
    type: SchemaType.OBJECT,
    properties: {
      day: { type: SchemaType.INTEGER, description: "The day number (e.g., 1)" },
      title: { type: SchemaType.STRING, description: "A brief, evocative summary of the day's focus." },
      stops: {
        type: SchemaType.ARRAY,
        description: "The stops or activities for this day.",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            time: { type: SchemaType.STRING, description: "Time of day (e.g. 09:00 AM)" },
            name: { type: SchemaType.STRING, description: "Real landmark or venue name." },
            desc: { type: SchemaType.STRING, description: "1-2 descriptive sentences evoking wanderlust." },
            category: { type: SchemaType.STRING, description: "One of: Culture, Scenic, Adventure, Gastronomy, Relaxing, Spiritual" }
          },
          required: ["time", "name", "desc", "category"]
        }
      }
    },
    required: ["day", "title", "stops"]
  }
};

export const generateItinerary = async (destinationQuery: string, days: number, vibe: string): Promise<ItineraryDay[]> => {
  if (!genAI) {
    throw new Error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  // RAG Pipeline Step 1: Retrieve context using Hugging Face semantic search
  const relevantDestinations = await searchDestinations(destinationQuery + " " + vibe, 2);

  let contextSnippet = "";
  if (relevantDestinations.length > 0) {
    contextSnippet = relevantDestinations.map((dest: any) => {
      const hiddenGems = dest.hiddenGems ? dest.hiddenGems.map((h: any) => h.name).join(", ") : "None specifically listed.";
      const spiritualTrails = dest.spiritualTrails ? dest.spiritualTrails.map((s: any) => s.name).join(", ") : "None specifically listed.";
      return `Destination: ${dest.title}
Description: ${dest.description}
Tags: ${dest.tags.join(", ")}
Hidden Gems: ${hiddenGems}
Spiritual Trails: ${spiritualTrails}`;
    }).join("\n\n");
  } else {
    contextSnippet = "No specific local database context found for this destination. Rely on general geographic knowledge, but maintain the Velora app persona.";
  }

  // RAG Pipeline Step 2: Build the Prompt
  const prompt = `
You are the AI Travel Guide for "Velora", a premium, cinematic travel application focused exclusively on discovering the true beauty of destinations, particularly in India.

Your goal is to generate a beautiful, personalized, and highly detailed ${days}-day itinerary for a user traveling to ${destinationQuery} with a "${vibe}" vibe.

--- LOCAL KNOWLEDGE BASE CONTEXT ---
Here is the exclusive data Velora knows about this location. You MUST prioritize and heavily feature the "Hidden Gems", "Spiritual Trails", and "Tags" mentioned below in your itinerary to prove you are using Velora's custom data rather than just generic web information:

${contextSnippet}
-----------------------------------

INSTRUCTIONS:
1. Generate the itinerary returning a strict JSON array of days matching the schema.
2. Weave the "Hidden Gems" or "Spiritual Trails" directly into the stops (e.g., set the "name" to the hidden gem, and write a beautiful description).
3. Ensure the tone is premium, evocative, and tailored to the "${vibe}" vibe.
`;

  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as ItineraryDay[];
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary with Gemini. See console for details.");
  }
};
