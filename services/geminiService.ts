
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getEnergyAdvice = async (data: any) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this smart home energy data and give 3 short, actionable tips to reduce the bill. Data: ${JSON.stringify(data)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            potentialSavings: { type: Type.STRING }
          },
          required: ["tips", "potentialSavings"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Insight Error:", error);
    return {
      tips: ["Check insulation on high-consumption appliances.", "Switch off unused lights.", "Adjust AC temperature to 24°C."],
      potentialSavings: "$12.50 / month"
    };
  }
};
