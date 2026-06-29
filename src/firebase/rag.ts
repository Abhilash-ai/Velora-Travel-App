import { seedDestinations } from '../data/dbSeed';

/**
 * Searches the local seeded travel knowledge base for coordinates, hidden spots,
 * and culture telemetry to provide structured context (RAG) to the Gemini model.
 */
export const retrieveRAGContext = (queryText: string): string => {
  const q = queryText.toLowerCase();

  // Search for matching destination profiles in our seeded database
  const matches = seedDestinations.filter(dest => {
    return dest.title.toLowerCase().includes(q) || 
           dest.country.toLowerCase().includes(q) ||
           dest.tags.some(t => t.toLowerCase().includes(q)) ||
           q.includes(dest.title.toLowerCase()) ||
           q.includes(dest.country.toLowerCase());
  });

  if (matches.length === 0) return "";

  let context = "RELEVANT VELORA TRAVEL DATABASE CONTEXT:\n";
  context += "Use the following verified geographical facts and secret coordinates to construct your response:\n\n";

  matches.forEach(dest => {
    context += `Destination Profile: ${dest.title}, ${dest.country}\n`;
    context += `- Coordinates: Lat: ${dest.lat}, Lng: ${dest.lng}\n`;
    context += `- Overview: ${dest.description}\n`;
    context += `- Telemetry Scores: Beauty: ${dest.beautyScore}%, Photography: ${dest.photoScore}%, Serenity: ${dest.serenityScore}%, Crowd Density: ${dest.crowdLevel}\n`;
    context += `- Best Season: ${dest.bestTime}\n`;
    context += `- Weather Conditions: ${dest.weather}\n`;
    context += `- Culinary specialties: ${dest.localFood.map(f => `${f.name} (${f.desc})`).join(', ')}\n`;
    context += `- Cultural background: ${dest.culture}\n`;
    context += `- Winding Route stops: ${dest.stops.map(s => `${s.name} (${s.time} - ${s.distance})`).join(' -> ')}\n`;
    context += `- Hidden Viewpoints & Gems: ${dest.hiddenGems.map(g => `${g.name} (GPS Coordinates: ${g.lat}, ${g.lng} - Optimal photography time: ${g.bestTime})`).join('; ')}\n\n`;
  });

  return context;
};
