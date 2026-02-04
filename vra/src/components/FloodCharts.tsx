'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, LineChart, Line } from 'recharts';

export function RainfallChart() {
    const data = [
        { name: 'Mon', mm: 40 },
        { name: 'Tue', mm: 30 },
        { name: 'Wed', mm: 20 },
        { name: 'Thu', mm: 25 },
        { name: 'Fri', mm: 90 },
        { name: 'Sat', mm: 120 },
        { name: 'Sun', mm: 15 },
    ];

    return (
        <div className="h-64 w-full min-h-64" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="mm" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function ImpactGauge({ percentage }: { percentage: number }) {
    const data = [
        { name: 'Impact', value: percentage, fill: '#ef4444' },
        { name: 'Safe', value: 100 - percentage, fill: '#e2e8f0' }
    ];

    return (
        <div className="h-48 w-full flex items-center justify-center relative min-h-48" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart innerRadius="70%" outerRadius="100%" data={data} startAngle={90} endAngle={-270}>
                    <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-slate-800">{percentage}%</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Impact</span>
            </div>
        </div>
    );
}

export function TemperatureTrendChart() {
    const data = [
        { time: '12 AM', temp: 18 },
        { time: '3 AM', temp: 16 },
        { time: '6 AM', temp: 15 },
        { time: '9 AM', temp: 20 },
        { time: '12 PM', temp: 25 },
        { time: '3 PM', temp: 28 },
        { time: '6 PM', temp: 26 },
        { time: '9 PM', temp: 22 },
    ];

    return (
        <div className="h-64 w-full min-h-64" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                        formatter={(value) => [`${value}°C`, 'Temperature']}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="temp" 
                        stroke="#f97316" 
                        dot={{ fill: '#f97316', r: 4 }} 
                        activeDot={{ r: 6 }}
                        strokeWidth={3}
                        isAnimationActive={true}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
