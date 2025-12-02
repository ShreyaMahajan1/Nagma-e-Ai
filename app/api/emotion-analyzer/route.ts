import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { lyrics, language } = await req.json();

    if (!lyrics) {
      return NextResponse.json(
        { error: "Missing lyrics" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Analyze the emotional content of these song lyrics and return ONLY a JSON object with emotion percentages. No other text.

Lyrics: "${lyrics}"

Return format (must be valid JSON):
{
  "happy": 0-100,
  "sad": 0-100,
  "angry": 0-100,
  "romantic": 0-100,
  "energetic": 0-100,
  "melancholic": 0-100,
  "dominant_emotion": "name of strongest emotion",
  "mood_description": "brief 1-sentence description"
}

The percentages should add up to approximately 100. Return ONLY the JSON, nothing else.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const text =
      response.candidates?.[0]?.content?.parts
        ?.map((p) => ("text" in p ? (p as any).text : ""))
        .join("") ?? "";

    // Extract JSON from response (remove markdown code blocks if present)
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const emotions = JSON.parse(jsonText);

    return NextResponse.json({ emotions });
  } catch (error) {
    console.error("Emotion Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze emotions" },
      { status: 500 }
    );
  }
}
