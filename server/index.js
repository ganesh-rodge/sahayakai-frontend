import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 8787;
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Simple in-memory OTP store for dev purposes
// Structure: { [email]: { code: string, expiresAt: number } }
const otpStore = new Map();

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });

    const { messages = [], model: requestedModel } = req.body || {};
    const genAI = new GoogleGenerativeAI(apiKey);

    // Prefer requested model, then env override, then safe fallbacks for older SDKs
    const candidates = [
      requestedModel,
      process.env.GEMINI_MODEL,
      // SDK v0.21.0 uses v1beta; gemini-1.5-* models 404 there.
      'gemini-1.0-pro',
      'gemini-pro'
    ].filter(Boolean);

    // Convert simple chat history to a single prompt for now
    const prompt = (messages || [])
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n');

    let lastError = null;
    for (const m of candidates) {
      try {
        const genModel = genAI.getGenerativeModel({ model: m });
        const result = await genModel.generateContent(prompt || 'Hello');
        const text = result?.response?.text?.() ?? '';
        return res.json({ reply: text, model: m });
      } catch (e) {
        // Retry on 404/not-supported; otherwise stop
        const status = e?.status || e?.response?.status;
        const msg = String(e?.message || '');
        if (status === 404 || /not found|unsupported|v1beta/i.test(msg)) {
          lastError = e; // try next candidate
          continue;
        }
        lastError = e;
        break;
      }
    }

    console.error('Gemini API error (after fallbacks):', lastError);
    res.status(502).json({ error: 'Model not available. Try again later.' });
  } catch (err) {
    console.error('Gemini API fatal error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

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
  console.log(`[chatbot] server listening on http://localhost:${PORT}`);
});
