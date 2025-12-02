import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const { lyrics, genre, language } = await req.json();

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

    const genreInfo = genre ? `Genre: ${genre}` : "Genre: Not specified";
    const langInstruction = language === "hinglish" 
      ? "Response should be in Hinglish (Roman script)." 
      : "Response should be in English.";

    const prompt = `Analyze these song lyrics and suggest a professional song structure. Return ONLY a JSON object.

Lyrics: "${lyrics}"
${genreInfo}

Return format (must be valid JSON):
{
  "suggested_structure": [
    {"section": "Intro", "bars": 4, "description": "brief description"},
    {"section": "Verse 1", "bars": 8, "description": "brief description"},
    {"section": "Chorus", "bars": 8, "description": "brief description"}
  ],
  "rhyme_scheme": "AABB or ABAB etc",
  "tempo_suggestion": "Fast/Medium/Slow",
  "key_suggestion": "C Major, A Minor, etc",
  "overall_vibe": "brief description of song's vibe"
}

${langInstruction}
Return ONLY the JSON, nothing else.`;

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

    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const structure = JSON.parse(jsonText);

    return NextResponse.json({ structure });
  } catch (error) {
    console.error("Song Structure Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze song structure" },
      { status: 500 }
    );
  }
}
