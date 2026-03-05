import Compiler from "./components/Compiler";
import SkillAssessment from "./components/SkillAssessment";
import DsaSheet from "./components/SheetDetailsPage";
import SheetList from "./components/SheetList";
// ...existing code...
import UserProvider from "./context/userContext";
import ThemeProvider from "./context/themeContext";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/animations/PageTransition";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import LandingPage from "./LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
import AIHelper from "./components/AIHepler";
import PracticePage from "./pages/InterviewPrep/components/PracticePage";
import { useContext } from "react";
import { UserContext } from "./context/userContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);
  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-dark)] transition-colors duration-300">
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                {/* <Route path='/signUp' element={<SignUp/>}/> */}
                <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route
                  path="/interview-prep/:sessionId"
                  element={<PageTransition><InterviewPrep /></PageTransition>}
                />
                <Route path="/ai-helper" element={<PageTransition><AIHelper /></PageTransition>} />
                <Route path="/practice" element={
                  <ProtectedRoute>
                    <PageTransition><PracticePage /></PageTransition>
                  </ProtectedRoute>
                } />
                <Route path="/aptitude" element={
                  <ProtectedRoute>
                    <PageTransition><PracticePage /></PageTransition>
                  </ProtectedRoute>
                } />
                <Route path="/role-prep" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/ai-insight" element={<PageTransition><AIHelper /></PageTransition>} />
                <Route path="/ai-assistance" element={<PageTransition><AIHelper /></PageTransition>} />
                <Route path="/coding-sheets" element={<PageTransition><SheetList type="all" /></PageTransition>} />
                <Route path="/sheet/:id" element={<PageTransition><DsaSheet /></PageTransition>} />
                <Route path="/assessment" element={<PageTransition><SkillAssessment /></PageTransition>} />
                <Route path="/compiler" element={<PageTransition><Compiler /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </Router>
          <Toaster
            toastOptions={{
              className: "",
              style: {
                fontSize: "13px",
              },
            }}
          />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
