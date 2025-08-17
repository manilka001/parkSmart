'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import Navbar from "@/components/Navbar";

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

// Fix for default markers in Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  contactNo: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
}

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    contactNo: '',
    coordinates: null
  });

  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);
    setFormData(prev => ({
      ...prev,
      coordinates: { lat, lng }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match on step 1
    if (currentStep === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match. Please check and try again.');
        return;
      }
      if (formData.password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
    }
    
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form submitted:', formData);
      
      try {
        // Send data to backend API
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        const data = await res.json();
        
        if (res.ok) {
          alert('Parking spot listing submitted successfully! Check your email for verification.');
        } else {
          alert(data.error || 'An error occurred during signup. Please try again.');
        }
      } catch (error) {
        console.error('Signup error:', error);
        alert('Network error. Please check your connection and try again.');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-8 pb-12">
        <div className="w-full px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              List Your Parking Spot
            </h1>
            <p className="text-lg text-gray-600">
              Share your parking space with others and earn extra income
            </p>
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    1
                  </div>
                  <span className="ml-2 text-sm font-medium">Personal Info</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                    2
                  </div>
                  <span className="ml-2 text-sm font-medium">Location & Contact</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg overflow-hidden rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-auto">
              {/* Left Side - Image */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-12 rounded-2xl">
                <div className="text-center text-white">
                  <div className="w-56 h-56 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <svg className="w-28 h-28 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
                  <p className="text-blue-100 mb-6">
                    Help drivers find parking while earning money from your unused space
                  </p>
                  <div className="text-sm text-blue-200">
                    Step {currentStep} of 2
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="p-8 flex flex-col">
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                  {currentStep === 1 && (
                    <div className="flex-1">
                      {/* Personal Information Section */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Personal Information
                        </h3>
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                                placeholder="Enter your first name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your last name"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your email address"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                              </label>
                              <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your password"
                                minLength={6}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                className={` text-gray-700 w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
                                  formData.confirmPassword && formData.password !== formData.confirmPassword 
                                    ? 'border-red-300 focus:ring-red-500' 
                                    : 'border-gray-300 focus:ring-blue-500'
                                }`}
                                placeholder="Confirm your password"
                              />
                              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Address Section */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Address Information
                        </h3>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.address.street}
                              onChange={(e) => handleInputChange('address.street', e.target.value)}
                              className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter street address"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                City
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.address.city}
                                onChange={(e) => handleInputChange('address.city', e.target.value)}
                                className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="City"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                State
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.address.state}
                                onChange={(e) => handleInputChange('address.state', e.target.value)}
                                className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="State"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                ZIP Code
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.address.zipCode}
                                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                                className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="ZIP"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="flex-1">
                      {/* Contact Section */}
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Contact Information
                        </h3>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contact Number
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.contactNo}
                            onChange={(e) => handleInputChange('contactNo', e.target.value)}
                            className="text-gray-700 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your contact number"
                          />
                        </div>
                      </div>

                      {/* Location Pinning Section */}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Pin Your Location
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Click on the map to pin the exact location of your parking spot
                        </p>
                        <div className="h-64 border border-gray-300 rounded-md overflow-hidden">
                          <MapContainer
                            center={mapCenter}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            //onClick={handleMapClick}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {markerPosition && (
                              <Marker position={markerPosition} />
                            )}
                          </MapContainer>
                        </div>
                        {formData.coordinates && (
                          <p className="text-sm text-green-600 mt-2">
                            Location pinned: {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-8 mt-auto">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrevious}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200"
                      >
                        Previous
                      </button>
                    ) : (
                      <div></div>
                    )}
                    
                    <button
                      type="submit"
                      className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {currentStep === 2 ? 'List My Parking Spot' : 'Next'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
