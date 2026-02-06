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
    .replace(/`/g, '')
    .replace(/~/g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to call Groq API with exponential backoff retry logic
async function callGroqWithRetry(
  prompt: string,
  systemInstruction: string,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;
  let lastStatus: number = 0;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemInstruction
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (response.ok) return response;

      lastStatus = response.status;

      if ((response.status === 503 || response.status === 429) && attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 1000;
        console.warn(`Groq API ${response.status}. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 1000;
        await delay(delayMs);
        continue;
      }
    }
  }

  if (lastStatus === 503) throw new Error("Service Unavailable after retries");
  if (lastError) throw lastError;
  throw new Error("Unknown error occurred");
}

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
  }

  try {
    const { pm10, pm25, location } = await req.json();

    if (pm10 === undefined || pm25 === undefined) {
      return NextResponse.json({ error: "pm10, pm25 required" }, { status: 400 });
    }

    // Capture current local context for the AI
    const now = new Date();
    const timeContext = now.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'long', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const prompt = `
      Location: ${location || "Anekal, Karnataka"}
      Current Local Time: ${timeContext}
      Recorded Data: PM2.5 = ${pm25} μg/m³, PM10 = ${pm10} μg/m³

      Analyze the air quality for this specific place and time. Your response must include:
      1. AQI Category & Brief Summary: A clear label and a 1-sentence summary of current conditions.
      2. Source Analysis: Identify likely local contributors (e.g., industry in Anekal, vehicle emissions from SH-3, or seasonal factors like February mist/dust).
      3. Health & Impact: Specifically explain how these levels affect the respiratory system and heart.
      4. Public Recommendation: One actionable step.

      Constraint: Use plain text only. Max 120 words. No markdown.
    `;

    const systemInstruction = `
      You are an Environmental Health Scientist specializing in Indian urban-industrial air quality. 
      Use the current time and location to provide deep context (e.g., recognizing Anekal's industrial belts or typical February weather patterns in Karnataka). 
      Ensure the tone is professional yet urgent if levels are high.
    `;

    const response = await callGroqWithRetry(prompt, systemInstruction);

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ analysis: generateAQFallback({ pm10, pm25 }), model: 'fallback' }, { status: 200 });
      }
      return NextResponse.json({ error: "AI Busy" }, { status: 503 });
    }

    const data = await response.json();
    let analysis = data.choices?.[0]?.message?.content || "Unable to generate analysis";
    analysis = cleanAndFormatText(analysis);

    return NextResponse.json({ analysis, model: "Groq Llama 3.3" });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}

function generateAQFallback(aq: { pm10: number; pm25: number }) {
  const pm = Math.max(aq.pm10 || 0, aq.pm25 || 0);
  let category = pm <= 50 ? 'Good' : pm <= 100 ? 'Moderate' : 'Unhealthy';
  return `${category}. High levels of particulate matter detected. Limit outdoor exposure.`;
}