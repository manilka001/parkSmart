import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative z-10 bg-gray-900 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="ParkSmart Logo"
              className="h-50 w-auto"
            />
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-md font-medium transition-colors duration-300 hover:bg-white/10"
              >
                Home
              </Link>
              <Link
                href="/spots"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-md font-medium transition-colors duration-300 hover:bg-white/10"
              >
                Spots
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-md font-medium transition-colors duration-300 hover:bg-white/10"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-md font-medium transition-colors duration-300 hover:bg-white/10"
              >
                Contact us
              </Link>
              <Link
                href="/login"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-md font-medium transition-colors duration-300 hover:bg-white/10"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-white hover:text-blue-300 px-3 py-2 rounded-md text-md font-medium transition-colors duration-300 hover:bg-white/10"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-white hover:text-blue-300 focus:outline-none focus:text-blue-300">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
