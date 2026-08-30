import { query } from '../config/database.js';
import { sendContactNotificationEmail } from '../config/mail.js';

/**
 * Defensively parse JSON string or comma-separated technologies into string array
 */
export function safeParseArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed || trimmed === '[]') return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
      if (typeof parsed === 'string') return parsed.split(',').map(s => s.trim()).filter(Boolean);
      return [String(parsed)];
    } catch (e) {
      // Fallback for plain comma-separated strings
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

export async function getPublicData(req, res) {
  try {
    // 1. Settings
    const [settings] = await query('SELECT * FROM portfolio_settings LIMIT 1');
    const rawProfile = settings[0] || {};
    const profile = {
      ...rawProfile,
      years_experience: rawProfile.years_experience !== undefined && rawProfile.years_experience !== null ? Number(rawProfile.years_experience) : 5,
      projects_completed: rawProfile.projects_completed !== undefined && rawProfile.projects_completed !== null ? Number(rawProfile.projects_completed) : 24,
      satisfied_clients: rawProfile.satisfied_clients !== undefined && rawProfile.satisfied_clients !== null ? Number(rawProfile.satisfied_clients) : 18
    };

    // 2. Projects (Only published / ordered)
    const [projects] = await query('SELECT * FROM projects WHERE is_featured >= 0 ORDER BY display_order ASC, created_at DESC');
    const parsedProjects = projects.map(p => ({
      ...p,
      status: p.status || 'Completed',
      technologies: safeParseArray(p.technologies)
    }));

    // 3. Skills
    const [skills] = await query('SELECT * FROM skills ORDER BY display_order ASC, name ASC');

    // 4. Experience
    const [experience] = await query('SELECT * FROM experience ORDER BY display_order ASC, start_date DESC');
    const parsedExp = experience.map(e => ({
      ...e,
      technologies: safeParseArray(e.technologies)
    }));

    // 5. Education
    const [education] = await query('SELECT * FROM education ORDER BY display_order ASC, start_year DESC');

    // 6. Services
    const [services] = await query('SELECT * FROM services ORDER BY display_order ASC');

    // 7. Social Links
    const [socialLinks] = await query('SELECT * FROM social_links ORDER BY display_order ASC');

    // Track public view event asynchronously
    try {
      const referrer = req.headers['referer'] || req.headers['referrer'] || 'Direct';
      const userAgent = req.headers['user-agent'] || '';
      await query(
        'INSERT INTO analytics (event_type, page, referrer, user_agent) VALUES (?, ?, ?, ?)',
        ['pageview', '/', referrer.slice(0, 500), userAgent.slice(0, 500)]
      );
    } catch (e) {
      // Non-blocking analytics log
    }

    res.json({
      success: true,
      data: {
        profile,
        projects: parsedProjects,
        skills,
        experience: parsedExp,
        education,
        services,
        socialLinks
      }
    });
  } catch (err) {
    console.error('Error fetching public portfolio data:', err);
    res.status(500).json({ success: false, message: 'Failed to load portfolio content.' });
  }
}

export async function submitContactMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    await query(
      'INSERT INTO messages (name, email, subject, message, is_read) VALUES (?, ?, ?, ?, 0)',
      [name.trim(), email.trim(), (subject || 'Portfolio Contact Inquiry').trim(), message.trim()]
    );

    // Send email notification to owner (patel.muhammed.saeedahmed@gmail.com)
    sendContactNotificationEmail({
      name: name.trim(),
      email: email.trim(),
      subject: (subject || 'Portfolio Contact Inquiry').trim(),
      message: message.trim()
    }).catch(err => {
      console.warn('[Email Warning] Asynchronous notification failed:', err.message);
    });

    res.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. I will get back to you shortly.'
    });
  } catch (err) {
    console.error('Contact form submission error:', err);
    res.status(500).json({ success: false, message: 'Unable to send message right now. Please try again later.' });
  }
}

export async function trackProjectClick(req, res) {
  try {
    const { projectId, title } = req.body;
    const referrer = req.headers['referer'] || 'Direct';
    await query(
      'INSERT INTO analytics (event_type, page, project_id, referrer) VALUES (?, ?, ?, ?)',
      ['project_click', title || 'Project Click', projectId || null, referrer.slice(0, 500)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
}
