import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client for DALL-E image generation
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { imagePrompt } = await request.json();

    // Call DALL-E 3 with b64_json to get base64 directly (avoids CORS issues)
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Digital illustration for a children's trading card game: ${imagePrompt}. Style: adorable, magical, glowing, fantasy art, soft lighting, no text or words in the image.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;

    if (!b64) {
      throw new Error("No image data returned from DALL-E");
    }

    // Return the image as a binary PNG response (avoids JSON size limits)
    const imageBuffer = Buffer.from(b64, "base64");
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": imageBuffer.length.toString(),
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error generating image:", message, error);
    return NextResponse.json(
      { error: "Failed to generate spirit animal image", details: message },
      { status: 500 }
    );
  }
}
