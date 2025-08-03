import "./globals.css";
import Footer from "@/components/Footer";
import { Inter, Poppins } from 'next/font/google';

// app/layout.tsx
import { ReactNode } from 'react';

// Configure the font
const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {/* Optional: Add navbar later */}
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}

