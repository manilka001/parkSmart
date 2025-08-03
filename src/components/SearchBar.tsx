'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (location: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center pl-4 pr-2">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 12.414a1 1 0 00-.707-.293H11.5a6.5 6.5 0 10-1.414 1.414v1.207a1 1 0 00.293.707l4.243 4.243a1 1 0 001.414-1.414z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for parking spots by location (e.g., Downtown, Mall, Airport)"
            className="flex-1 py-4 px-2 text-gray-700 placeholder-gray-400 focus:outline-none text-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 font-medium transition-colors duration-200"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
}
