const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express       = require('express');
const cors          = require('cors');
const rateLimit     = require('express-rate-limit');
const analyzeRouter = require('./routes/analyze');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Startup diagnostics ───────────────────────────────────────────────────────
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'present ✓' : 'MISSING ✗ — edit server/.env');
// ─────────────────────────────────────────────────────────────────────────────

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json({ limit: '50kb' }));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: 'Too many requests — please try again later.' },
}));

app.use('/api', analyzeRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', port: PORT }));

app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.use((err, _req, res, _next) => {
  console.error('[server] Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
