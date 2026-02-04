import { NextResponse } from "next/server";

// Helper function to delay execution (for exponential backoff)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to clean and format AI output
function cleanAndFormatText(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/##/g, '')
    .replace(/#/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/~/g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to call Gemini API with exponential backoff retry logic
async function callGeminiWithRetry(
  prompt: string,
  systemInstruction: string,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;
  let lastStatus: number = 0;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.Gemini_API_Key}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            systemInstruction: {
              parts: [
                {
                  text: systemInstruction,
                },
              ],
            },
          }),
        }
      );

      // If successful or non-503 error, return immediately
      if (response.ok) {
        return response;
      }

      lastStatus = response.status;

      // If 503 Service Unavailable and not the last attempt, retry with backoff
      if (response.status === 503 && attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
        console.warn(
          `Gemini API returned 503. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})...`
        );
        await delay(delayMs);
        continue;
      }

      // For other errors, return the response
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // If not the last attempt, retry with backoff
      if (attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
        console.error(`Gemini API Error on attempt ${attempt + 1}: ${lastError.message}. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
        continue;
      }
    }
  }

  // If we exhausted all retries with 503 errors
  if (lastStatus === 503) {
    throw new Error("Service Unavailable after retries");
  }

  // If we exhausted all retries with other errors
  if (lastError) {
    throw lastError;
  }

  throw new Error("Unknown error occurred");
}

export async function POST(req: Request) {
  if (!process.env.Gemini_API_Key) {
    return NextResponse.json(
      { error: "Server configuration error: Gemini API Key missing" },
      { status: 500 }
    );
  }

  try {
    const { temperature, humidity, rainfall, windSpeed, location } = await req.json();

    if (
      temperature === undefined ||
      humidity === undefined ||
      rainfall === undefined ||
      windSpeed === undefined
    ) {
      return NextResponse.json(
        { error: "temperature, humidity, rainfall, windSpeed required" },
        { status: 400 }
      );
    }

    const prompt = `Current weather for ${location || 'this location'}:
Temperature: ${temperature}°C
Humidity: ${humidity}%
Rainfall: ${rainfall}mm
Wind Speed: ${windSpeed}km/h

Please provide a concise daily climate summary: a one-line headline, then 2-3 short sentences describing current conditions, key observations, and what to expect today. Use plain text only.`;

    const systemInstruction = "You are a professional meteorologist. Return plain text only (no markdown, no lists, no special characters). Start with a short headline (one line) followed by 2-3 concise sentences describing conditions, observations, and expected impacts or precautions.";

    const response = await callGeminiWithRetry(prompt, systemInstruction);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", response.status, errorText);

      // Handle quota exceeded (429): return a deterministic fallback summary
      if (response.status === 429) {
        const fallbackSummary = generateFallbackSummary({ temperature, humidity, rainfall, windSpeed });
        return NextResponse.json({
          summary: fallbackSummary,
          model: "fallback",
          warning: "AI quota exceeded. Returning a concise fallback summary."
        }, { status: 200 });
      }

      // Handle 503 Service Unavailable with user-friendly message
      if (response.status === 503) {
        return NextResponse.json(
          { error: "AI Analysis is temporarily busy. Please try again." },
          { status: 503 }
        );
      }

      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    let summary =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Unable to generate summary";

    // Clean and format the summary
    summary = cleanAndFormatText(summary);

    return NextResponse.json({
      summary,
      model: "Gemini 3 Flash",
    });
  } catch (error) {
    console.error("Climate Summary Error:", error);

    // Handle service unavailable errors
    if (error instanceof Error && error.message === "Service Unavailable after retries") {
      return NextResponse.json(
        { error: "AI Analysis is temporarily busy. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Summary generation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Fallback summary generator when AI is unavailable or quota exceeded
function generateFallbackSummary(metrics: { temperature: number; humidity: number; rainfall: number; windSpeed: number; }) {
  const { temperature, humidity, rainfall, windSpeed } = metrics;
  const parts: string[] = [];
  if (rainfall > 50) parts.push('Heavy rain is likely');
  else if (rainfall > 10) parts.push('Light to moderate rain expected');
  else parts.push('Mostly dry conditions');

  if (temperature >= 35) parts.push('hot temperatures');
  else if (temperature >= 25) parts.push('warm temperatures');
  else parts.push('cool temperatures');

  if (windSpeed > 40) parts.push('windy conditions');

  const headline = `${parts[0]} today`;
  const body = `Expect ${parts.slice(1).join(', ')}. Temperature around ${temperature}°C, humidity ${humidity}%.`;
  return `${headline}. ${body}`;
}
