const express = require('express');
const router = express.Router();


const { GoogleGenerativeAI } = require("@google/generative-ai");
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini to generate a real answer
router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }
  try {
  const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent([prompt]);
    const rawText = await result.response.text();
    // Clean up any code block markers
    let cleanedText = rawText
      .replace(/^\s*```json\s*/i, "")
      .replace(/^\s*```\s*/i, "")
      .replace(/(\s*```\s*)+$/i, "")
      .trim();
    res.json({ text: cleanedText });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
