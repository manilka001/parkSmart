import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Initiate Google OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('Google OAuth initiation error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the OAuth URL for frontend to redirect to
    return NextResponse.json({ url: data.url }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error in Google OAuth:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
