'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import ParkingMap from "@/components/ParkingMap";

export default function SpotsPage() {
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = (location: string) => {
    setSearchLocation(location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Search Section */}
      <div className="pt-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Find Parking Spots
          </h1>
          <p className="text-lg text-gray-600">
            Search for available parking spaces in your desired location
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Map Section */}
      <div className="py-8">
        <ParkingMap searchLocation={searchLocation} />
      </div>
    </div>
  );
}
