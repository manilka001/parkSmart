// app/page.tsx
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/bg2.jpg')", // Replace with your image path
      }}
    >
      {/* Creative Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex items-center min-h-screen px-8 lg:px-16">
        <div className="w-1/2 text-left">
          {/* Header */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Effortless Parking, Right at Your Fingertips
          </h1>

          {/* Paragraph */}
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg leading-relaxed">
            Experience seamless parking management with our smart solution.
            Find, reserve, and pay for parking spots instantly through our
            intuitive platform designed for the modern world.
          </p>

          {/* Optional CTA Buttons */}
          <div className="flex space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-800 font-semibold py-3 px-8 rounded-lg transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>

        {/* Right side - Empty for design */}
        <div className="w-1/2">
          {/* This space is intentionally left empty */}
        </div>
      </div>
    </div>
  );
}
