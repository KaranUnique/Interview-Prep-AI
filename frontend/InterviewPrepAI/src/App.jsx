import Compiler from "./components/Compiler";
import SkillAssessment from "./components/SkillAssessment";
import DsaSheet from "./components/DsaSheet";
// ...existing code...
import UserProvider from "./context/userContext";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
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
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path='/signUp' element={<SignUp/>}/> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/interview-prep/:sessionId"
              element={<InterviewPrep />}
            />
            <Route path="/ai-helper" element={<AIHelper />} />
            <Route path="/practice" element={
              <ProtectedRoute>
                <PracticePage />
              </ProtectedRoute>
            } />
            <Route path="/aptitude" element={
              <ProtectedRoute>
                <PracticePage />
              </ProtectedRoute>
            } />
            <Route path="/role-prep" element={<Dashboard />} />
            <Route path="/ai-insight" element={<AIHelper />} />
            <Route path="/ai-assistance" element={<AIHelper />} />
            <Route path="/coding-sheets" element={<DsaSheet />} />
            <Route path="/assessment" element={<SkillAssessment />} />
            <Route path="/compiler" element={<Compiler />} />
          </Routes>
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
  );
};

export default App;
