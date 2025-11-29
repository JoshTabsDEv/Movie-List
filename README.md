# Movie List System

A CRUD application for managing a movie list using Next.js and MySQL with authentication.

## Features

- ✅ **Admin Login** - Secure admin authentication with credentials
- ✅ **Google OAuth** - Users can sign in with Google (view-only access)
- ✅ **Admin Dashboard** - Full CRUD operations for movies (Create, Read, Update, Delete)
- ✅ **User View** - View-only access for regular users
- ✅ **Digital Ocean Ready** - Optimized schema with indexes for production
- ✅ **Simple and clean UI**

## Prerequisites

- Node.js (v18 or higher)
- MySQL database (local or Digital Ocean Managed Database)
- npm or yarn
- Google OAuth credentials (for user login)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Make sure MySQL is running on your machine or create a Digital Ocean Managed Database
2. Create the database and tables by running the SQL script:

```bash
mysql -u root -p < lib/db-setup.sql
```

Or manually execute the SQL commands in `lib/db-setup.sql` in your MySQL client.

### 3. Create Admin User

Run the admin user creation script:

```bash
node scripts/create-admin.js
```

This will prompt you for:
- Admin email (default: admin@movielist.com)
- Admin password

Copy the generated SQL and run it in your MySQL database.

### 4. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (development)
6. For production, add: `https://yourdomain.com/api/auth/callback/google`

### 5. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=movie_list

# For Digital Ocean Managed Database:
# DB_HOST=your-db-host.db.ondigitalocean.com
# DB_USER=doadmin
# DB_PASSWORD=your_digital_ocean_password
# DB_NAME=movie_list
# DB_PORT=25060

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Generate a secret with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace the values with your actual credentials.

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll be redirected to the login page.

## Usage

### Admin Access

1. Go to `/login`
2. Enter admin credentials
3. Access the admin dashboard at `/admin`
4. Perform CRUD operations on movies

### User Access

1. Go to `/login`
2. Click "Sign in with Google"
3. View movies at `/movies` (read-only)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts      # NextAuth API routes
│   │   └── movies/
│   │       ├── route.ts          # GET, POST endpoints
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE endpoints
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard (CRUD)
│   ├── movies/
│   │   └── page.tsx              # User view (read-only)
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Redirects to login
├── components/
│   └── AuthProvider.tsx          # Session provider wrapper
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # MySQL connection
│   └── db-setup.sql              # Database schema
├── scripts/
│   └── create-admin.js           # Admin user creation script
├── types/
│   └── next-auth.d.ts            # TypeScript types for NextAuth
└── package.json
```

## API Endpoints

### Movies API
- `GET /api/movies` - Get all movies
- `POST /api/movies` - Create a new movie (admin only)
- `GET /api/movies/[id]` - Get a single movie
- `PUT /api/movies/[id]` - Update a movie (admin only)
- `DELETE /api/movies/[id]` - Delete a movie (admin only)

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out

## Digital Ocean Deployment

The schema is optimized for Digital Ocean Managed Databases:

- Indexes on commonly queried columns (title, year, genre, email, role)
- Compatible with MySQL 5.7+
- Efficient table structures
- **SSL support included** - Digital Ocean Managed Databases require SSL connections

### SSL Configuration for Digital Ocean

Digital Ocean Managed Databases **require SSL connections**. The application is configured to handle this automatically.

### Environment Variables for Digital Ocean

When deploying to Digital Ocean, update your `.env.local`:

```env
# Database Configuration with SSL
DB_HOST=your-db-host.db.ondigitalocean.com
DB_USER=doadmin
DB_PASSWORD=your_digital_ocean_password
DB_NAME=movie_list
DB_PORT=25060
DB_SSL=true
```

**Option 1: Simple SSL (Recommended for most cases)**
```env
DB_SSL=true
```
This uses SSL with `rejectUnauthorized: false`, which works with Digital Ocean's managed databases.

**Option 2: SSL with CA Certificate (More Secure)**
1. Download the CA certificate from your Digital Ocean database dashboard
2. Save it in your project (e.g., `certs/ca-certificate.crt`)
3. Add to `.env.local`:
```env
DB_SSL=true
DB_CA_CERT_PATH=./certs/ca-certificate.crt
```

### How to Get Digital Ocean Database Credentials

1. Go to your Digital Ocean dashboard
2. Navigate to **Databases** → Your database cluster
3. Click on **Users & Databases** tab
4. Copy the connection details:
   - **Host**: Found in the connection string
   - **Port**: Usually `25060` for MySQL
   - **Username**: Usually `doadmin`
   - **Password**: The password you set when creating the database
   - **Database**: Your database name (e.g., `dio_db`)

### SSL Certificate Download (Optional - for Option 2)

1. In your Digital Ocean database dashboard
2. Go to **Settings** → **Trusted Sources**
3. Download the **CA certificate**
4. Save it in your project directory (e.g., `certs/` folder)
5. Update `.env.local` with `DB_CA_CERT_PATH` pointing to the certificate

Note: The SSL configuration is automatically detected if your DB_HOST contains "digitalocean", so you may not need to set `DB_SSL=true` explicitly.

## Technologies Used

- Next.js 14 (App Router)
- NextAuth.js 4 (Authentication)
- React 18
- TypeScript
- MySQL (mysql2)
- Tailwind CSS
- bcryptjs (Password hashing)
- Google OAuth

## Security Notes

- Admin passwords are hashed using bcrypt
- Session-based authentication with JWT
- Route protection based on user roles
- SQL injection protection with parameterized queries

## Default Admin Credentials

⚠️ **IMPORTANT**: Change the default admin password immediately after first login!

Use the `scripts/create-admin.js` script to create a secure admin user.
