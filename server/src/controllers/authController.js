import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [users] = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const sessionId = uuidv4();
    const userAgent = (req.headers['user-agent'] || '').slice(0, 500);
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').toString().slice(0, 100);
    const expiresIn = '2h';
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    // Store per-device session
    await query(
      'INSERT INTO sessions (id, user_id, user_agent, ip_address, expires_at, is_revoked) VALUES (?, ?, ?, ?, ?, ?)',
      [sessionId, user.id, userAgent, ip, expiresAt, 0]
    );

    const secret = process.env.JWT_SECRET || 'saeed_portfolio_jwt_secret_key_2026_super_secure';
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, sessionId },
      secret,
      { expiresIn }
    );

    res.json({
      success: true,
      token,
      sessionId,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
}

export async function logout(req, res) {
  try {
    const sessionId = req.sessionId || (req.user && req.user.sessionId);
    if (sessionId) {
      await query('UPDATE sessions SET is_revoked = ? WHERE id = ?', [1, sessionId]);
    }
    res.json({ success: true, message: 'Session logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ success: false, message: 'Server error during logout.' });
  }
}

export async function getMe(req, res) {
  try {
    const [users] = await query('SELECT id, email, name, role, created_at FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found or unauthenticated.' });
    }
    res.json({ success: true, user: users[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
}

export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required.' });
    }

    const [users] = await query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, users[0].password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
}
