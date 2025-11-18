import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Fetch a single movie by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [
      params.id,
    ]) as any;

    if ((rows as any[]).length === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ movie: (rows as any[])[0] });
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie' },
      { status: 500 }
    );
  }
}

// PUT - Update a movie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, director, year, genre, rating } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    await db.execute(
      'UPDATE movies SET title = ?, director = ?, year = ?, genre = ?, rating = ? WHERE id = ?',
      [title, director || null, year || null, genre || null, rating || null, params.id]
    );

    const [rows] = await db.execute('SELECT * FROM movies WHERE id = ?', [
      params.id,
    ]) as any;

    return NextResponse.json({
      movie: (rows as any[])[0],
      message: 'Movie updated successfully',
    });
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a movie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [result] = await db.execute('DELETE FROM movies WHERE id = ?', [
      params.id,
    ]);

    if ((result as any).affectedRows === 0) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}

