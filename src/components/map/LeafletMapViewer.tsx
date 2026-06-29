import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReactDOMServer from 'react-dom/server';
import { MapPin } from 'lucide-react';

interface LeafletMapViewerProps {
  lat: number;
  lng: number;
  zoom?: number;
  title?: string;
  markers?: { lat: number; lng: number; title: string; type?: 'scenic' | 'stop' | 'spiritual' }[];
  directions?: {
    origin: { lat: number; lng: number };
    destination: { lat: number; lng: number };
    waypoints?: { location: { lat: number; lng: number }; stopover: boolean }[];
  };
}

// Custom Leaflet Icon built with Lucide React
const createCustomIcon = (type: string = 'stop') => {
  const color = type === 'spiritual' ? '#eab308' : type === 'scenic' ? '#ec4899' : '#3b82f6';
  const size = 28;
  
  return L.divIcon({
    html: ReactDOMServer.renderToString(
      <div style={{ color, filter: 'drop-shadow(0 0 8px currentColor)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MapPin size={size} strokeWidth={2.5} fill="currentColor" />
      </div>
    ),
    className: 'custom-leaflet-icon bg-transparent border-none',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
    popupAnchor: [0, -size]
  });
};

const MapUpdater = ({ center, zoom, bounds }: { center: [number, number], zoom: number, bounds: L.LatLngBounds | null }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, bounds, map]);
  return null;
};

export const LeafletMapViewer: React.FC<LeafletMapViewerProps> = ({
  lat, lng, zoom = 12, title, markers = [], directions
}) => {
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!directions) {
        // Just fit bounds to markers if no directions
        if (markers.length > 0) {
          const newBounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
          setBounds(newBounds);
        }
        return;
      }

      try {
        const waypointsStr = directions.waypoints 
          ? directions.waypoints.map(w => `${w.location.lng},${w.location.lat}`).join(';') 
          : '';
        
        const coords = [
          `${directions.origin.lng},${directions.origin.lat}`,
          ...(waypointsStr ? [waypointsStr] : []),
          `${directions.destination.lng},${directions.destination.lat}`
        ].join(';');

        // OSRM Public API
        const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`);
        const data = await response.json();

        if (data.code === 'Ok' && data.routes.length > 0) {
          const geometry = data.routes[0].geometry.coordinates;
          // GeoJSON is [lng, lat], Leaflet wants [lat, lng]
          const latLngs = geometry.map((coord: number[]) => [coord[1], coord[0]] as [number, number]);
          setRouteCoordinates(latLngs);
          
          if (latLngs.length > 0) {
            setBounds(L.latLngBounds(latLngs));
          }
        }
      } catch (err) {
        console.error("Failed to fetch OSRM route", err);
      }
    };

    fetchRoute();
  }, [directions, markers]);

  return (
    <div className="w-full h-full relative" style={{ zIndex: 10 }}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', backgroundColor: '#060B16' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater center={[lat, lng]} zoom={zoom} bounds={bounds} />

        {/* Draw OSRM Route */}
        {routeCoordinates.length > 0 && (
          <Polyline 
            positions={routeCoordinates} 
            color="#3b82f6" 
            weight={4} 
            opacity={0.8}
            className="animate-pulse shadow-blue-500"
          />
        )}

        {/* Draw Markers */}
        {markers.map((marker, idx) => (
          <Marker 
            key={idx} 
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(marker.type)}
          >
            <Popup className="custom-popup bg-black border border-white/10 text-white rounded-xl">
              <div className="p-1">
                <strong className="text-sm font-bold text-white">{marker.title}</strong>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Fallback Single Marker */}
        {markers.length === 0 && (
          <Marker position={[lat, lng]} icon={createCustomIcon()}>
            {title && (
              <Popup className="custom-popup bg-black border border-white/10 text-white rounded-xl">
                <div className="p-1 text-sm font-bold">{title}</div>
              </Popup>
            )}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};
