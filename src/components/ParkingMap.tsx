'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom parking icon
const parkingIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6" width="24" height="24">
      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">P</text>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

interface ParkingSpot {
  id: number;
  name: string;
  location: [number, number];
  available: number;
  total: number;
  price: string;
  distance: string;
}

interface ParkingMapProps {
  searchLocation: string;
}

export default function ParkingMap({ searchLocation }: ParkingMapProps) {
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock data for parking spots - in a real app, this would come from an API
  const generateMockSpots = (center: [number, number]): ParkingSpot[] => {
    const spots: ParkingSpot[] = [];
    const spotNames = [
      'Central Plaza Parking',
      'Main Street Garage',
      'City Center Lot',
      'Downtown Parking Hub',
      'Metro Station Parking',
      'Shopping Center Garage',
      'Business District Lot',
      'Riverside Parking',
    ];

    for (let i = 0; i < 8; i++) {
      const latOffset = (Math.random() - 0.5) * 0.02; // ~1km radius
      const lngOffset = (Math.random() - 0.5) * 0.02;
      
      spots.push({
        id: i + 1,
        name: spotNames[i],
        location: [center[0] + latOffset, center[1] + lngOffset],
        available: Math.floor(Math.random() * 50) + 1,
        total: Math.floor(Math.random() * 50) + 51,
        price: `$${(Math.random() * 10 + 5).toFixed(2)}/hr`,
        distance: `${(Math.random() * 2 + 0.1).toFixed(1)} km`,
      });
    }
    return spots;
  };

  // Simulate geocoding for the search location
  const geocodeLocation = (location: string): [number, number] => {
    const locations: { [key: string]: [number, number] } = {
      'downtown': [40.7589, -73.9851],
      'mall': [40.7505, -73.9934],
      'airport': [40.6413, -73.7781],
      'central park': [40.7829, -73.9654],
      'times square': [40.7580, -73.9855],
      'colombo': [6.9271, 79.8612],
      'queens': [40.7282, -73.7949],
    };

    const searchKey = location.toLowerCase();
    for (const [key, coords] of Object.entries(locations)) {
      if (searchKey.includes(key)) {
        return coords;
      }
    }
    
    // Default fallback with slight variation
    return [40.7128 + (Math.random() - 0.5) * 0.1, -74.0060 + (Math.random() - 0.5) * 0.1];
  };

  useEffect(() => {
    if (searchLocation) {
      const newCenter = geocodeLocation(searchLocation);
      setMapCenter(newCenter);
      setParkingSpots(generateMockSpots(newCenter));
    }
  }, [searchLocation]);

  useEffect(() => {
    // Initialize with default spots
    setParkingSpots(generateMockSpots(mapCenter));
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-gray-600">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Map Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Parking Spots {searchLocation && `near "${searchLocation}"`}
          </h2>
          <p className="text-gray-600 mt-1">
            Found {parkingSpots.length} parking locations
          </p>
        </div>

        {/* Map Container */}
        <div className="h-96 relative">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {parkingSpots.map((spot) => (
              <Marker key={spot.id} position={spot.location} icon={parkingIcon}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold text-lg">{spot.name}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Available:</span> {spot.available}/{spot.total} spots
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Price:</span> {spot.price}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Distance:</span> {spot.distance}
                      </p>
                    </div>
                    <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors">
                      Reserve Spot
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Parking Spots List */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Available Parking Spots</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parkingSpots.map((spot) => (
              <div key={spot.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800">{spot.name}</h4>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Available: <span className="font-medium">{spot.available}/{spot.total}</span></p>
                  <p>Price: <span className="font-medium">{spot.price}</span></p>
                  <p>Distance: <span className="font-medium">{spot.distance}</span></p>
                </div>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                  Reserve
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
