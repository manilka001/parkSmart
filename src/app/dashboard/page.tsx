'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Check if there are tokens in the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          // Set the session with tokens from URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error setting session:', error);
            router.push('/login');
            return;
          }

          // Clean the URL by removing the hash
          window.history.replaceState(null, '', window.location.pathname);
          setUser(data.user);
        } else {
          // Check for existing session
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            setUser(user);
          } else {
            router.push('/login');
            return;
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    handleAuth();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return;
      }
      
      router.push('/login');
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome{user?.email ? `, ${user.email}` : ''} to your parking management dashboard!
              </p>
            </div>
            
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Sign Out
            </button>
          </div>
          
          <div className="border-t pt-6">
            <p className="text-gray-700">This is your dashboard content area.</p>
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <p className="text-green-800 text-sm">
                ✅ <strong>Success:</strong> You are now signed in with Google!
              </p>
              {user && (
                <div className="mt-2 text-sm text-green-700">
                  <p>User ID: {user.id}</p>
                  <p>Email: {user.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
