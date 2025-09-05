# Interview Prep AI

Interview Prep AI is a full-stack web application that helps users prepare for interviews with AI-generated, role-specific questions and answers. Users can practice, expand on answers, get detailed explanations, and track their progress—all in a modern, responsive interface.

## Features
- AI-powered, role-specific interview questions and answers
- Expand answers and dive deeper into concepts
- Save, organize, and revisit questions
- Analytics and progress tracking
- User authentication and profile management
- Responsive design for all devices

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **AI Integration:** (e.g., OpenAI API)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance
- (Optional) OpenAI API key or other AI provider key

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/KaranUnique/Interview-Prep-AI.git
   cd Interview-Prep-AI
   ```
2. Install dependencies for both frontend and backend:
   ```sh
   cd backend
   npm install
   cd ../frontend/InterviewPrepAI
   npm install
   ```
3. Set up environment variables (see `.env.example` in each folder):
   - For backend: create a `.env` file in `backend/` with your MongoDB URI, JWT secret, and AI API keys.
   - For frontend: create a `.env` file in `frontend/InterviewPrepAI/` if needed.

4. Start the backend server:
   ```sh
   cd backend
   npm start
   ```
5. Start the frontend dev server:
   ```sh
   cd ../frontend/InterviewPrepAI
   npm run dev
   ```

## Folder Structure
```
backend/           # Express server, API routes, models, controllers
frontend/InterviewPrepAI/  # React app (Vite + Tailwind)
```

## Environment Variables
Create a `.env` file in the `backend/` directory with the following (example):
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## License
This project is licensed under the MIT License.

---

*Built with ❤️ by KaranUnique*
