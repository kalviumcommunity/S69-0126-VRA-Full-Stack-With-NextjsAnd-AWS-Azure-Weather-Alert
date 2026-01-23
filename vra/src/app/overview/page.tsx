'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link'; // Still used? Potentially check if we need to remove unused import if Link is fully removed.
// Actually keeping Link might be useful if we want to keep the old link or if it is used elsewhere, but in this case I am replacing the View Detailed Analysis Link.
// I will check if I am removing all usages of Link. Yes, I am replacing the only Link usage with a button.
// So I will remove Link import to keep it clean, OR keep it if I decide to use it for something else.
// Wait, the user request said "and not directing to lcoation tab".
// So I will remove Link.

import { ArrowRight, AlertOctagon, TrendingUp, TrendingDown, Minus, X, Loader2 } from 'lucide-react';
import RiskBadge from '@/components/RiskBadge';
import { STATES_RISK } from '@/lib/mockData';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState } from 'react';

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
    const [selectedState, setSelectedState] = useState<any>(STATES_RISK[0]);
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleStateClick = (id: string | number) => {
        const stateName = String(id);
        const state = STATES_RISK.find(s => s.name === stateName);
        if (state) {
            setSelectedState(state);
        }
    };

    const fetchAIAnalysis = async () => {
        if (!selectedState) return;
        setLoading(true);
        setIsAnalysisModalOpen(true);
        setAnalysisResult('');

        try {
            const response = await fetch('/api/ai-risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rainfall: selectedState.rainfall,
                    humidity: selectedState.humidity,
                    pastFloods: selectedState.pastFloods
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysisResult(data.aiAnalysis);
            } else {
                setAnalysisResult("Failed to fetch analysis. Please try again.");
            }
        } catch (error) {
            console.error("Error fetching AI analysis:", error);
            setAnalysisResult("An error occurred while fetching the analysis.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row bg-slate-50 overscroll-none overflow-hidden relative">

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
                                <div
                                    key={state.name}
                                    onClick={() => handleStateClick(state.name)}
                                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedState?.name === state.name ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-300' : 'border-slate-100 hover:bg-slate-50'}`}
                                >
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
                    {selectedState && (
                        <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-blue-800">
                            Selected: <span className="font-bold">{selectedState.name}</span>
                        </div>
                    )}
                </div>

                <MapComponent
                    center={indiaCenter}
                    zoom={5}
                    onMarkerClick={handleStateClick}
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
                    <button
                        onClick={fetchAIAnalysis}
                        className="bg-white/90 backdrop-blur text-blue-600 px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2 hover:bg-white transition-colors border border-blue-100"
                    >
                        View AI Analysis {selectedState ? `for ${selectedState.name}` : ''} <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* AI Analysis Modal */}
            {isAnalysisModalOpen && (
                <div className="absolute inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div>
                                <h2 className="text-xl font-bold text-blue-950 flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                                        <AlertOctagon className="h-5 w-5" />
                                    </div>
                                    AI Risk Analysis: {selectedState?.name}
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">Based on real-time meteorological data processing</p>
                            </div>
                            <button
                                onClick={() => setIsAnalysisModalOpen(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                                    <p className="text-slate-500 animate-pulse">Analyzing satellite data & historical patterns...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Input Data Summary */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                                            <div className="text-xs text-slate-500 uppercase font-semibold">Rainfall</div>
                                            <div className="text-lg font-bold text-blue-700">{selectedState?.rainfall} mm</div>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                                            <div className="text-xs text-slate-500 uppercase font-semibold">Humidity</div>
                                            <div className="text-lg font-bold text-blue-700">{selectedState?.humidity}%</div>
                                        </div>
                                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
                                            <div className="text-xs text-slate-500 uppercase font-semibold">Disaster Impact</div>
                                            <div className="text-lg font-bold text-red-700">{selectedState?.disasterPercent}%</div>
                                        </div>
                                    </div>

                                    {/* AI Output */}
                                    <div className="prose prose-slate max-w-none">
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 whitespace-pre-wrap leading-relaxed shadow-inner">
                                            {analysisResult}
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-400 italic text-center border-t pt-4">
                                        Disclaimer: AI-generated risk assessment. Verify with official authorities before taking action.
                                    </div>
                                </div>
                            )}
                        </div>

                        {!loading && (
                            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <button
                                    onClick={() => setIsAnalysisModalOpen(false)}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                                >
                                    Close Analysis
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
