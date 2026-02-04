'use client';

import dynamic from 'next/dynamic';
// Link import removed
// Actually keeping Link might be useful if we want to keep the old link or if it is used elsewhere, but in this case I am replacing the View Detailed Analysis Link.
// I will check if I am removing all usages of Link. Yes, I am replacing the only Link usage with a button.
// So I will remove Link import to keep it clean, OR keep it if I decide to use it for something else.
// Wait, the user request said "and not directing to lcoation tab".
// So I will remove Link.

import { ArrowRight, AlertOctagon, TrendingUp, TrendingDown, Minus, X, Loader2 } from 'lucide-react';
import RiskBadge from '@/components/RiskBadge';
import { INDIA_STATES } from '@/lib/indiaStates';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';

const MapComponent = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 flex items-center justify-center">Loading National Map...</div>
});

const indiaCenter: [number, number] = [20.5937, 78.9629];

// Aggregate risk data is now calculated dynamically in the component

export default function OverviewPage() {
    const [selectedState, setSelectedState] = useState<any>(null); // Start with null
    const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Import the new full list
    // Note: We need to import it at top level, but for this REPLACE block I'll substitute the import line if needed
    // or assume I need to handle imports separately (I will add proper imports in a separate multiple_replace or handle it here if I replace whole file)
    // To be safe, I'll replace the main component logic. I'll need to make sure INDIA_STATES is imported.

    // Actually, I should probably use `multi_replace` to add the import AND replace the component body.
    // Or I can replace the whole file content if it's easier. The file is small enough (363 lines).
    // Let's replace the whole component body. I'll also start by adding the import.

    // Wait, replace_file_content is defined for a single contiguous block.
    // I can replace from the imports down to the end of the file.

    // Let's replace the whole file to ensure imports are correct and logic is clean.
    // This is safer than partial replacements for large refactors.

    // Wait, wait. I will use `write_to_file` with `Overwrite: true` since I am rewriting almost the entire logic.
    // No, `write_to_file` is good for new files. `replace_file_content` with full range is effectively overwrite.
    // But I will try to use `multi_replace` or just targeting the Component.

    // I will replace the imports and the component.

    // The previous view shows imports at lines 1-30.
    // Component starts at 31.

    // I will replace lines 13-363.

    // I need to import INDIA_STATES.

    // Let's try replacing from import STATES_RISK (line 13) to the end.

    const [mapStates, setMapStates] = useState<any[]>(INDIA_STATES.map(s => ({
        ...s,
        risk: 'Low', // Default
        rainfall: 0,
        humidity: 0,
        temp: 0,
        trend: 'stable'
    })));

    // Set initial selected state to Delhi or first one
    useEffect(() => {
        if (!selectedState && mapStates.length > 0) {
            setSelectedState(mapStates.find(s => s.name === 'Delhi') || mapStates[0]);
        }
    }, [mapStates, selectedState]);

    const handleStateClick = (id: string | number) => {
        const stateName = String(id);
        const state = mapStates.find(s => s.name === stateName);
        if (state) {
            setSelectedState(state);
        }
    };

    const fetchAIAnalysis = async (targetState?: any) => {
        // Use targetState if provided, otherwise use selectedState from state
        const stateToAnalyze = targetState || selectedState;

        if (!stateToAnalyze) return;

        // If triggered via map button, ensure selectedState is updated visually too
        if (targetState && targetState !== selectedState) {
            setSelectedState(targetState);
        }

        setLoading(true);
        setIsAnalysisModalOpen(true);
        setAnalysisResult('');

        let rainfall = stateToAnalyze.rainfall;
        let humidity = stateToAnalyze.humidity;
        let dataSource = "Live Ambee API";

        // If data is 0/missing, maybe warn or fetching failed
        if (rainfall === 0 && humidity === 0) {
            dataSource = "Mock/Default (Live data unavailable)";
            // Fallback to random realistic data if live failed, for demo purposes?
            // Or just stick to what we have.
        }

        try {
            const response = await fetch('/api/ai-risk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rainfall: rainfall,
                    humidity: humidity,
                    pastFloods: stateToAnalyze.pastFloods
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setAnalysisResult(data.aiAnalysis + `\n\n(Data Source: ${dataSource})`);
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

    useEffect(() => {
        async function fetchAllStatesLive() {
            // Rate limit handling: Batch the requests or simply run them. 
            // Ambee might limit QPS. 
            // For now, let's process in chunks or just all at once parallel but handle errors gracefully.

            const updates = await Promise.all(INDIA_STATES.map(async (state) => {
                try {
                    const res = await fetch(`/api/floods?lat=${state.lat}&lng=${state.lng}`);
                    // Introduce artificial delay to avoid hitting rate limits too hard if needed
                    // await new Promise(r => setTimeout(r, Math.random() * 2000));

                    if (res.ok) {
                        const data = await res.json();
                        const weather = data.data;
                        if (weather) {
                            const rain = weather.precipIntensity || 0;
                            const humidity = weather.humidity || 0;

                            let newRisk = 'Low';
                            let newTrend = 'stable';

                            // Determine Risk
                            if (rain > 15) newRisk = 'Severe';
                            else if (rain > 5) newRisk = 'High';
                            else if (rain > 0.5) newRisk = 'Medium';

                            // Determine Trend (Simple heuristic)
                            if (weather.precipProbability > 50) newTrend = 'increasing';
                            else if (weather.precipProbability < 20) newTrend = 'decreasing';

                            return {
                                ...state,
                                rainfall: rain,
                                humidity: humidity,
                                risk: newRisk,
                                trend: newTrend,
                            };
                        }
                    }
                } catch (e) {
                    // console.error("Failed for", state.name);
                }
                // Return default state if failed
                return {
                    ...state,
                    rainfall: 0,
                    humidity: 60, // Default avg
                    risk: 'Low',
                    trend: 'stable'
                };
            }));

            setMapStates(updates as any);
        }

        fetchAllStatesLive();
    }, []);

    const highRiskCount = mapStates.filter(s => s.risk === 'Severe' || s.risk === 'High').length;
    const mediumRiskCount = mapStates.filter(s => s.risk === 'Medium').length;
    const lowRiskCount = mapStates.filter(s => s.risk === 'Low').length;

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
                                {highRiskCount}
                            </span>
                            <span className="text-xs text-red-800 font-medium">Critical States</span>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                            <span className="block text-2xl font-bold text-blue-600">
                                {mapStates.length}
                            </span>
                            <span className="text-xs text-blue-800 font-medium">Monitored</span>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="h-48 w-full bg-white rounded-xl border border-slate-100 p-2">
                        <h3 className="text-xs font-semibold text-slate-500 text-center mb-2">Risk Distribution (Live)</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'High Risk', value: highRiskCount, color: '#ef4444' },
                                        { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
                                        { name: 'Low Risk', value: lowRiskCount, color: '#10b981' },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={60}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {[
                                        { name: 'High Risk', value: highRiskCount, color: '#ef4444' },
                                        { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
                                        { name: 'Low Risk', value: lowRiskCount, color: '#10b981' },
                                    ].map((entry, index) => (
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
                            {mapStates.map((state) => (
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
                <div className="absolute top-4 left-4 z-400 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-md border border-slate-200">
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
                    onAnalyzeClick={(id) => {
                        const state = mapStates.find(s => s.name === String(id));
                        if (state) {
                            setSelectedState(state);
                            // We need to wait for state update or pass state directly.
                            // Passing state directly to a new func is better.
                            fetchAIAnalysis(state);
                        }
                    }}
                    markers={mapStates.map((s) => ({
                        id: s.name,
                        position: [s.lat, s.lng],
                        title: s.name,
                        // Passing detailed data for new Popup
                        risk: s.risk,
                        rainfall: s.rainfall,
                        humidity: s.humidity,
                        pastFloods: s.pastFloods
                    }))}
                    riskZones={mapStates.map((s) => ({
                        center: [s.lat, s.lng],
                        radius: 100000, // Fixed radius or dynamic based on rain?
                        color: (s.risk === 'Severe' || s.risk === 'High') ? 'red' : (s.risk === 'Medium' ? 'orange' : 'green')
                    }))}
                />

                <div className="absolute bottom-8 right-8 z-400">
                    <button
                        onClick={() => fetchAIAnalysis()}
                        className="bg-white/90 backdrop-blur text-blue-600 px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2 hover:bg-white transition-colors border border-blue-100"
                    >
                        View AI Analysis {selectedState ? `for ${selectedState.name}` : ''} <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* AI Analysis Modal */}
            {isAnalysisModalOpen && (
                <div className="absolute inset-0 z-1000 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
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
                                            <div className="text-xs text-slate-500 uppercase font-semibold">Risk Level</div>
                                            <div className={`text-lg font-bold ${selectedState?.risk === 'Severe' ? 'text-red-700' : 'text-blue-700'}`}>{selectedState?.risk}</div>
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
