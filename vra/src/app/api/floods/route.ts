import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    try {
        // Fetch from Open-Meteo (Free, No API Key required)
        // We request current weather and hourly probability to map to the expected frontend format.
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=precipitation,relative_humidity_2m&hourly=precipitation_probability&forecast_days=1`
        );

        if (!response.ok) {
            throw new Error(`Open-Meteo API error: ${response.status}`);
        }

        const data = await response.json();

        // Map Open-Meteo data to match the existing "Ambee" structure expected by the frontend
        // Frontend expects: data.data.precipIntensity, data.data.humidity, data.data.precipProbability

        const currentRain = data.current.precipitation || 0;
        const currentHumidity = data.current.relative_humidity_2m || 0;
        // Take the first hourly probability as "current" probability approximation
        const currentProb = data.hourly.precipitation_probability ? data.hourly.precipitation_probability[0] : 0;

        const mappedData = {
            message: "success",
            data: {
                precipIntensity: currentRain,
                humidity: currentHumidity,
                precipProbability: currentProb,
                // Add explicit source for debugging
                source: "Open-Meteo"
            }
        };

        return NextResponse.json(mappedData);

    } catch (error: any) {
        console.error('Flood/Weather Data Fetch Error:', error);
        // Return a safe fallback structure so the overview map doesn't crash
        return NextResponse.json({
            error: 'Failed to fetch data',
            details: error.message,
            data: { precipIntensity: 0, humidity: 0, precipProbability: 0 }
        }, { status: 200 }); // Return 200 with 0 data to preventing frontend crashing
    }
}
