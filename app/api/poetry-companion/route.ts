// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenAI } from "@google/genai";

// function getPrompt(
//   userInput: string,
//   assistanceType: string,
//   language: string
// ) {
//   const langInstruction =
//     language === "hinglish"
//       ? "The response should be in Hinglish/Urdish (written in the Roman script)."
//       : "The response should be in English.";

//   switch (assistanceType) {
//     case "rhyme":
//       return `You are a rhyming dictionary. Find 10 creative rhyming words for the last word of this line: "${userInput}". ${langInstruction} List the words clearly.`;

//     case "nextline":
//       return `You are a professional songwriter and composer. Turn this line into a catchy song-like stanza with 4–8 lyrical lines inspired by the tone, mood, and meaning of the original: "${userInput}". 
// ${langInstruction}
// Do not rewrite or modify the given line.
// Write only new lines as if they continue the song after this line.
// Make it feel like a real song: singable, rhythmic, with some rhymes and a strong emotional vibe.
// Do not add any labels (like Verse, Chorus), no bullet points, no numbering, no quotation marks and no explanations. Just the raw song lines.`;

//     case "style":
//       return `You are a literary expert. Analyze this line: "${userInput}". Suggest three different poetic styles or forms (like Haiku, Ghazal, Free Verse) that could be used to develop this idea. Briefly explain each style. ${langInstruction}`;

//     default:
//       return `You are a helpful assistant. ${userInput}. ${langInstruction}`;
//   }
// }



// export async function POST(req: NextRequest) {
//   try {
//     const { userInput, assistanceType, language } = await req.json();

//     if (!userInput || !assistanceType || !language) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: "GEMINI_API_KEY is not set in environment" },
//         { status: 500 }
//       );
//     }

//     // ✅ New SDK client
//     const ai = new GoogleGenAI({ apiKey });

//     const prompt = getPrompt(userInput, assistanceType, language);

//     // ✅ Use 2.5 model (v1 API, supported)
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash", // ya "gemini-2.5-pro" agar chahiye
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//     });

//     // ✅ Extract text safely
//     const text =
//       response.candidates?.[0]?.content?.parts
//         ?.map((p) => ("text" in p ? (p as any).text : ""))
//         .join("") ?? "";

//     return NextResponse.json({ result: text.trim() });
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate response from Gemini." },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

type AssistanceType = "rhyme" | "nextline" | "style";
type Language = "english" | "hinglish";
type VoicePhase = "askName" | "askTask";

function getPrompt(
  userInput: string,
  assistanceType: AssistanceType,
  language: Language
) {
  const langInstruction =
    language === "hinglish"
      ? "The response should be in Hinglish/Urdish (written in the Roman script)."
      : "The response should be in English.";

  switch (assistanceType) {
    case "rhyme":
      return `You are a professional songwriter and lyricist. Based on this line: "${userInput}", write 4-6 beautiful, singable lyrical lines that continue naturally from it. 
${langInstruction}
Make them:
- Flow like a real song (rhythmic, melodic, easy to sing)
- Have natural rhymes that feel effortless
- Match the emotion and vibe of the original line
- Sound like they belong in a hit song
- Use vivid imagery and feeling

Write ONLY the new lyrical lines. No labels, no bullet points, no numbering, no quotation marks, no explanations. Just pure song lyrics that flow beautifully.`;

    case "nextline":
      return `You are a professional songwriter and composer. Turn this line into a catchy song-like stanza with 4–8 lyrical lines inspired by the tone, mood, and meaning of the original: "${userInput}". 
${langInstruction}
Do not rewrite or modify the given line.
Write only new lines as if they continue the song after this line.
Make it feel like a real song: singable, rhythmic, with some rhymes and a strong emotional vibe.
Do not add any labels (like Verse, Chorus), no bullet points, no numbering, no quotation marks and no explanations. Just the raw song lines.`;

    case "style":
      return `You are a music and songwriting expert. Based on this line: "${userInput}", suggest 3 different music genres or singing styles that would work well for this lyric. 
${langInstruction}

For each style, format it EXACTLY like this:

[Genre Name]

[Description explaining why it fits, mood, and tempo in 2-3 sentences]

CRITICAL FORMATTING RULES:
1. First line: ONLY the genre name (like "Emotional Ballad" or "Sufi Fusion" or "Indie Pop")
2. Blank line
3. Then the description (2-3 sentences explaining why it fits, mood, tempo)
4. Two blank lines before next genre

ABSOLUTELY NO:
- Asterisks (** or *)
- Bullet points (-, •)
- Numbers (1., 2., 3.)
- Labels like "Genre:" or "Style:"
- Any markdown or special characters

Just: Genre name, blank line, description. Simple and clean.`;

    default:
      // For voice assistant - give detailed, conversational answers
      return `You are a helpful and knowledgeable AI assistant. Answer this question in a detailed, conversational way with 3-5 sentences: "${userInput}". 
${langInstruction}
IMPORTANT: Do NOT use any markdown formatting like asterisks (**), underscores (_), or special characters. Write in plain text only, as this will be read aloud by text-to-speech. Use simple, natural language that sounds good when spoken.`;
  }
}

// ✅ Voice-assistant specific prompt
function getVoicePrompt(
  phase: VoicePhase,
  language: Language,
  name?: string
) {
  if (phase === "askName") {
    return language === "hinglish"
      ? 'In Hinglish (Roman script), politely ask the user their name in **one short line**. Example style: "Tumhara naam kya hai?"'
      : 'Politely ask the user their name in **one short line**. Example style: "What is your name?"';
  }

  // phase === "askTask"
  const safeName = name || "dost";
  return language === "hinglish"
    ? `User ka naam ${safeName} hai. In Hinglish (Roman script), unko naam se greet karo aur ek ya do chhoti lines me pucho ki tum unke liye kya kar sakte ho as a songwriting assistant (jaise singing lines, next lines, ya music styles). Tone friendly aur casual ho.`
    : `The user's name is ${safeName}. In one or two short sentences, greet them by name and ask what you can do for them as a songwriting assistant (for example: singing lines, next lines, or music styles). Keep it friendly and conversational.`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // mode: "song" (default) OR "voice"
    const {
      mode = "song",
      userInput,
      assistanceType,
      language,
      // voice-specific
      phase,
      name,
    }: {
      mode?: "song" | "voice";
      userInput?: string;
      assistanceType?: AssistanceType;
      language?: Language;
      phase?: VoicePhase;
      name?: string;
    } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 🔊 VOICE ASSISTANT BRANCH
    if (mode === "voice") {
      if (!language || !phase) {
        return NextResponse.json(
          { error: "Missing language or phase for voice mode" },
          { status: 400 }
        );
      }

      const prompt = getVoicePrompt(phase, language, name);

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

      // Voice mode returns "reply"
      return NextResponse.json({ reply: text.trim() });
    }

    // ✍️ SONGWRITING COMPANION BRANCH (original)
    if (!userInput || !assistanceType || !language) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = getPrompt(userInput, assistanceType, language);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // or "gemini-2.5-pro"
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    let text =
      response.candidates?.[0]?.content?.parts
        ?.map((p) => ("text" in p ? (p as any).text : ""))
        .join("") ?? "";

    // Clean up formatting for all style suggestions (both English and Hinglish)
    if (assistanceType === "style") {
      text = text
        .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold **text**
        .replace(/\*(.+?)\*/g, "$1") // Remove italic *text*
        .replace(/^\d+\.\s+/gm, "") // Remove numbered lists like "1. "
        .replace(/^[-•]\s+/gm, "") // Remove bullet points
        .replace(/Genre\/Style:\s*/gi, "") // Remove "Genre/Style:" labels
        .replace(/Genre:\s*/gi, "") // Remove "Genre:" labels
        .replace(/Style:\s*/gi, ""); // Remove "Style:" labels
    }

    return NextResponse.json({ result: text.trim() });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response from Gemini." },
      { status: 500 }
    );
  }
}
