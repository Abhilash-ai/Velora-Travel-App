import { HfInference } from '@huggingface/inference';
import { seedDestinations } from '../data/dbSeed';

const hf = new HfInference(import.meta.env.VITE_HF_API_KEY || '');

// Cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// In a real production app, these embeddings would be pre-calculated and stored in Firestore/Pinecone
// For this client-side demo, we will cache them in memory once generated.
const destinationEmbeddingsCache: Record<string, number[]> = {};

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    if (!import.meta.env.VITE_HF_API_KEY) {
      console.warn("No Hugging Face API key found. Using mock semantic search.");
      return mockEmbedding(text);
    }

    const output = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    });
    
    // The HF inference API returns either number[], number[][], or number[][][]
    // For a single string input, it returns a 1D array or 2D array [1][N]
    const vec = Array.isArray(output[0]) ? output[0] : output;
    return vec as number[];
  } catch (error) {
    console.error("HF Embedding error:", error);
    return mockEmbedding(text);
  }
}

function mockEmbedding(text: string): number[] {
  // A deterministic pseudo-embedding based on string character codes for fallback testing
  const vec = new Array(384).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % 384] += text.charCodeAt(i);
  }
  return vec;
}

export async function searchDestinations(query: string, topK: number = 3) {
  const queryEmbedding = await generateEmbedding(query);

  const scoredDestinations = await Promise.all(seedDestinations.map(async (dest) => {
    // Generate or retrieve cached embedding for the destination description
    if (!destinationEmbeddingsCache[dest.id]) {
      const combinedText = `${dest.title} ${dest.description} ${dest.tags.join(' ')}`;
      destinationEmbeddingsCache[dest.id] = await generateEmbedding(combinedText);
    }
    
    const destEmbedding = destinationEmbeddingsCache[dest.id];
    const score = cosineSimilarity(queryEmbedding, destEmbedding);
    
    return { destination: dest, score };
  }));

  // Sort by highest similarity score
  scoredDestinations.sort((a, b) => b.score - a.score);
  
  return scoredDestinations.slice(0, topK).map(res => res.destination);
}
