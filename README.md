# Interview Prep AI

Interview Prep AI is a full-stack web application that helps users prepare for interviews with AI-generated, role-specific questions and answers. Users can practice, expand on answers, get detailed explanations, and track their progress—all in a modern, responsive interface.

## Features
- AI-powered, role-specific interview questions and answers
- Expand answers and dive deep into concepts 
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

## Deployment (Render + Static Frontend)

### 1. Deploy Backend on Render
1. Push latest code to `main`.
2. Create a new Web Service on Render:
    - Repository: this repo
    - Root directory: `backend`
    - Build Command: `npm install`
    - Start Command: `node server.js` (or `npm start` if defined)
    - Environment: add the variables from `backend/.env.example`:
       - `PORT` (Render usually injects `PORT` automatically, but keep default fallback)
       - `MONGO_URI`
       - `JWT_SECRET`
       - `GEMINI_API_KEY` / `GEMINI_MODEL` (or other AI keys)
       - `FRONTEND_ORIGIN` set later to the deployed frontend URL
       - (Optional) `EXTRA_ORIGINS` comma-separated for preview builds

After deploy, note the Render backend URL, e.g. `https://your-backend.onrender.com`.

### 2. Configure Frontend
In `frontend/InterviewPrepAI`, create `.env.production` (or `.env` for a static host) with:
```
VITE_BACKEND_URL=https://your-backend.onrender.com
```

Rebuild the frontend: `npm run build`.

### 3. Deploy Frontend
You can deploy the `dist/` output to:
- Render Static Site (root: `frontend/InterviewPrepAI`, build command: `npm install && npm run build`, publish directory: `dist`)
- Netlify / Vercel / GitHub Pages

After the frontend deploys, copy its public URL and update the backend service env var `FRONTEND_ORIGIN` to that URL. Redeploy backend (Render auto-redeploys after env change).

### 4. CORS Behavior
Backend dynamically allows:
- `FRONTEND_ORIGIN`
- Any origins in `EXTRA_ORIGINS`
- Local dev: `http://localhost:5173`

If you have multiple staging URLs, set `EXTRA_ORIGINS=https://staging-1.onrender.com,https://staging-2.onrender.com`.

### 5. Local Development vs Production
- Local: `.env.development` uses `VITE_BACKEND_URL=http://localhost:8000` and Vite proxy handles `/api`.
- Production: Direct calls go to the absolute `VITE_BACKEND_URL`; no proxy configured.

### 6. Troubleshooting
| Issue | Fix |
|-------|-----|
| 401 after deploy | Ensure JWT secret consistent; clear localStorage token |
| CORS error | Verify `FRONTEND_ORIGIN` matches exact protocol + domain + (no trailing slash) |
| 404 API | Confirm `VITE_BACKEND_URL` has no trailing slash and includes https |
| Mixed content | Use https backend URL |

