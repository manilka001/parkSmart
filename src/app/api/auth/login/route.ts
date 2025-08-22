// app/api/auth/login/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (data.user) {
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata
        }
      })
    }

    return NextResponse.json(
      { error: 'Login failed' },
      { status: 401 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}