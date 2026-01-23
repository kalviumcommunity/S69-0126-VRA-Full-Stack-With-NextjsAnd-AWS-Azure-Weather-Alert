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
    { name: 'Kerala', risk: 'High', disasterPercent: 75, trend: 'increasing', rainfall: 250, humidity: 88, pastFloods: 'Severe floods in 2018, 2019' },
    { name: 'Assam', risk: 'Severe', disasterPercent: 92, trend: 'stable', rainfall: 320, humidity: 92, pastFloods: 'Annual flooding, major in 2020' },
    { name: 'Maharashtra', risk: 'Medium', disasterPercent: 45, trend: 'decreasing', rainfall: 180, humidity: 75, pastFloods: 'Mumbai floods 2005, 2017' },
    { name: 'Tamil Nadu', risk: 'Low', disasterPercent: 12, trend: 'stable', rainfall: 90, humidity: 65, pastFloods: 'Chennai floods 2015' },
    { name: 'Bihar', risk: 'High', disasterPercent: 68, trend: 'increasing', rainfall: 210, humidity: 82, pastFloods: 'Kosi river floods frequently' },
    { name: 'Odisha', risk: 'Medium', disasterPercent: 38, trend: 'decreasing', rainfall: 150, humidity: 78, pastFloods: 'Cyclone related flooding' },
];

export const FORECAST_DATA = [
    { time: 'Now', rain: 15, temp: 28 },
    { time: '14:00', rain: 45, temp: 27 },
    { time: '16:00', rain: 80, temp: 26 },
    { time: '18:00', rain: 110, temp: 25 },
    { time: '20:00', rain: 95, temp: 25 },
    { time: '22:00', rain: 40, temp: 26 },
];
