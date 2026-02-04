// import { NextResponse } from "next/server";

// // Helper function to delay execution (for exponential backoff)
// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// // Helper function to clean and format AI output
// function cleanAndFormatText(text: string): string {
//   return text
//     // Remove markdown formatting
//     .replace(/\*\*/g, '')
//     .replace(/\*/g, '')
//     .replace(/##/g, '')
//     .replace(/#/g, '')
//     .replace(/`/g, '')
//     .replace(/~/g, '')
//     // Remove extra whitespace
//     .replace(/\s+/g, ' ')
//     .trim();
// }

// // Helper function to call Gemini API with exponential backoff retry logic
// async function callGeminiWithRetry(
//   prompt: string,
//   systemInstruction: string,
//   maxRetries: number = 3
// ): Promise<Response> {
//   let lastError: Error | null = null;
//   let lastStatus: number = 0;

//   for (let attempt = 0; attempt < maxRetries; attempt++) {
//     try {
//       const response = await fetch(
//         `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.Gemini_API_Key}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             contents: [
//               {
//                 parts: [
//                   {
//                     text: prompt,
//                   },
//                 ],
//               },
//             ],
//             systemInstruction: {
//               parts: [
//                 {
//                   text: systemInstruction,
//                 },
//               ],
//             },
//           }),
//         }
//       );

//       // If successful or non-503 error, return immediately
//       if (response.ok) {
//         return response;
//       }

//       lastStatus = response.status;

//       // If 503 Service Unavailable and not the last attempt, retry with backoff
//       if (response.status === 503 && attempt < maxRetries - 1) {
//         const delayMs = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
//         console.warn(
//           `Gemini API returned 503. Retrying in ${delayMs}ms (attempt ${attempt + 1}/${maxRetries})...`
//         );
//         await delay(delayMs);
//         continue;
//       }

//       // For other errors, return the response
//       return response;
//     } catch (error) {
//       lastError = error as Error;
      
//       // If not the last attempt, retry with backoff
//       if (attempt < maxRetries - 1) {
//         const delayMs = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
//         console.error(`Gemini API Error on attempt ${attempt + 1}: ${lastError.message}. Retrying in ${delayMs}ms...`);
//         await delay(delayMs);
//         continue;
//       }
//     }
//   }

//   // If we exhausted all retries with 503 errors
//   if (lastStatus === 503) {
//     throw new Error("Service Unavailable after retries");
//   }

//   // If we exhausted all retries with other errors
//   if (lastError) {
//     throw lastError;
//   }

//   throw new Error("Unknown error occurred");
// }

// export async function POST(req: Request) {
//   if (!process.env.Gemini_API_Key) {
//     return NextResponse.json(
//       { error: "Server configuration error: Gemini API Key missing" },
//       { status: 500 }
//     );
//   }

//   try {
//     const { pm10, pm25, location } = await req.json();

//     if (pm10 === undefined || pm25 === undefined) {
//       return NextResponse.json(
//         { error: "pm10, pm25 required" },
//         { status: 400 }
//       );
//     }

//     const prompt = `Air quality for ${location || "this location"}:
//   PM10: ${pm10} μg/m³
//   PM2.5: ${pm25} μg/m³

//   Provide a concise assessment: give an AQI-like category (Good/Moderate/Unhealthy/etc.), brief health implications, and one clear recommendation for the public. Start with a short label (e.g., \"Moderate\") followed by 1-2 sentences. Use plain text only.`;

//     const systemInstruction = "You are an air quality specialist. Return plain text only (no markdown or special characters). Provide a short category label then 1-2 concise sentences describing health implications and a clear recommendation.";

//     const response = await callGeminiWithRetry(prompt, systemInstruction);


//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error("Gemini API Error:", response.status, errorText);

//       // Handle quota exceeded (429): return a deterministic fallback analysis
//       if (response.status === 429) {
//         const fallback = generateAQFallback({ pm10, pm25 });
//         return NextResponse.json({ analysis: fallback, model: 'fallback', warning: 'AI quota exceeded. Returning fallback analysis.' }, { status: 200 });
//       }

//       // Handle 503 Service Unavailable with user-friendly message
//       if (response.status === 503) {
//         return NextResponse.json(
//           { error: "AI Analysis is temporarily busy. Please try again." },
//           { status: 503 }
//         );
//       }

//       throw new Error(`Gemini API returned ${response.status}`);
//     }

//     const data = await response.json();
//     let analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate analysis";

//     // Clean and format the analysis
//     analysis = cleanAndFormatText(analysis);

//     return NextResponse.json({
//       analysis,
//       model: "Gemini 3 Flash",
//     });
//   } catch (error) {
//     console.error("Air Quality Analysis Error:", error);

//     // Handle service unavailable errors
//     if (error instanceof Error && error.message === "Service Unavailable after retries") {
//       return NextResponse.json(
//         { error: "AI Analysis is temporarily busy. Please try again." },
//         { status: 503 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Analysis generation failed", details: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }

// function generateAQFallback(aq: { pm10: number; pm25: number }) {
//   const { pm10, pm25 } = aq;
//   let category = 'Good';
//   const pm = Math.max(pm10 || 0, pm25 || 0);
//   if (pm <= 50) category = 'Good';
//   else if (pm <= 100) category = 'Moderate';
//   else if (pm <= 250) category = 'Unhealthy';
//   else category = 'Very Unhealthy';

//   const advice = category === 'Good' ? 'Air quality is acceptable.' : category === 'Moderate' ? 'Some sensitive groups should reduce prolonged outdoor exertion.' : 'Limit outdoor activities and consider masks for prolonged exposure.';
//   return `${category}. ${advice} PM2.5: ${pm25} μg/m³, PM10: ${pm10} μg/m³.`;
// }



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
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
          }),
        }
      );

      if (response.ok) return response;

      lastStatus = response.status;

      if (response.status === 503 && attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 2000;
        console.warn(`Gemini API 503. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
        continue;
      }
      return response;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const delayMs = Math.pow(2, attempt) * 2000;
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
  if (!process.env.Gemini_API_Key) {
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

    const response = await callGeminiWithRetry(prompt, systemInstruction);

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ analysis: generateAQFallback({ pm10, pm25 }), model: 'fallback' }, { status: 200 });
      }
      return NextResponse.json({ error: "AI Busy" }, { status: 503 });
    }

    const data = await response.json();
    let analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate analysis";
    analysis = cleanAndFormatText(analysis);

    return NextResponse.json({ analysis, model: "Gemini 3 Flash" });

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