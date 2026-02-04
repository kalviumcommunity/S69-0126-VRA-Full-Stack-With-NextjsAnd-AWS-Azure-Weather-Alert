'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    center: [number, number];
    zoom: number;
    markers?: Array<{
        id: number | string;
        position: [number, number];
        title: string;
        description?: string;
        risk?: string;
        rainfall?: number;
        humidity?: number;
        pastFloods?: string;
    }>;
    riskZones?: Array<{
        center: [number, number];
        radius: number;
        color: string;
    }>;
    onMarkerClick?: (id: string | number) => void;
    onAnalyzeClick?: (id: string | number) => void;
}

export default function MapComponent({ center, zoom, markers = [], riskZones = [], onMarkerClick, onAnalyzeClick }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>;
    }

    return (
        <MapContainer 
            center={center} 
            zoom={zoom} 
            style={{ height: '100%', width: '100%' }} 
            className="z-0"
        >
            <MapClickHandler onMapClick={onMapClick} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={marker.position}
                    eventHandlers={{
                        click: () => onMarkerClick?.(marker.id),
                    }}
                >
                    <Popup className="custom-popup">
                        <div className="p-1 min-w-[200px]">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-bold text-lg text-slate-800">{marker.title}</h3>
                                {marker.risk && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${marker.risk === 'Severe' ? 'bg-red-100 text-red-700' :
                                        marker.risk === 'High' ? 'bg-orange-100 text-orange-700' :
                                            marker.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {marker.risk} Risk
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1 text-sm text-slate-600">
                                <div className="flex justify-between">
                                    <span>Rainfall:</span>
                                    <span className="font-medium text-blue-600">{marker.rainfall || 0} mm</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Humidity:</span>
                                    <span className="font-medium text-blue-600">{marker.humidity || 0}%</span>
                                </div>

                                {marker.pastFloods && (
                                    <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                                        <span className="font-semibold text-slate-700">Past Event:</span>
                                        <div className="line-clamp-2">{marker.pastFloods}</div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAnalyzeClick?.(marker.id);
                                    }}
                                    className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-1"
                                >
                                    Analyze Risk
                                </button>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
            {riskZones.map((zone, idx) => (
                <Circle
                    key={idx}
                    center={zone.center}
                    radius={zone.radius}
                    pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.3 }}
                />
            ))}
        </MapContainer>
    );
}

// Helper component to handle map click events
function MapClickHandler({ onMapClick }: { onMapClick?: (e: any) => void }) {
    useMapEvents({
        click(e) {
            onMapClick?.(e);
        },
    });
    return null;
}
