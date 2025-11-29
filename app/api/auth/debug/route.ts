import { NextResponse } from 'next/server';
import db from '@/lib/db';

// Debug endpoint to check database connection and users
export async function GET() {
  try {
    // Test database connection
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM users') as any;
    
    // Get all users (without passwords)
    const [users] = await db.execute(
      'SELECT id, email, name, role, provider, created_at FROM users'
    ) as any;

    return NextResponse.json({
      success: true,
      dbConnected: true,
      userCount: rows[0]?.count || 0,
      users: users || [],
      message: 'Database connection successful'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      dbConnected: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

