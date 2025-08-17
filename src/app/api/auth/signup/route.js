import { supabase } from '../../../../lib/supabaseClient';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  console.log('🚀 Signup API called at:', new Date().toISOString());
  
  try {
    // Validate environment variables
    console.log('🔍 Checking environment variables...');
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is not set');
      return Response.json({ error: 'Database configuration missing' }, { status: 500 });
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set');
      return Response.json({ error: 'Supabase configuration missing' }, { status: 500 });
    }
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ SUPABASE_ANON_KEY is not set');
      return Response.json({ error: 'Supabase authentication missing' }, { status: 500 });
    }
    
    console.log('✅ Environment variables check passed');
    console.log('📊 Database URL (masked):', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':****@'));

    // Test database connection
    console.log('🔌 Testing database connection...');
    try {
      await prisma.$connect();
      console.log('✅ Database connection successful');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError);
      return Response.json({ 
        error: 'Database connection failed', 
        details: dbError.message,
        code: 'DB_CONNECTION_ERROR'
      }, { status: 500 });
    }

    // Parse and validate request body
    console.log('📥 Parsing request body...');
    let body;
    try {
      body = await request.json();
      console.log('✅ Request body parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      return Response.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      address, 
      contactNo, 
      coordinates 
    } = body;

    // Validate required fields
    console.log('🔍 Validating required fields...');
    const requiredFields = { email, password, firstName, lastName };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return Response.json({ 
        error: 'Missing required fields', 
        missingFields 
      }, { status: 400 });
    }

    // Validate address structure if provided
    if (address) {
      const requiredAddressFields = ['street', 'city', 'state', 'zipCode'];
      const missingAddressFields = requiredAddressFields.filter(field => !address[field]);
      
      if (missingAddressFields.length > 0) {
        console.error('❌ Missing address fields:', missingAddressFields);
        return Response.json({ 
          error: 'Incomplete address information', 
          missingAddressFields 
        }, { status: 400 });
      }
    }

    console.log('✅ Field validation passed');
    console.log('📧 Email:', email);
    console.log('👤 Name:', `${firstName} ${lastName}`);

    // Step 1: Create user in Supabase Auth
    console.log('🔐 Creating user in Supabase Auth...');
    let authData;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        console.error('❌ Supabase Auth error:', error);
        return Response.json({ 
          error: error.message,
          code: 'SUPABASE_AUTH_ERROR'
        }, { status: 400 });
      }

      if (!data?.user?.id) {
        console.error('❌ No user ID returned from Supabase');
        return Response.json({ 
          error: 'Failed to create user - no user ID returned',
          code: 'NO_USER_ID'
        }, { status: 500 });
      }

      authData = data;
      console.log('✅ Supabase user created successfully');
      console.log('🆔 User ID:', data.user.id);

    } catch (authError) {
      console.error('❌ Supabase Auth exception:', authError);
      return Response.json({ 
        error: 'Authentication service error',
        details: authError.message,
        code: 'SUPABASE_AUTH_EXCEPTION'
      }, { status: 500 });
    }

    // Step 2: Store extra fields in Prisma DB
    console.log('💾 Storing user data in database...');
    try {
      const userData = {
        id: authData.user.id,
        email,
        firstName,
        lastName,
        contactNo: contactNo || null,
        coordinates: coordinates ? JSON.stringify(coordinates) : null
      };

      // Add address fields if provided
      if (address) {
        userData.street = address.street;
        userData.city = address.city;
        userData.state = address.state;
        userData.zipCode = address.zipCode;
      }

      console.log('📋 User data to store:', {
        ...userData,
        coordinates: coordinates ? '[coordinates provided]' : null
      });

      const createdUser = await prisma.user.create({
        data: userData
      });

      console.log('✅ User data stored successfully in database');
      console.log('🎉 User creation completed');

    } catch (dbError) {
      console.error('❌ Database error while creating user:', dbError);
      
      // If database fails, we should clean up the Supabase user
      console.log('🧹 Attempting to clean up Supabase user...');
      try {
        // Note: You might need admin privileges to delete users
        // This is just a log for now
        console.log('⚠️ Manual cleanup may be required for Supabase user:', authData.user.id);
      } catch (cleanupError) {
        console.error('❌ Cleanup failed:', cleanupError);
      }

      // Check if it's a unique constraint violation
      if (dbError.code === 'P2002') {
        return Response.json({ 
          error: 'User with this email already exists',
          code: 'USER_EXISTS'
        }, { status: 409 });
      }

      return Response.json({ 
        error: 'Failed to store user data',
        details: dbError.message,
        code: 'DATABASE_ERROR'
      }, { status: 500 });
    }

    return Response.json({ 
      message: 'User created successfully', 
      userId: authData.user.id,
      email: email
    }, { status: 201 });

  } catch (err) {
    console.error('💥 Unexpected error in signup:', err);
    console.error('📚 Error stack:', err.stack);
    
    return Response.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  } finally {
    // Always disconnect from Prisma
    try {
      await prisma.$disconnect();
      console.log('🔌 Database connection closed');
    } catch (disconnectError) {
      console.error('⚠️ Error disconnecting from database:', disconnectError);
    }
  }
}