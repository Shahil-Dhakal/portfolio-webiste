import express from 'express';
import rateLimit from 'express-rate-limit';
import { buildSystemPrompt } from '../services/ragContext.js';
import { getModelCandidates, demoteModel } from '../services/geminiModel.js';

const router = express.Router();

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages. Please wait a bit before continuing the chat.' }
});

const MAX_HISTORY_MESSAGES = 10;
const MAX_MODEL_ATTEMPTS = 4;

router.post('/', chatLimiter, async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'A message is required' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Chat is not configured yet (missing GEMINI_API_KEY).' });
  }

  try {
    const systemPrompt = await buildSystemPrompt(message);

    const trimmedHistory = Array.isArray(history)
      ? history
          .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
          .slice(-MAX_HISTORY_MESSAGES)
      : [];

    const contents = [
      ...trimmedHistory.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const candidates = await getModelCandidates(process.env.GEMINI_API_KEY);

    let data = null;
    let fatalError = null;

    for (const model of candidates.slice(0, MAX_MODEL_ATTEMPTS)) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: { maxOutputTokens: 500 }
        })
      });

      if (response.ok) {
        data = await response.json();
        break;
      }

      const errText = await response.text();
      console.error(`Gemini API error on model "${model}":`, response.status, errText);

      if (response.status === 404) {
        demoteModel(model);
        continue;
      }

      fatalError = { status: response.status, errText };
      break;
    }

    if (!data) {
      const status = fatalError?.status === 429 ? 429 : 502;
      const message =
        fatalError?.status === 429
          ? 'Hit the free-tier rate limit — please wait a moment and try again.'
          : 'The chat assistant is unavailable right now.';
      return res.status(status).json({ error: message });
    }

    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      "Sorry, I couldn't come up with a reply.";

    res.json({ reply });
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ error: 'Something went wrong generating a reply.' });
  }
});

export default router;