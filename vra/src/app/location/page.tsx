'use client';

import dynamic from 'next/dynamic';
import { CloudRain, Wind, Droplets, Thermometer, Calendar, Cloud, AlertCircle, Loader2, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import WeatherCard from '@/components/WeatherCard';
import { RainfallChart, TemperatureTrendChart } from '@/components/FloodCharts';
import { WEATHER_METRICS, FORECAST_DATA } from '@/lib/mockData';

const MapComponent = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-slate-100 animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function LocationPage() {
    const [currentLocation, setCurrentLocation] = useState("Ernakulam District, Kerala");
    const [placeName, setPlaceName] = useState<string | null>(null);
    const [placeArea, setPlaceArea] = useState<string | null>(null);
    const [mapCenter, setMapCenter] = useState<[number, number]>([9.9312, 76.2673]); // Kochi co-ords

    const [metrics, setMetrics] = useState(WEATHER_METRICS);
    const [loading, setLoading] = useState(true);
    const [climateSummary, setClimateSummary] = useState<string>('');
    const [airQualityAnalysis, setAirQualityAnalysis] = useState<string>('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [airQualityLoading, setAirQualityLoading] = useState(false);
    const [airQualityData, setAirQualityData] = useState({ pm10: 0, pm25: 0 });
    const [hasInitialized, setHasInitialized] = useState(false);
    const [showTemperatureTrend, setShowTemperatureTrend] = useState(false);

    useEffect(() => {
        async function fetchAllData() {
            try {
                // Fetch weather data from Open-Meteo
                const weatherResponse = await fetch(`/api/weather?lat=${mapCenter[0]}&lon=${mapCenter[1]}`);
                if (weatherResponse.ok) {
                    const weatherData = await weatherResponse.json();
                    if (weatherData) {
                        const newMetrics = {
                            temperature: weatherData.temperature || WEATHER_METRICS.temperature,
                            humidity: weatherData.humidity || WEATHER_METRICS.humidity,
                            rainfall: weatherData.rainfall || WEATHER_METRICS.rainfall,
                            windSpeed: weatherData.windSpeed || WEATHER_METRICS.windSpeed,
                        };
                        setMetrics(newMetrics);
                        
                        // Immediately fetch climate summary after getting metrics
                        fetchClimateSummaryData(newMetrics);
                        
                        console.log("Using Live Weather Data:", weatherData);
                    }
                }

                // Fetch air quality data
                const airQualityResponse = await fetch(`/api/air-quality?lat=${mapCenter[0]}&lon=${mapCenter[1]}`);
                if (airQualityResponse.ok) {
                    const airData = await airQualityResponse.json();
                    const newAirQualityData = {
                        pm10: airData.pm10?.[0] || 0,
                        pm25: airData.pm2_5?.[0] || 0,
                    };
                    setAirQualityData(newAirQualityData);
                    
                    // Immediately fetch air quality analysis
                    if (newAirQualityData.pm10 > 0 || newAirQualityData.pm25 > 0) {
                        fetchAirQualityAnalysisData(newAirQualityData);
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
                setHasInitialized(true);
            }
        }
        fetchAllData();
    }, []);

    async function fetchClimateSummaryData(metricsData: any) {
        setSummaryLoading(true);
        try {
            const response = await fetch('/api/climate-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    temperature: metricsData.temperature,
                    humidity: metricsData.humidity,
                    rainfall: metricsData.rainfall,
                    windSpeed: metricsData.windSpeed,
                    location: currentLocation,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Climate Summary Response:", data);
                setClimateSummary(data.summary);
            } else {
                console.error("Climate summary error:", response.status);
                setClimateSummary('Unable to load climate analysis at this moment.');
            }
        } catch (err) {
            console.error("Error fetching climate summary:", err);
            setClimateSummary('Error loading climate analysis.');
        } finally {
            setSummaryLoading(false);
        }
    }

    async function fetchAirQualityAnalysisData(aqData: any) {
        setAirQualityLoading(true);
        try {
            const response = await fetch('/api/air-quality-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pm10: aqData.pm10,
                    pm25: aqData.pm25,
                    location: currentLocation,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Air Quality Analysis Response:", data);
                setAirQualityAnalysis(data.analysis);
            } else {
                console.error("Air quality analysis error:", response.status);
            }
        } catch (err) {
            console.error("Error fetching air quality analysis:", err);
        } finally {
            setAirQualityLoading(false);
        }
    }

    async function handleMapClick(lat: number, lng: number) {
        setLoading(true);
        try {
            // Update location name based on coordinates (reverse geocoding via Nominatim)
            setMapCenter([lat, lng]);
            try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2` , {
                    headers: { 'Accept': 'application/json', 'User-Agent': 'VRA-App/1.0' }
                });
                if (geoRes.ok) {
                    const geoJson = await geoRes.json();
                    const name = geoJson.name || geoJson.display_name || null;
                    const addr = geoJson.address || {};
                    const area = addr.county || addr.state || addr.region || addr.town || addr.village || addr.country || null;
                    setPlaceName(name);
                    setPlaceArea(area);
                    setCurrentLocation(name ? `${name}${area ? ` — ${area}` : ''}` : `Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                } else {
                    setPlaceName(null);
                    setPlaceArea(null);
                    setCurrentLocation(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
                }
            } catch (ge) {
                console.warn('Reverse geocoding failed', ge);
                setPlaceName(null);
                setPlaceArea(null);
                setCurrentLocation(`Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
            }

            // Fetch weather data for new location
            const weatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lng}`);
            if (weatherResponse.ok) {
                const weatherData = await weatherResponse.json();
                if (weatherData) {
                    const newMetrics = {
                        temperature: weatherData.temperature || WEATHER_METRICS.temperature,
                        humidity: weatherData.humidity || WEATHER_METRICS.humidity,
                        rainfall: weatherData.rainfall || WEATHER_METRICS.rainfall,
                        windSpeed: weatherData.windSpeed || WEATHER_METRICS.windSpeed,
                    };
                    setMetrics(newMetrics);
                    fetchClimateSummaryData(newMetrics);
                    console.log("Using Live Weather Data:", weatherData);
                }
            }

            // Fetch air quality data for new location
            const airQualityResponse = await fetch(`/api/air-quality?lat=${lat}&lon=${lng}`);
            if (airQualityResponse.ok) {
                const airData = await airQualityResponse.json();
                const newAirQualityData = {
                    pm10: airData.pm10?.[0] || 0,
                    pm25: airData.pm2_5?.[0] || 0,
                };
                setAirQualityData(newAirQualityData);

                if (newAirQualityData.pm10 > 0 || newAirQualityData.pm25 > 0) {
                    fetchAirQualityAnalysisData(newAirQualityData);
                }
            }
        } catch (err) {
            console.error("Error fetching data for new location:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Header Section */}
                <div className="mb-10">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 shadow-lg text-white">
                        <h1 className="text-5xl font-extrabold mb-2">{placeName ? `${placeName}` : currentLocation}</h1>
                        {placeArea && <p className="text-lg text-blue-100 mb-3">{placeArea}</p>}
                        <p className="text-blue-100">Click on the map to explore weather for different locations</p>
                        {placeName && (
                            <p className="text-sm text-blue-200 mt-3">📍 {mapCenter[0].toFixed(4)}°N, {mapCenter[1].toFixed(4)}°E</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Map & Weather */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Map Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden h-96 relative transition-all hover:shadow-xl">
                        <div className="absolute top-5 right-5 z-400 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur">
                            🗺️ Interactive Map
                        </div>
                        <MapComponent
                            center={mapCenter}
                            zoom={11}
                            onMapClick={(e: any) => handleMapClick(e.latlng.lat, e.latlng.lng)}
                        />
                    </div>

                    {/* Weather Cards */}
                    <div className="grid grid-cols-4 gap-4">
                        <WeatherCard title="Temp" value={metrics.temperature} unit="°C" icon={Thermometer} colorClass="text-orange-500" />
                        <WeatherCard title="Humidity" value={metrics.humidity} unit="%" icon={Droplets} colorClass="text-indigo-500" />
                        <WeatherCard title="Wind" value={metrics.windSpeed} unit="km/h" icon={Wind} colorClass="text-cyan-500" />
                        <WeatherCard title="Rain" value={metrics.rainfall} unit="mm" icon={CloudRain} colorClass="text-blue-500" />
                    </div>

                    {/* Forecast Timeline */}
                    <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-lg">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-2 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg text-blue-950">Next 24 Hours Forecast</h3>
                        </div>
                        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                            {FORECAST_DATA.map((item, i) => (
                                <div key={i} className="shrink-0 w-24 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 flex flex-col items-center text-center hover:shadow-md transition-all">
                                    <span className="text-xs text-slate-600 font-semibold mb-1">{item.time}</span>
                                    <CloudRain className="h-6 w-6 text-blue-500 mb-2" />
                                    <span className="font-bold text-blue-950">{item.rain}mm</span>
                                    <span className="text-xs text-slate-500">{item.temp}°C</span>
                                </div>
                            ))}
                            {/* Placeholders for extended forecast */}
                            {[...Array(3)].map((_, i) => (
                                <div key={`fut-${i}`} className="shrink-0 w-24 p-4 rounded-xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-center opacity-50">
                                    <span className="text-xs text-slate-400 font-semibold">Later</span>
                                    <span className="text-xs text-slate-400 mt-2">---</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Rainfall & Temperature Trend Toggle */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                        {/* Toggle Button */}
                        <div className="flex items-center p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
                            <div className="flex gap-3 flex-1">
                                <button
                                    onClick={() => setShowTemperatureTrend(false)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                                        !showTemperatureTrend
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <CloudRain className="h-5 w-5" />
                                    Rainfall Trend
                                </button>
                                <button
                                    onClick={() => setShowTemperatureTrend(true)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                                        showTemperatureTrend
                                            ? 'bg-orange-500 text-white shadow-md'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    <TrendingUp className="h-5 w-5" />
                                    Temperature Trend
                                </button>
                            </div>
                        </div>
                        {/* Chart Content */}
                        <div className="p-7">
                            {showTemperatureTrend ? (
                                <TemperatureTrendChart />
                            ) : (
                                <RainfallChart />
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics & Insights */}
                <div className="space-y-6">
                    {/* Daily Climate Summary */}
                    <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-7 shadow-lg text-white relative overflow-hidden group transition-all hover:shadow-2xl">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                        <div className="absolute -bottom-5 -left-5 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                                    <Cloud className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold text-xl">Daily Climate Summary</h3>
                            </div>
                            {summaryLoading ? (
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-4">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="text-sm font-medium">Analyzing weather conditions...</span>
                                </div>
                            ) : (
                                <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20">
                                    <p className="text-sm leading-relaxed font-medium">
                                        {climateSummary || 'Loading climate analysis...'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Air Quality Analysis */}
                    <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-7 shadow-lg text-white relative overflow-hidden group transition-all hover:shadow-2xl">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                        <div className="absolute -bottom-5 -left-5 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-white/20 backdrop-blur p-3 rounded-lg">
                                    <AlertCircle className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="font-bold text-xl">Air Quality Analysis</h3>
                            </div>
                            {airQualityLoading ? (
                                <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-4">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="text-sm font-medium">Analyzing air quality...</span>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/20 mb-4">
                                        <p className="text-sm leading-relaxed font-medium">
                                            {airQualityAnalysis || 'Loading air quality analysis...'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white/15 backdrop-blur rounded-lg p-4 border border-white/20 text-center hover:bg-white/20 transition">
                                            <p className="text-xs font-semibold text-white/70 mb-1">PM2.5</p>
                                            <p className="text-2xl font-bold">{airQualityData.pm25.toFixed(1)}</p>
                                            <p className="text-xs text-white/60">μg/m³</p>
                                        </div>
                                        <div className="bg-white/15 backdrop-blur rounded-lg p-4 border border-white/20 text-center hover:bg-white/20 transition">
                                            <p className="text-xs font-semibold text-white/70 mb-1">PM10</p>
                                            <p className="text-2xl font-bold">{airQualityData.pm10.toFixed(1)}</p>
                                            <p className="text-xs text-white/60">μg/m³</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
            </div>
        </div>
    );
}
