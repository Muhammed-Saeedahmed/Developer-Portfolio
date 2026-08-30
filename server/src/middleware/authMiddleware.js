import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. Authentication token required.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'saeed_portfolio_jwt_secret_key_2026_super_secure';
    const verified = jwt.verify(token, secret);

    if (!verified || !verified.sessionId) {
      return res.status(401).json({ success: false, message: 'Invalid session token structure.' });
    }

    // Verify session in backend store
    const [sessions] = await query('SELECT * FROM sessions WHERE id = ? LIMIT 1', [verified.sessionId]);
    if (!sessions || sessions.length === 0) {
      return res.status(401).json({ success: false, message: 'Session not found or has expired. Please login.' });
    }

    const session = sessions[0];
    if (Number(session.is_revoked) === 1) {
      return res.status(401).json({ success: false, message: 'Session has been invalidated. Please login again.' });
    }

    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ success: false, message: 'Session has expired. Please login again.' });
    }

    req.user = verified;
    req.sessionId = verified.sessionId;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}
