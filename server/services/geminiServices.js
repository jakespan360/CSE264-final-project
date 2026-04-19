import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = buildGeminiPrompt(userMood);
    const result = await model.generateContent(prompt);
    
    //extract text response
    let responseText = result.response.text();
    
    //clean up formatting
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    //create playlist object to be passed along to spotify GET requests
    const playlist = JSON.parse(responseText);
    
    return playlist;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate playlist from Gemini");
  }
};