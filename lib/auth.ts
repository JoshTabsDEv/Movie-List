import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import db from './db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('Missing credentials');
            return null;
          }

          const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ? AND role = ?',
            [credentials.email, 'admin']
          ) as any;

          const user = (rows as any[])[0];

          if (!user) {
            console.error('User not found or not an admin:', credentials.email);
            return null;
          }

          if (!user.password) {
            console.error('User has no password set');
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.error('Invalid password for user:', credentials.email);
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        const email = user.email;
        if (!email) return false;

        // Check if user exists
        const [rows] = await db.execute(
          'SELECT * FROM users WHERE email = ?',
          [email]
        ) as any;

        if ((rows as any[]).length === 0) {
          // Create new user with Google account
          await db.execute(
            'INSERT INTO users (email, name, role, provider, provider_id) VALUES (?, ?, ?, ?, ?)',
            [
              email,
              user.name || '',
              'user',
              'google',
              account.providerAccountId,
            ]
          );
        } else {
          // Update provider info if exists
          await db.execute(
            'UPDATE users SET provider = ?, provider_id = ? WHERE email = ?',
            ['google', account.providerAccountId, email]
          );
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'user';
        token.id = user.id;
      }
      if (account?.provider === 'google') {
        const [rows] = await db.execute(
          'SELECT * FROM users WHERE email = ?',
          [token.email]
        ) as any;
        if ((rows as any[]).length > 0) {
          token.role = (rows as any[])[0].role;
          token.id = (rows as any[])[0].id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

