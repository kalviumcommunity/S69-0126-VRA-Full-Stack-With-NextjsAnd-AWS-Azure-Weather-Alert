import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "lat and lon are required" },
      { status: 400 }
    );
  }

  const url = `https://air-quality-api.open-meteo.com/v1/air-quality
    ?latitude=${lat}
    &longitude=${lon}
    &hourly=pm10,pm2_5,carbon_monoxide
    &timezone=auto`.replace(/\s/g, "");

  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json({
    pm10: data.hourly.pm10.slice(0, 5),
    pm2_5: data.hourly.pm2_5.slice(0, 5),
    carbonMonoxide: data.hourly.carbon_monoxide.slice(0, 5),
    source: "Open-Meteo",
  });
}
