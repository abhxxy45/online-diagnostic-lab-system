
import { GoogleGenAI } from "@google/genai";

export const generateHealthInsights = async (testName: string, results: any) => {
  // Always initialize with the named parameter and direct process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    As a professional medical lab assistant, provide a concise, patient-friendly explanation of these lab results.
    Test: ${testName}
    Results: ${JSON.stringify(results)}
    
    Structure your response with:
    1. A brief summary of what the test measures.
    2. A simple interpretation of these specific results.
    3. General wellness advice (Standard disclaimer included: Always consult your physician).
    
    Keep it encouraging and clear. Avoid jargon where possible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Access the .text property directly, do not call it as a method.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to generate insights at this time. Please consult your physician.";
  }
};
