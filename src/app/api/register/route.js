import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { setCookie } from 'cookies-next';

export async function POST(req) {
  const { email, password, name } = await req.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const connection = await pool.getConnection();

  try {
    // Check if the user already exists
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length > 0) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Insert the new user into the database
    await connection.execute(
      'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, 'user'] 
    );

    // Create JWT
    const token = await sign({ email, name, role: 'user' }, process.env.NEXTAUTH_SECRET);

    // Set the JWT in a cookie
    const response = NextResponse.json({ message: 'User registered successfully' });

    setCookie('next-auth.session-token', token, {
      req, 
      res: response, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour in seconds
      path: '/',
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  } finally {
    connection.release();
  }
}
