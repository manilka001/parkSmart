// lib/auth.js

import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, SECRET, {
    expiresIn: '1h',
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
