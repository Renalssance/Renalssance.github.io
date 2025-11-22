import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    // In a real scenario, handle missing API keys gracefully.
    // For this demo, we assume process.env.API_KEY is injected.
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const generateChatResponse = async (
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Format history for the prompt context if needed, 
    // but for a simple single-turn or short-context bot, using generateContent with system instruction is efficient.
    // We will construct a prompt that includes recent history to simulate statefulness manually 
    // or use the system instruction to set the persona.

    // Simulating a chat session by appending history to the prompt 
    // (simple method for stateless generateContent call)
    const conversationContext = history.map(h => `${h.role === 'user' ? 'User' : 'AlexAI'}: ${h.text}`).join('\n');
    const fullPrompt = `
      Recent Conversation:
      ${conversationContext}
      User: ${userMessage}
      AlexAI:
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    return response.text || "Connection interrupted. Try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to neural net. Please verify API Key.";
  }
};