# Troubleshooting Guide

## 401 Error on Admin Login

If you're getting a `POST /api/auth/callback/credentials 401` error, check the following:

### 1. Check if Admin User Exists

Run this SQL query in your database:

```sql
SELECT id, email, name, role, provider FROM users WHERE role = 'admin';
```

If no user is returned, you need to create an admin user.

### 2. Create Admin User

**Option A: Using the script**
```bash
node scripts/create-admin.js
```

Copy the generated SQL and run it in your MySQL database.

**Option B: Manual SQL**

1. Hash a password using Node.js:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your_password', 10, (err, hash) => console.log(hash));"
```

2. Insert the admin user:
```sql
INSERT INTO users (email, name, password, role, provider) 
VALUES ('admin@movielist.com', 'Admin User', 'YOUR_HASHED_PASSWORD', 'admin', 'credentials');
```

### 3. Check Database Connection

Visit: `http://localhost:3000/api/auth/debug`

This will show:
- If database is connected
- How many users exist
- List of all users (without passwords)

### 4. Check Environment Variables

Make sure your `.env.local` has:
- `DB_HOST` - Database host
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name (e.g., `dio_db`)
- `NEXTAUTH_SECRET` - Random secret string
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)

### 5. Check Server Logs

Look at your terminal/server logs for error messages. The improved error handling will show:
- "User not found or not an admin"
- "User has no password set"
- "Invalid password for user"
- Database connection errors

### 6. Common Issues

**Issue: "User not found"**
- Admin user doesn't exist in database
- Email doesn't match exactly (case-sensitive in some MySQL configs)
- User exists but role is not 'admin'

**Issue: "Invalid credentials"**
- Password is incorrect
- Password hash in database doesn't match
- Password wasn't hashed with bcrypt

**Issue: Database connection error**
- Check DB_HOST, DB_USER, DB_PASSWORD in .env.local
- For Digital Ocean: Make sure DB_SSL=true is set
- Check if database is accessible from your location

### 7. Reset Admin Password

If you need to reset the admin password:

1. Run the create-admin script again
2. Or manually hash a new password and update:
```sql
UPDATE users SET password = 'NEW_HASHED_PASSWORD' WHERE email = 'admin@movielist.com' AND role = 'admin';
```

## Quick Test

Run these SQL queries to verify setup:

```sql
-- Check if database exists and is selected
SELECT DATABASE();

-- Check if tables exist
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- List all users
SELECT id, email, name, role, provider, created_at FROM users;
```

