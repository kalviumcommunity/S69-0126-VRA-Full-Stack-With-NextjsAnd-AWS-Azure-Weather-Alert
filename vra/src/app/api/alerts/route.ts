import { NextResponse } from "next/server";

function calculateRisk(rain: number) {
  if (rain > 100) return "High";
  if (rain >= 50) return "Moderate";
  return "Low";
}

export async function GET() {
  try {
    // Example: Chennai coordinates
    const lat = "13.08";
    const lon = "80.27";

    const weatherRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/weather?lat=${lat}&lon=${lon}`
    );

    const weather = await weatherRes.json();
    const rainfall = weather.dailyRainfall;

    const riskLevel = calculateRisk(rainfall);

    if (riskLevel === "Low") {
      return NextResponse.json({
        alerts: [],
        message: "No flood alerts at this time",
      });
    }

    return NextResponse.json({
      alerts: [
        {
          location: "Chennai",
          riskLevel,
          message:
            riskLevel === "High"
              ? "High flood risk due to heavy rainfall. Stay alert."
              : "Moderate flood risk. Possibility of waterlogging.",
          timestamp: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate alerts" },
      { status: 500 }
    );
  }
}
