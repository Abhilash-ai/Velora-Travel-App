import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

interface RoutingMachineProps {
  stops: { lat: number; lng: number }[];
  color: string;
}

export const RoutingMachine = ({ stops, color }: RoutingMachineProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || stops.length < 2) return;

    const waypoints = stops.map(stop => L.latLng(stop.lat, stop.lng));

    const routingControl = L.Routing.control({
      waypoints,
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false, // Hide the default text UI widget
      lineOptions: {
        styles: [{ color, weight: 4, opacity: 0.8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      // @ts-ignore - Leaflet Routing Machine types are incomplete for createMarker on the root options
      createMarker: () => null // Hide default markers since we use our custom markers
    }).addTo(map);

    // Hide the routing container div using CSS since `show: false` sometimes still renders an empty box
    const container = routingControl.getContainer();
    if (container) {
      container.style.display = 'none';
    }

    return () => {
      if (map && routingControl) {
        try {
          map.removeControl(routingControl);
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, [map, stops, color]);

  return null;
};
