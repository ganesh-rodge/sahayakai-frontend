import 'dotenv/config';
import express from 'express';
import cors from 'cors';
// Chatbot removed: no AI model import required

const app = express();
const PORT = process.env.PORT || 8787;
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Simple in-memory OTP store for dev purposes
// Structure: { [email]: { code: string, expiresAt: number } }
const otpStore = new Map();

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));


// Auth: send OTP (DEV ONLY)
app.post('/api/auth/send-otp', (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const code = String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
    const ttlMs = 5 * 60 * 1000; // 5 minutes
    otpStore.set(email.toLowerCase(), { code, expiresAt: Date.now() + ttlMs });

    // In a real system, you'd send email/SMS here.
    // For development, we return success and log the code server-side.
    console.log(`[auth] OTP for ${email}: ${code} (valid 5 min)`);
    return res.json({ ok: true });
  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Auth: verify OTP and set new password (DEV ONLY - no real user store)
app.post('/api/auth/reset-with-otp', (req, res) => {
  try {
    const { email, otp, newPassword } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (!otp || typeof otp !== 'string') {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const rec = otpStore.get(email.toLowerCase());
    if (!rec) return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
    if (Date.now() > rec.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return res.status(400).json({ error: 'OTP expired. Please request a new one.' });
    }
    if (rec.code !== otp) return res.status(400).json({ error: 'Invalid OTP' });

    // Here, integrate with your user store to update the password for the given email.
    // Since this is a dev scaffold, we just clear the OTP and reply OK.
    otpStore.delete(email.toLowerCase());
    return res.json({ ok: true });
  } catch (err) {
    console.error('reset-with-otp error:', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
