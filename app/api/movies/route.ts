import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Fetch all movies
export async function GET() {
  try {
    const [rows] = await db.execute('SELECT * FROM movies ORDER BY created_at DESC');
    return NextResponse.json({ movies: rows });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// POST - Create a new movie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, director, year, genre, rating } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const [result] = await db.execute(
      'INSERT INTO movies (title, director, year, genre, rating) VALUES (?, ?, ?, ?, ?)',
      [title, director || null, year || null, genre || null, rating || null]
    );

    const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [
      (result as any).insertId,
    ]);

    return NextResponse.json(
      { movie: rows[0], message: 'Movie created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: 'Failed to create movie' },
      { status: 500 }
    );
  }
}

