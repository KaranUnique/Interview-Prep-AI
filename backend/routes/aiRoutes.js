const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Use Gemini to generate a real answer
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use the official model names with the "-latest" tag
    const candidateModels = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash-preview-09-2025', // The latest 'flash' model
  'gemini-2.5-pro-preview-05-06', 
  'gemini-pro',
].filter(Boolean);

    let lastErr = null;
    let result = null;
    let usedModel = null;
    for (const m of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: m });
        result = await model.generateContent(prompt);
        usedModel = m;
        break;
      } catch (e) {
        lastErr = e;
        continue;
      }
    }
    if (!result) {
      throw lastErr || new Error('All Gemini models failed');
    }
    const rawText = await result.response.text();
    let cleanedText = rawText
      .replace(/^[\s`]*json\s*/i, "")
      .replace(/^\s*```/i, "")
      .replace(/```$/i, "")
      .trim();
    return res.json({ text: cleanedText, model: usedModel });
  } catch (error) {
    console.error("Gemini API Error (generate all failed):", {
      message: error.message,
      status: error.status,
      tried: [process.env.GEMINI_MODEL, 'gemini-1.5-pro-latest','gemini-1.5-flash-latest','gemini-pro','gemini-1.0-pro'].filter(Boolean)
    });
    res.status(500).json({ error: "Failed to generate content with all candidate models", detail: error.message });
  }
});

// List available models
router.get('/models', async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = await genAI.listModels();
    const modelNames = models.map(m => m.name.replace('models/', ''));
    res.json({
      availableModels: modelNames,
      configured: process.env.GEMINI_MODEL || null,
      note: 'Actual availability depends on your API key & region. Set GEMINI_MODEL in .env to force a specific one.'
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to list models', detail: e.message });
  }
});

module.exports = router;