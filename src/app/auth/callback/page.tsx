'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('Error setting session:', error);
            router.push('/login?error=auth_error');
            return;
          }

          // Clean redirect to dashboard without tokens in URL
          router.replace('/dashboard');
        } else {
          // No tokens found, redirect to login
          router.push('/login?error=no_tokens');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/login?error=callback_error');
      }
    };

    handleAuthCallback();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-700">Completing sign in...</span>
        </div>
      </div>
    </div>
  );
}
