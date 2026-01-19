'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, AlertOctagon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import RiskBadge from '@/components/RiskBadge';
import { STATES_RISK } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MapComponent = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center">Loading National Map...</div>
});

const indiaCenter: [number, number] = [20.5937, 78.9629];

// Aggregate risk data for Pie Chart
const riskDistribution = [
    { name: 'High Risk', value: STATES_RISK.filter(s => s.risk === 'Severe' || s.risk === 'High').length, color: '#ef4444' },
    { name: 'Medium Risk', value: STATES_RISK.filter(s => s.risk === 'Medium').length, color: '#f59e0b' },
    { name: 'Low Risk', value: STATES_RISK.filter(s => s.risk === 'Low').length, color: '#10b981' },
];

export default function OverviewPage() {
    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 overscroll-none overflow-hidden">

            {/* Left Panel: Statistics & List (Scrollable) */}
            <div className="w-full md:w-1/3 lg:w-96 flex flex-col border-r border-slate-200 bg-white h-full shadow-lg z-10">
                <div className="p-6 border-b border-slate-200 bg-slate-50">
                    <h1 className="text-2xl font-bold text-blue-950">National Overview</h1>
                    <p className="text-slate-500 text-sm">Real-time flood status across states</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Summary Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                            <span className="block text-2xl font-bold text-red-600">
                                {STATES_RISK.filter(s => s.risk === 'Severe' || s.risk === 'High').length}
                            </span>
                            <span className="text-xs text-red-800 font-medium">Critical States</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                            <span className="block text-2xl font-bold text-blue-600">
                                {STATES_RISK.length}
                            </span>
                            <span className="text-xs text-blue-800 font-medium">Monitored</span>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-48 w-full bg-white rounded-xl border border-slate-100 p-2">
                        <h3 className="text-xs font-semibold text-slate-500 text-center mb-2">Risk Distribution</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* State List */}
                    <div>
                        <h3 className="font-semibold text-blue-950 mb-4 flex items-center gap-2">
                            <AlertOctagon className="h-4 w-4" /> State Risk Status
                        </h3>
                        <div className="space-y-3">
                            {STATES_RISK.map((state) => (
                                <div key={state.name} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div>
                                        <div className="font-medium text-blue-950">{state.name}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            Trend:
                                            {state.trend === 'increasing' && <TrendingUp className="h-3 w-3 text-red-500" />}
                                            {state.trend === 'decreasing' && <TrendingDown className="h-3 w-3 text-green-500" />}
                                            {state.trend === 'stable' && <Minus className="h-3 w-3 text-slate-400" />}
                                        </div>
                                    </div>
                                    <RiskBadge level={state.risk as any} className="text-xs px-2 py-0.5" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel: Full Map */}
            <div className="flex-1 relative h-[50vh] md:h-full bg-slate-200">
                <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-slate-200">
                    <h2 className="font-bold text-slate-800">India Flood Heatmap</h2>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span> High Risk
                        <span className="w-3 h-3 rounded-full bg-orange-500"></span> Medium
                        <span className="w-3 h-3 rounded-full bg-green-500"></span> Low
                    </div>
                </div>

                <MapComponent
                    center={indiaCenter}
                    zoom={5}
                    // Adding mock markers for states - in real app would use GeoJSON
                    markers={STATES_RISK.map((s, i) => ({
                        id: s.name,
                        // Mock positions roughly distributed (just for demo visual)
                        position: [20 + (i * 2) * (i % 2 === 0 ? 1 : -1), 78 + (i * 2)],
                        title: s.name,
                        description: `Risk: ${s.risk} | Impact: ${s.disasterPercent}%`
                    }))}
                    // Mock risk zones
                    riskZones={STATES_RISK.map((s, i) => ({
                        center: [20 + (i * 2) * (i % 2 === 0 ? 1 : -1), 78 + (i * 2)],
                        radius: 150000,
                        color: s.risk === 'Severe' || s.risk === 'High' ? 'red' : s.risk === 'Medium' ? 'orange' : 'green'
                    }))}
                />

                <div className="absolute bottom-8 right-8 z-[400]">
                    <Link href="/location" className="bg-white/90 backdrop-blur text-blue-600 px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2 hover:bg-white transition-colors">
                        View Detailed Analysis <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

        </div>
    );
}
