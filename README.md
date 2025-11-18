# Movie List System

A simple CRUD application for managing a movie list using Next.js and MySQL.

## Features

- ✅ Create new movies
- ✅ Read/View all movies
- ✅ Update existing movies
- ✅ Delete movies
- ✅ Simple and clean UI

## Prerequisites

- Node.js (v18 or higher)
- MySQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Make sure MySQL is running on your machine
2. Create the database and table by running the SQL script:

```bash
mysql -u root -p < lib/db-setup.sql
```

Or manually execute the SQL commands in `lib/db-setup.sql` in your MySQL client.

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_list
```

Replace `your_mysql_password` with your actual MySQL password.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── movies/
│   │       ├── route.ts          # GET, POST endpoints
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE endpoints
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main UI page
├── lib/
│   ├── db.ts                     # MySQL connection
│   └── db-setup.sql              # Database schema
└── package.json
```

## API Endpoints

- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create a new movie
- `GET /api/movies/[id]` - Get a single movie
- `PUT /api/movies/[id]` - Update a movie
- `DELETE /api/movies/[id]` - Delete a movie

## Usage

1. Click "Add New Movie" to create a new movie entry
2. Fill in the movie details (Title is required)
3. Click "Add Movie" to save
4. Use "Edit" button to modify a movie
5. Use "Delete" button to remove a movie (with confirmation)

## Technologies Used

- Next.js 14 (App Router)
- React 18
- TypeScript
- MySQL (mysql2)
- Tailwind CSS

