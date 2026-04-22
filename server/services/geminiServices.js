import { GoogleGenerativeAI } from '@google/generative-ai';

// Defining these outside the generatePlaylistFromMood() function so they aren't remade
// on every run.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json"
  }
});

// May be useful to modify this a bit later
export const buildGeminiPrompt = (userMood) => {
  return `
    You are an expert music curator and DJ. 
    Your task is to generate a playlist of exactly 15 songs based on the user's mood or prompt.
    
    User's Mood/Prompt: "${userMood}"
    
    CRITICAL INSTRUCTIONS:
    1. Respond ONLY with a valid JSON array.
    2. Do NOT include markdown formatting (like \`\`\`json).
    3. Do NOT include any conversational text before or after the JSON.
    4. Provide well-known songs that are highly likely to be found on Spotify.
    
    The JSON must follow this exact schema:
    [
      {
        "title": "Song Title",
        "artist": "Artist Name"
      }
    ]
  `;
};

export const generatePlaylistFromMood = async (userMood) => {
  try {
    const prompt = buildGeminiPrompt(userMood);
    const result = await model.generateContent(prompt);
    
    /* Extract text response. No need to format since we explicitly define the
    response as "application/json". */
    const responseText = result.response.text();
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate playlist from Gemini");
  }
};