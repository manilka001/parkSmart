// app/api/auth/signup/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (data.user) {
      // Check if email confirmation is required
      if (data.user.email_confirmed_at) {
        return NextResponse.json({
          message: 'Account created successfully',
          user: {
            id: data.user.id,
            email: data.user.email
          }
        })
      } else {
        return NextResponse.json({
          message: 'Please check your email and click the confirmation link to complete your registration.',
          requiresConfirmation: true
        })
      }
    }

    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 400 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}