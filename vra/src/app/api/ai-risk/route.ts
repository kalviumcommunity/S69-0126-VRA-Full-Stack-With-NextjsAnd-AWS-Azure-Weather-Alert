import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment variables.");
    return NextResponse.json(
      { error: "Server configuration error: API Key missing" },
      { status: 500 }
    );
  }

  try {
    const { rainfall, humidity, pastFloods } = await req.json();

    if (
      rainfall === undefined ||
      humidity === undefined ||
      pastFloods === undefined
    ) {
      return NextResponse.json(
        { error: "rainfall, humidity, pastFloods required" },
        { status: 400 }
      );
    }

    const prompt = `Assess flood risk using:
- Rainfall: ${rainfall} mm
- Humidity: ${humidity}%
- Past flood events: ${pastFloods}

Return:
- Risk level
- Probability range
- Short explanation
Include a disclaimer.`;

    // Groq API (OpenAI-compatible)
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
            content: "You are a flood risk assessment expert. Provide clear, concise analysis."
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API Error:", response.status, errorData);
      throw new Error(`Groq API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    const aiAnalysis = data.choices?.[0]?.message?.content || "No analysis generated";

    return NextResponse.json({
      aiAnalysis,
      model: "Groq Llama 3.3",
    });

  } catch (error: any) {
    console.error("AI Risk Analysis Error:", error);
    return NextResponse.json(
      { error: "AI generation failed", details: error.message },
      { status: 500 }
    );
  }
}
