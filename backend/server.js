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
// Remove ES Module import for cors. Use CommonJS require below.
const app = express();


// CORS settings for local and deployed frontend
app.use(
    cors({
        origin: [
            "https://interview-preparation-ai-zu05.onrender.com",
            "https://interview-prep-ai-k6xq.onrender.com"
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);


connectDB().then(() => {
    console.log('MongoDB connected successfully');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});


// middleware
app.use(express.json());


//Routes
app.use("/api/auth",authRoutes);
app.use('/api/sessions',sessionRoutes);
app.use('/api/question',questionRoutes);
app.use('/api', aiRoutes);
app.use('/api/questions', aptitudeQuestionsRoutes);
const sheetJsonUpload = require('./routes/sheetJsonUpload');
app.use('/api/sheets', sheetJsonUpload);
const userSheetProgressRoutes = require('./routes/userSheetProgressRoutes');
app.use('/api/user', userSheetProgressRoutes);
app.use('/api/ai/generate-questions', protect , generateInterviewQuestions);
app.use('/api/ai/generate-explanation', protect , generateConceptExplanation);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname,"uploads"),{}));

// Debug route to verify backend is working
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
});


// Remove duplicate CORS middleware (already set above)

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server connected and running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or use a different one.`);
        process.exit(1);
    } else {
        console.error('Server error:', err);
    }
});