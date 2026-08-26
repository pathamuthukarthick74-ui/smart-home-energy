import { GoogleGenAI, Type } from "@google/genai";

export const getEnergyAdvice = async (data: any) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // If no API key is configured, use fallback advice.
    if (!apiKey) {
      console.warn("Gemini API key not configured. Using fallback energy advice.");

      return {
        tips: [
          "Check insulation on high-consumption appliances.",
          "Switch off unused lights.",
          "Adjust AC temperature to 24°C."
        ],
        potentialSavings: "$12.50 / month"
      };
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
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
            potentialSavings: {
              type: Type.STRING
            }
          },
          required: ["tips", "potentialSavings"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Insight Error:", error);

    return {
      tips: [
        "Check insulation on high-consumption appliances.",
        "Switch off unused lights.",
        "Adjust AC temperature to 24°C."
      ],
      potentialSavings: "$12.50 / month"
    };
  }
};