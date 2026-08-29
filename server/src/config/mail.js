import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
export function getMailTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASS || '';

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass }
    });
  }

  // Fallback / log mode when credentials not yet set
  return null;
}

export async function sendContactNotificationEmail({ name, email, subject, message }) {
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'patel.muhammed.saeedahmed@gmail.com';
  const transporter = getMailTransporter();

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070A0F; color: #F1F5F9; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1);">
      <div style="background: linear-gradient(135deg, #00F5D4, #A855F7); padding: 24px; text-align: center;">
        <h1 style="color: #070A0F; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">New Portfolio Inquiry</h1>
        <p style="color: #070A0F; opacity: 0.85; margin: 4px 0 0 0; font-size: 13px; font-weight: 600;">Muhammed Saeed — Developer Portfolio CMS</p>
      </div>

      <div style="padding: 32px 24px;">
        <div style="background: rgba(13, 19, 31, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="color: #94A3B8; padding: 6px 0; width: 100px; font-weight: 600;">From:</td>
              <td style="color: #FFFFFF; font-weight: 700;">${name}</td>
            </tr>
            <tr>
              <td style="color: #94A3B8; padding: 6px 0; font-weight: 600;">Email:</td>
              <td><a href="mailto:${email}" style="color: #00F5D4; text-decoration: none; font-weight: 600;">${email}</a></td>
            </tr>
            <tr>
              <td style="color: #94A3B8; padding: 6px 0; font-weight: 600;">Subject:</td>
              <td style="color: #FFFFFF; font-weight: 600;">${subject}</td>
            </tr>
            <tr>
              <td style="color: #94A3B8; padding: 6px 0; font-weight: 600;">Received:</td>
              <td style="color: #94A3B8; font-size: 12px;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 28px;">
          <h3 style="color: #00F5D4; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Message Content:</h3>
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 18px; color: #E2E8F0; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${message}</div>
        </div>

        <div style="text-align: center;">
          <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background: linear-gradient(135deg, #00F5D4, #00C2FF); color: #070A0F; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 50px; box-shadow: 0 0 20px rgba(0, 245, 212, 0.4);">
            Reply to ${name} (${email})
          </a>
        </div>
      </div>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding: 16px; text-align: center; font-size: 11px; color: #64748B;">
        Sent automatically from Muhammed Saeed's Developer Portfolio Contact System.
      </div>
    </div>
  `;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"${name} (Portfolio Inquiry)" <${process.env.SMTP_USER || recipient}>`,
        to: recipient,
        replyTo: email,
        subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
        text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        html: htmlContent
      });
      console.log(`[Email] Notification email successfully sent to ${recipient}. MessageId: ${info.messageId}`);
      return { sent: true, messageId: info.messageId };
    } catch (err) {
      console.warn(`[Email] Failed to send email via SMTP (${err.message}). Message is safely recorded in the Admin CMS database.`);
      return { sent: false, error: err.message };
    }
  } else {
    console.log(`[Email Notice] Form message saved to Database. To enable live Gmail delivery to ${recipient}, provide SMTP_USER and SMTP_PASS in server/.env.`);
    return { sent: false, notice: 'SMTP credentials not configured in .env' };
  }
}
