import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
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

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const prompt = `
Assess flood risk using:
- Rainfall: ${rainfall} mm
- Humidity: ${humidity}%
- Past flood events: ${pastFloods}

Return:
- Risk level
- Probability range
- Short explanation
Include a disclaimer.
`;

    const result = await model.generateContent(prompt);

    return NextResponse.json({
      aiAnalysis: result.response.text(),
      model: "Gemini",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "AI risk analysis failed" },
      { status: 500 }
    );
  }
}
