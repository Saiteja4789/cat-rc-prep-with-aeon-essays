
import { GoogleGenAI, Type } from "@google/genai";
import { VocabularyWord, Question } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder check. In a real environment, the key would be set.
  // We can throw an error or handle it gracefully. For this app, we'll log a warning
  // because the user can't provide one. The app will show an error if API calls fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

const vocabularySchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      word: {
        type: Type.STRING,
        description: "The difficult word identified from the text."
      },
      definition: {
        type: Type.STRING,
        description: "A concise definition of the word."
      },
      usageExample: {
        type: Type.STRING,
        description: "A sentence from the original text showing how the word is used."
      }
    },
    required: ["word", "definition", "usageExample"]
  }
};

const questionsSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "The reading comprehension question."
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 4 multiple-choice options."
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: "The 0-based index of the correct option in the options array."
      },
      explanation: {
        type: Type.STRING,
        description: "A detailed explanation of why the answer is correct."
      }
    },
    required: ["question", "options", "correctAnswerIndex", "explanation"]
  }
};


export const analyzeVocabulary = async (text: string): Promise<VocabularyWord[]> => {
  const prompt = `
    Analyze the following essay text and identify 10-15 difficult or uncommon English words (approximately CEFR level C1/C2). 
    For each word, provide a concise definition and a sentence from the text that shows its usage.
    
    Essay Text:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: vocabularySchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as VocabularyWord[];
  } catch (error) {
    console.error("Error analyzing vocabulary:", error);
    throw new Error("Failed to communicate with the Gemini API for vocabulary analysis.");
  }
};

export const generateQuestions = async (text: string): Promise<Question[]> => {
  const prompt = `
    Based on the following essay, generate 4-5 high-quality Reading Comprehension (RC) questions suitable for a competitive exam like the CAT.
    The questions should test a variety of skills, including:
    - Main idea / Primary purpose
    - Inference
    - Tone or attitude of the author
    - Vocabulary-in-context
    - Specific details

    For each question, provide 4 distinct multiple-choice options (A, B, C, D).
    Clearly indicate the correct answer by its index (0-3) and provide a detailed explanation for why that answer is correct and the others are incorrect.

    Essay Text:
    ---
    ${text}
    ---
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionsSchema,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as Question[];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to communicate with the Gemini API for question generation.");
  }
};
