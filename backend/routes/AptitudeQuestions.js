
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


// GET /api/questions?topic=Probability
router.get("/", async (req, res) => {
  const { topic } = req.query;
  if (!topic) return res.status(400).json({ error: "Topic is required" });

  const prompt = `
    Generate 5 multiple-choice aptitude questions on the topic: ${topic}.
    Each question should have 4 options and indicate the correct answer in JSON format like:
    [
      {
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "answer": "A"
      },
      ...
    ]
    Only return valid JSON, no extra text.
  `;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);
    const rawText = await result.response.text();
    let cleanedText = rawText
      .replace(/^\s*```json\s*/i, "")
      .replace(/^\s*```\s*/i, "")
      .replace(/(\s*```\s*)+$/i, "")
      .trim();
    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch (err) {
      console.error("Gemini raw response:", rawText);
      console.error("Parse error:", err);
      return res.status(500).json({ error: "Failed to parse Gemini response", details: err.message, raw: rawText });
    }
    res.json(questions);
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: "Failed to generate questions", details: error.message });
  }
});
module.exports = router;