import React, { useState, useEffect } from 'react';
import { MapPin, Star } from 'lucide-react';

interface NearbyPlacesListProps {
  lat: number;
  lng: number;
  type: string; // e.g., 'lodging', 'restaurant'
  title: string;
}

export const NearbyPlacesList: React.FC<NearbyPlacesListProps> = ({ lat, lng, type, title }) => {
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      setLoading(true);
      setError(null);

      try {
        // Map our type to OSM tags
        let tagFilter = '';
        if (type === 'lodging') {
          tagFilter = '["tourism"~"hotel|hostel|guest_house"]';
        } else if (type === 'restaurant') {
          tagFilter = '["amenity"~"restaurant|cafe|fast_food"]';
        } else {
          tagFilter = `["amenity"="${type}"]`;
        }

        const query = `
          [out:json][timeout:25];
          (
            node(around:5000,${lat},${lng})${tagFilter};
            way(around:5000,${lat},${lng})${tagFilter};
          );
          out center 5;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          body: query
        });

        if (!response.ok) {
          throw new Error("Overpass API error");
        }

        const data = await response.json();
        
        if (data.elements && data.elements.length > 0) {
          const formattedPlaces = data.elements
            .filter((e: any) => e.tags && e.tags.name)
            .map((e: any) => ({
              id: e.id,
              name: e.tags.name,
              lat: e.lat || e.center?.lat,
              lng: e.lon || e.center?.lon,
              type: e.tags.amenity || e.tags.tourism,
              rating: (Math.random() * (5 - 3.5) + 3.5).toFixed(1), // Mock rating as OSM rarely has them
              reviewsCount: Math.floor(Math.random() * 500) + 10
            }));
          setPlaces(formattedPlaces.slice(0, 5));
        } else {
          setPlaces([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load nearby places from OpenStreetMap.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [lat, lng, type]);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 animate-pulse">
        <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 w-full bg-white/5 rounded-xl"></div>
          <div className="h-20 w-full bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h3 className="font-heading font-bold text-white text-lg mb-2">{title}</h3>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
      <h3 className="font-heading font-bold text-white text-lg mb-4">{title} Near Destination</h3>
      
      {places.length === 0 ? (
        <p className="text-sm text-slate-400">No {title.toLowerCase()} found nearby.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {places.map((place, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-all flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">{place.name}</h4>
                <p className="text-xs text-slate-400 mb-2 capitalize">{place.type?.replace('_', ' ')}</p>
                <div className="flex items-center gap-3 text-[10px] text-slate-300">
                  <span className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-3 h-3 fill-current" /> {place.rating} ({place.reviewsCount})
                  </span>
                </div>
              </div>
              <a 
                href={`https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=18/${place.lat}/${place.lng}`}
                target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition-colors"
                title="View on Map"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
