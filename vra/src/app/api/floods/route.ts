import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
        return NextResponse.json({ error: 'Latitude and Longitude are required' }, { status: 400 });
    }

    const apiKey = process.env.AMBEE_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Server configuration error: API Key missing' }, { status: 500 });
    }

    try {
        // Using the Weather endpoint as it is the one authorized for this key.
        // Standard Flood endpoints returned 401/404, so we use Weather to get rainfall/conditions.
        const response = await fetch(`https://api.ambeedata.com/weather/latest/by-lat-lng?lat=${lat}&lng=${lng}`, {
            method: 'GET',
            headers: {
                'x-api-key': apiKey,
                'Content-type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ambee API Error:', response.status, errorText);
            return NextResponse.json({ error: `Ambee API error: ${response.status}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error: any) {
        console.error('Flood/Weather Data Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
    }
}
