import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Type for the quiz answers coming from the frontend
interface QuizAnswers {
  style: string;
  color: string;
  personality: string;
  place: string;
  element: string;
}

export async function POST(request: Request) {
  try {
    const { style, color, personality, place, element }: QuizAnswers =
      await request.json();

    // Style-specific guidance for the spirit animal
    const styleHint = style === "Boy"
      ? "Give the spirit animal a cool, adventurous, bold vibe — think tough but cute, spiky details, fierce eyes, action-ready poses."
      : "Give the spirit animal a graceful, sparkly, elegant vibe — think flowing details, gentle eyes, jewel accents, magical princess energy.";

    // Build the prompt for Claude to generate spirit animal card data
    const prompt = `You are a magical spirit animal card creator for kids. Based on these answers, create a unique baby spirit animal trading card.

The child's answers:
- Style: ${style}
- Favorite color: ${color}
- Personality type: ${personality}
- Favorite place: ${place}
- Chosen element: ${element}

${styleHint}

Create a cute, magical baby spirit animal that matches these choices. The animal should be creative and fantastical (not just a regular animal — think crystal foxes, cloud bunnies, ember kittens, etc).

Return ONLY valid JSON with this exact structure, no markdown, no commentary:
{
  "name": "Creative Spirit Animal Name",
  "element": "${element}",
  "personality": "A fun 1-sentence personality description",
  "backstory": "A magical 2-3 sentence backstory about this baby spirit animal. Keep it kid-friendly and enchanting.",
  "stats": {
    "courage": <number 7-10>,
    "kindness": <number 7-10>,
    "magic": <number 7-10>
  },
  "special_move": {
    "name": "Cool Move Name",
    "description": "A short, exciting description of the special move"
  },
  "rarity": "Ultra Rare",
  "imagePrompt": "A detailed prompt to generate an adorable baby fantasy animal illustration for a ${style === "Boy" ? "boy — bold, adventurous, action-ready style with cool spiky or armored details" : "girl — graceful, sparkly, elegant style with flowing or jeweled details"}. Include: the specific animal type, ${color} color theme, ${element} element visual effects, cute baby proportions, sparkles and magical aura, fantasy trading card art style, centered composition, vibrant colors"
}`;

    // Call Claude API
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract the text response
    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Strip markdown code fences if Claude wraps the JSON in them
    let jsonText = textBlock.text.trim();
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, "").replace(/\n?```\s*$/, "");
    }

    // Parse the JSON response
    const cardData = JSON.parse(jsonText);

    return NextResponse.json(cardData);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating card:", message, error);
    return NextResponse.json(
      { error: "Failed to generate spirit animal card", details: message },
      { status: 500 }
    );
  }
}
