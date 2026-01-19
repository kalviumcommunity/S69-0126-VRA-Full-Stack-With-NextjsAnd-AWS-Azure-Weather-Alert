'use client';

import dynamic from 'next/dynamic';
import { CloudRain, Wind, Droplets, Thermometer, Calendar } from 'lucide-react';
import WeatherCard from '@/components/WeatherCard';
import RiskBadge from '@/components/RiskBadge';
import { RainfallChart, ImpactGauge } from '@/components/FloodCharts';
import { WEATHER_METRICS, FORECAST_DATA } from '@/lib/mockData';

const MapComponent = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-slate-100 animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function LocationPage() {
    const locationName = "Ernakulam District, Kerala";
    const riskLevel = "High";
    const impactScore = 78;

    const mapCenter: [number, number] = [9.9312, 76.2673]; // Kochi co-ords

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-blue-950">{locationName}</h1>
                    <p className="text-slate-600">Updated: 10 mins ago</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                        <p className="text-sm text-slate-500">Current Risk Level</p>
                    </div>
                    <RiskBadge level={riskLevel} className="text-lg px-6 py-2" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Map & Weather */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Map Section */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-96 relative">
                        <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur px-3 py-1 rounded-md text-xs font-semibold shadow-sm">
                            Live Feed
                        </div>
                        <MapComponent
                            center={mapCenter}
                            zoom={11}
                            markers={[{ id: 1, position: mapCenter, title: locationName, description: `Risk Level: ${riskLevel}` }]}
                            riskZones={[{ center: mapCenter, radius: 5000, color: 'red' }]}
                        />
                    </div>

                    {/* Weather Cards Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <WeatherCard title="Rainfall" value={WEATHER_METRICS.rainfall} unit="mm" icon={CloudRain} colorClass="text-blue-500" />
                        <WeatherCard title="Temp" value={WEATHER_METRICS.temperature} unit="°C" icon={Thermometer} colorClass="text-orange-500" />
                        <WeatherCard title="Humidity" value={WEATHER_METRICS.humidity} unit="%" icon={Droplets} colorClass="text-indigo-500" />
                        <WeatherCard title="Wind" value={WEATHER_METRICS.windSpeed} unit="km/h" icon={Wind} colorClass="text-cyan-500" />
                    </div>

                    {/* Forecast Timeline */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-5 w-5 text-slate-500" />
                            <h3 className="font-semibold text-blue-950">Next 24 Hours Forecast</h3>
                        </div>
                        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                            {FORECAST_DATA.map((item, i) => (
                                <div key={i} className="flex-shrink-0 w-24 p-3 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                                    <span className="text-xs text-slate-500 mb-1">{item.time}</span>
                                    <CloudRain className="h-6 w-6 text-blue-500 mb-1" />
                                    <span className="font-bold text-blue-950">{item.rain}mm</span>
                                    <span className="text-xs text-slate-500">{item.temp}°C</span>
                                </div>
                            ))}
                            {/* Placeholders for extended forecast */}
                            {[...Array(3)].map((_, i) => (
                                <div key={`fut-${i}`} className="flex-shrink-0 w-24 p-3 rounded-lg bg-white border border-dashed border-slate-200 flex flex-col items-center justify-center text-center opacity-60">
                                    <span className="text-xs text-slate-400">Later</span>
                                    <span className="text-xs text-slate-400">---</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Analytics & Impact */}
                <div className="space-y-8">
                    {/* Impact Gauge */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-blue-950 mb-4">Disaster Impact Score</h3>
                        <ImpactGauge percentage={impactScore} />
                        <p className="text-center text-sm text-slate-500 mt-2">
                            High probability of infrastructure damage.
                        </p>
                    </div>

                    {/* Rainfall Chart */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold text-blue-950 mb-4">Weekly Rainfall Trend</h3>
                        <RainfallChart />
                    </div>

                    {/* Advisory List */}
                    <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                        <h3 className="font-semibold text-red-900 mb-4">Emergency Advisory</h3>
                        <ul className="space-y-3">
                            <li className="flex gap-2 text-sm text-red-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                                Evacuate low-lying areas immediately.
                            </li>
                            <li className="flex gap-2 text-sm text-red-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                                Keep emergency kits ready.
                            </li>
                            <li className="flex gap-2 text-sm text-red-800">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0"></span>
                                Avoid flood waters and stayed tuned to radio.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}
