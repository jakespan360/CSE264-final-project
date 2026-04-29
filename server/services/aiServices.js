import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generatePlaylistFromMood = async (userMood) => {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert music curator and DJ.
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
]`,
        },
      ],
      temperature: 0.9,
    });

    const text = completion.choices[0].message.content.trim();
    const json = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    return JSON.parse(json);
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw new Error("Failed to generate playlist from Groq");
  }
};
