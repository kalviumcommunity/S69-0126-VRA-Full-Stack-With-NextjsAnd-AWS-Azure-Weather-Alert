export const WEATHER_METRICS = {
    temperature: 28,
    humidity: 85,
    rainfall: 120, // mm
    windSpeed: 45, // km/h
};

export const ALERTS = [
    { id: 1, type: 'critical', message: 'High Alert: Flash floods expected in Kerala within 24 hours.', location: 'Kerala' },
    { id: 2, type: 'warning', message: 'Moderate rain warning for Mumbai.', location: 'Mumbai' },
];

export const STATES_RISK = [
    { name: 'Kerala', risk: 'High', disasterPercent: 75, trend: 'increasing' },
    { name: 'Assam', risk: 'Severe', disasterPercent: 92, trend: 'stable' },
    { name: 'Maharashtra', risk: 'Medium', disasterPercent: 45, trend: 'decreasing' },
    { name: 'Tamil Nadu', risk: 'Low', disasterPercent: 12, trend: 'stable' },
    { name: 'Bihar', risk: 'High', disasterPercent: 68, trend: 'increasing' },
    { name: 'Odisha', risk: 'Medium', disasterPercent: 38, trend: 'decreasing' },
];

export const FORECAST_DATA = [
    { time: 'Now', rain: 15, temp: 28 },
    { time: '14:00', rain: 45, temp: 27 },
    { time: '16:00', rain: 80, temp: 26 },
    { time: '18:00', rain: 110, temp: 25 },
    { time: '20:00', rain: 95, temp: 25 },
    { time: '22:00', rain: 40, temp: 26 },
];
