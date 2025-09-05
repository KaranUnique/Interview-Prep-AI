require("dotenv").config();
const express = require("express");
const cors=require("cors");
const path= require("path");
const connectDB = require("./config/db");
const { generateInterviewQuestions, generateConceptExplanation } = require('./controllers/aiController');
const { protect } = require('./middlewares/authMiddleware');
// const Question = require("./models/Question");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes= require("./routes/sessionRoutes");
const questionRoutes= require("./routes/questionRoutes");
const aiRoutes = require("./routes/aiRoutes");
const aptitudeQuestionsRoutes = require("./routes/AptitudeQuestions.js");

const app = express();

app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
    })
);

connectDB()


// middleware
app.use(express.json());

//Routes

app.use("/api/auth",authRoutes);
app.use('/api/sessions',sessionRoutes);
app.use('/api/question',questionRoutes);

app.use('/api', aiRoutes);
app.use('/api/questions', aptitudeQuestionsRoutes);

app.use('/api/ai/generate-questions', protect , generateInterviewQuestions);
app.use("/api/ai/generate-explanation", protect , generateConceptExplanation);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname,"uploads"),{}));

// Debug route to verify backend is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

//Start Server
const PORT=process.env.PORT || 5000;
app.listen(PORT);