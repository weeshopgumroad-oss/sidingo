import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Generates a sentence specifically for Shadowing practice
export const generateShadowingContent = async (englishWord: string): Promise<{sentence: string, tip: string}> => {
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      You are an expert English Language Coach specializing in the Shadowing Technique.
      
      Task: Create a simple, natural English sentence using the word "${englishWord}".
      The sentence should be useful for a beginner (A1/A2).
      Also provide a 2-3 word pronunciation tip (e.g., "Link the words").
      
      Output format strictly JSON:
      {
        "sentence": "The sentence here.",
        "tip": "Short tip."
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const json = JSON.parse(response.text || '{}');
    return {
      sentence: json.sentence || `I use the word ${englishWord} every day.`,
      tip: json.tip || "Speak clearly."
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { sentence: `Can you say ${englishWord}?`, tip: "Listen closely." };
  }
};