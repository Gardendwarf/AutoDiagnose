import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface VehicleInfo {
  make: string;
  model: string;
  year: string;
  engine?: string;
  trim?: string;
}

export interface DiagnosticResult {
  possibleCauses: {
    title: string;
    description: string;
    severity: "low" | "medium" | "high";
  }[];
  recommendations: string[];
  estimatedDifficulty: string;
  toolsNeeded: string[];
}

export async function decodeVinAndDiagnose(vin: string, symptoms: string) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    You are an expert automotive mechanic. 
    1. Decode this VIN: ${vin}. Provide the Make, Model, Year, and Engine if possible.
    2. Based on the vehicle details and these symptoms: "${symptoms}", provide a detailed diagnostic report.
    
    Return the response in JSON format matching this schema:
    {
      "vehicleInfo": {
        "make": "string",
        "model": "string",
        "year": "string",
        "engine": "string",
        "trim": "string"
      },
      "diagnostic": {
        "possibleCauses": [
          {
            "title": "string",
            "description": "string",
            "severity": "low | medium | high"
          }
        ],
        "recommendations": ["string"],
        "estimatedDifficulty": "string",
        "toolsNeeded": ["string"]
      },
      "summary": "string (markdown format)"
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Failed to generate diagnostic report.");
  }
}
