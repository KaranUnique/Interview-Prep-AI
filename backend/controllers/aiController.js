const { GoogleGenerativeAI } = require("@google/generative-ai");
const { conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");

// Initialize Gemini with API key from .env
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Generate interview questions and answers using Gemini
// @route   POST /api/ai/generate-questions
// @access  Private
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Build prompt
    const prompt = questionAnswerPrompt({ role, experience, topicsToFocus, numberOfQuestions });

    // Use stable Gemini model
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);


    const rawText = await result.response.text();
    // Robustly clean: remove all leading/trailing code block markers (```json, ```), even if repeated, and trim
    let cleanedText = rawText
      .replace(/^(\s*```json\s*|\s*```\s*)+/i, "") // remove all leading ```json or ```
      .replace(/(\s*```\s*)+$/i, "")                // remove all trailing ```
      .trim();

    try {
      const data = JSON.parse(cleanedText);
      res.status(200).json(data);
    } catch (err) {
      console.error("Gemini returned invalid JSON:", cleanedText); // Log the cleaned text
      res.status(500).json({
        message: "Gemini returned invalid JSON",
        raw: rawText
      });
    }
  } catch (error) {
    console.error("Gemini API Error:", error); // Log the error
    res.status(500).json({
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explanation for a concept/question
// @route   POST /api/ai/generate-explanation
// @access  Private
const generateConceptExplanation = async (req, res) => {


  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: "Missing question" });
    }

    const prompt = conceptExplainPrompt(question);

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([prompt]);

    const rawText = await result.response.text();
    // Clean: remove all leading/trailing code block markers (```json, ```), even if repeated, and trim
    let cleanedText = rawText
      .replace(/^\s*```json\s*/i, "")
      .replace(/^\s*```\s*/i, "")
      .replace(/(\s*```\s*)+$/i, "")
      .trim();

    try {
      const data = JSON.parse(cleanedText);
      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({
        message: "Gemini returned invalid JSON",
        raw: rawText
      });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};

module.exports = { generateInterviewQuestions, generateConceptExplanation };
