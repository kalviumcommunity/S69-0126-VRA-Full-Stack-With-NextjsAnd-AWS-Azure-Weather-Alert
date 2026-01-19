'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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
    }>;
    riskZones?: Array<{
        center: [number, number];
        radius: number;
        color: string;
    }>;
}

export default function MapComponent({ center, zoom, markers = [], riskZones = [] }: MapProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>;
    }

    return (
        <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} className="z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {markers.map((marker) => (
                <Marker key={marker.id} position={marker.position}>
                    <Popup>
                        <div className="p-2">
                            <h3 className="font-bold">{marker.title}</h3>
                            {marker.description && <p>{marker.description}</p>}
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
