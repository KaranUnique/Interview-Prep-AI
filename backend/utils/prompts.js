
const questionAnswerPrompt = ({ role, experience, topicsToFocus, numberOfQuestions }) => `
You are an AI trained to generate technical interview questions and answers.

Task:
- Role: ${role}
- Candidate Experience: ${experience} years
- Focus Topics: ${topicsToFocus}
- Write ${numberOfQuestions} interview questions
- For each question, generate a detailed, beginner-friendly answer using rich markdown formatting:
    - Use markdown headings (##, ###) for structure
    - Use bullet points, bold, and italics where appropriate
    - If the answer needs a code example, always include it as a markdown code block (triple backticks, specify language)
    - Use tables or blockquotes if helpful
    - Make answers long, clear, and well-formatted for easy reading
- Return a pure JSON array like:
[
  {
    "question": "Question here?",
    "answer": "Answer here in markdown."
  },
  ...
]

Important: Do NOT add any extra text. Only return valid JSON.
`;

const conceptExplainPrompt = (question) => (`
You are an AI trained to generate explanations for a given interview question.

Task:
- Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
- Question: "${question}"
- After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
- If the explanation includes a code example, provide a small code block.
- Keep the formatting very clean and clear.
- Return the result as a vaild JSON object in the followinf format:
{
    "title": "Short title here?",
    "explanation": "Explanation here."
}

Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.

`)

module.exports = { questionAnswerPrompt, conceptExplainPrompt };