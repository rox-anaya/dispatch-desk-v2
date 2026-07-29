'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  depIcao: string;
  arrIcao: string;
}

const AIRPORT_COORDS: Record<string, [number, number]> = {
  VOBL: [13.1979, 77.7063],
  VABB: [19.0887, 72.8679],
  OMDB: [25.2532, 55.3657],
  EGLL: [51.4700, -0.4543],
  KJFK: [40.6413, -73.7781],
  WSSS: [1.3644, 103.9915],
  VIDP: [28.5562, 77.1000],
  VOMM: [13.0827, 80.2707],
  EDDF: [50.0333, 8.5706],
  LFPG: [49.0097, 2.5479],
};

export default function RouteMap({ depIcao, arrIcao }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    const upperDep = depIcao?.toUpperCase();
    const upperArr = arrIcao?.toUpperCase();

    const depCoords = AIRPORT_COORDS[upperDep] || [19.0887, 72.8679];
    const arrCoords = AIRPORT_COORDS[upperArr] || [25.2532, 55.3657];

    if (!mapInstanceRef.current) {
      const centerLat = (depCoords[0] + arrCoords[0]) / 2;
      const centerLon = (depCoords[1] + arrCoords[1]) / 2;

      const map = L.map(mapRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView([centerLat, centerLon], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.marker(depCoords).addTo(map).bindPopup(`<b>${upperDep || 'DEP'}</b> (Departure)`);
      L.marker(arrCoords).addTo(map).bindPopup(`<b>${upperArr || 'ARR'}</b> (Arrival)`);

      const polyline = L.polyline([depCoords, arrCoords], {
        color: '#3b82f6',
        weight: 3,
        dashArray: '6, 6',
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [depIcao, arrIcao]);

  return (
    <div 
      ref={mapRef} 
      style={{ height: '320px', width: '100%' }} 
      className="rounded-lg z-0 border border-slate-800 bg-slate-950" 
    />
  );
}
