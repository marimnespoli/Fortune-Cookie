import Anthropic from "@anthropic-ai/sdk";
import { fallbackFortunes } from "../../fortunes";

// Needs ANTHROPIC_API_KEY in the environment (set it in Vercel's project settings).
// Without it, or if the call fails, we answer with a fortune from the local list.

const MAX_LENGTH = 60;

const SYSTEM_PROMPT = `You write the message inside a fortune cookie.
Write one original fortune in English: warm, a little magical, hopeful, and specific enough to feel personal.
Keep it under ${MAX_LENGTH} characters and a single sentence ending with a period.
Avoid clichés like "good things come to those who wait", and avoid emojis, quotes and hashtags.
Reply with the fortune only.`;

function randomFallback() {
  return fallbackFortunes[Math.floor(Math.random() * fallbackFortunes.length)];
}

function clean(text: string) {
  return text.trim().replace(/^["'“”]+|["'“”]+$/g, "").replace(/\s+/g, " ");
}

export async function GET() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ fortune: randomFallback(), source: "local" });
  }

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          // A random seed nudges the model away from repeating the same fortune.
          content: `Crack open a new fortune cookie. (seed ${Math.random().toString(36).slice(2, 8)})`,
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      return Response.json({ fortune: randomFallback(), source: "local" });
    }

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join(" ");
    const fortune = clean(text);

    if (!fortune || fortune.length > MAX_LENGTH) {
      return Response.json({ fortune: randomFallback(), source: "local" });
    }
    return Response.json({ fortune, source: "ai" });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`Fortune API error ${error.status}:`, error.message);
    } else {
      console.error("Fortune generation failed:", error);
    }
    return Response.json({ fortune: randomFallback(), source: "local" });
  }
}

// Every request should produce a fresh fortune.
export const dynamic = "force-dynamic";
