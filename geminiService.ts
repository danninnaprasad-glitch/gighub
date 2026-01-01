
import { GoogleGenAI, Type } from "@google/genai";
import { Job } from "../types";

export const getAiSuggestions = async (jobs: Job[], userSkills: string): Promise<string[]> => {
  // Fix: Initialize with the correct named parameter from environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const jobContext = jobs.map(j => ({
    id: j.job_id,
    title: j.job_title,
    desc: j.job_description.substring(0, 200)
  }));

  // Fix: Use gemini-3-pro-preview for complex text matching tasks requiring reasoning
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Based on the user's skills: "${userSkills}", which 5 jobs from this list are the best matches? List ONLY the job IDs as a JSON array. 
    
    Jobs: ${JSON.stringify(jobContext)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        }
      }
    }
  });

  try {
    // Fix: Access .text property directly as it returns the string output
    const text = response.text;
    return JSON.parse(text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
};
