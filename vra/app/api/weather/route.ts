import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "lat and lon are required" },
        { status: 400 }
      );
    }

    const url = `https://api.open-meteo.com/v1/forecast
      ?latitude=${lat}
      &longitude=${lon}
      &hourly=rain,relative_humidity_2m,temperature_2m
      &daily=rain_sum
      &timezone=auto`.replace(/\s/g, "");

    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({
      location: { lat, lon },
      dailyRainfall: data.daily.rain_sum[0],
      hourlyRain: data.hourly.rain.slice(0, 5),
      humidity: data.hourly.relative_humidity_2m.slice(0, 5),
      source: "Open-Meteo",
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
