import ProfileInfoCard from "./components/Cards/ProfileinfoCard";
import React, { useContext, useState } from "react";
import HERO_IMG from "./assets/PrepImage.png";
import { APP_FEATURES } from "./utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import Modal from "./components/Loader/Modal";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import { UserContext } from "./context/userContext";
import { motion } from "framer-motion";
import ServicesMarquee from "./components/ServicesMarquee";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [pendingRoute, setPendingRoute] = useState(null);

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-r from-cyan-200 via-blue-300 to-violet-400 relative overflow-hidden">
        {/* blurred background */}
        <div className="w-72 h-72 md:w-[500px] md:h-[500px] bg-blue-200/20 blur-[65px] absolute top-0 left-0" />

        <div className="container mx-auto px-4 pt-6 pb-20 relative z-10">
          {/* header */}
          <header className="flex justify-between items-center mb-12">
            {/* Logo / Brand */}
            <div className="text-xl md:text-2xl text-black font-bold">
              Interview Prep AI
            </div>

            {/* Navigation Links for Services */}
            <nav className="hidden md:flex gap-7 text-md font-medium text-gray-900">
              <span
                className="hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => {
                  if (!user) {
                    setOpenAuthModal(true);
                    setPendingRoute("/ai-helper");
                  } else {
                    navigate("/ai-helper");
                  }
                }}
              >
                AI-Assistence
              </span>
              <span
                className="hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => {
                  if (!user) {
                    setOpenAuthModal(true);
                    setPendingRoute("/practice");
                  } else {
                    navigate("/practice");
                  }
                }}
              >
                Cognitive Skill Builder
              </span>
              <span
                className="hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => {
                  if (!user) {
                    setOpenAuthModal(true);
                    setPendingRoute("/role-prep");
                  } else {
                    navigate("/role-prep");
                  }
                }}
              >
                Role-Specific Preparation
              </span>
              <span
                className="hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => {
                  if (!user) {
                    setOpenAuthModal(true);
                    setPendingRoute("/coding-sheets");
                  } else {
                    navigate("/coding-sheets");
                  }
                }}
              >
                DSA Master Sheets
              </span>
              <span
                className="hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => {
                  if (!user) {
                    setOpenAuthModal(true);
                    setPendingRoute("/assessment");
                  } else {
                    navigate("/assessment");
                  }
                }}
              >
                Skill Assessment
              </span>
            </nav>

            {/* Auth/Profile */}
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-blue-200 text-sm font-semibold text-blue-600 px-5 md:px-7 py-2.5 rounded-full border border-white transition-colors"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>

          {/* hero content */}
          <div className="flex flex-col pb-10 pt-8 md:flex-row items-center md:items-start gap-10">
            {/* left */}
            <div className="w-full md:w-1/2">
              <div className="flex items-center justify-start mb-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600 font-semibold bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                  <LuSparkles /> AI Powered
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl text-black font-medium mb-6 leading-tight">
                Crack Every Interview with <br />
                <span
                  className="text-transparent bg-clip-text bg-[radial-gradient(circle_at_top_left,rgba(147,51,234,0.7)_0%,rgba(99,102,241,0.85)_40%,rgba(180,70,229,1)_100%)]
 font-semibold"
                >
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
              <p className="text-base md:text-lg text-gray-900 mb-6">
                Get role-specific questions, expand answers when you need them,
                dive deeper into concepts, and organize everything your way.
                From preparation to mastery—your ultimate interview toolkit is
                here.
              </p>

              {/* Buttons + Text FIXED */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex flex-row gap-3">
                  <button
                    className="bg-violet-500 text-sm font-semibold text-white px-6 md:px-7 py-2.5 rounded-full hover:bg-violet-600 transition-colors"
                    onClick={handleCTA}
                  >
                    Get Started
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 bg-blue-200 px-6 md:px-7 py-2.5 rounded-full hover:bg-blue-300 transition-colors"
                    onClick={() => navigate("/ai-helper")}
                  >
                    <LuSparkles /> AI Assistance
                  </button>
                </div>

                <p className="text-violet-600 font-semibold text-sm sm:ml-3 text-center sm:text-left">
                  Try our AI Assistance instantly—no signup required!
                </p>
              </div>
            </div>

            {/* right */}
            <div className="w-full md:w-1/2 flex justify-center pr-10">
              <img
                src={HERO_IMG}
                alt="Hero"
                className="w-full max-w-xl object-contain scale-110 md:scale-125"
              />
            </div>
          </div>
          <ServicesMarquee />
        </div>

        {/* Features Section */}
        <div className="w-full">
          <div className="container mx-auto px-4 pt-10 pb-20">
            <section>
              <h2 className="text-2xl sm:text-4xl font-medium text-center mb-12">
                Features That Make You Shine
              </h2>

              <div className="flex flex-col gap-10">
                {/* first 3 features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-sky-100 p-6 rounded-xl shadow-xs hover:shadow-lg shadow-blue-100 transition border border-blue-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>

                {/* remaining 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {APP_FEATURES.slice(3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-sky-100 p-6 rounded-xl shadow-xs hover:shadow-lg shadow-blue-100 transition border border-blue-100"
                    >
                      <h3 className="text-base font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="text-xs sm:text-sm bg-purple-50 text-secondary text-center p-2 ">
        All CopyRights Reserved @
      </div>

      {/* auth modal */}
      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
          setPendingRoute(null);
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && (
            <Login
              setCurrentPage={setCurrentPage}
              onLoginSuccess={() => {
                setOpenAuthModal(false);
                if (pendingRoute) {
                  navigate(pendingRoute);
                  setPendingRoute(null);
                } else {
                  navigate("/role-prep");
                }
              }}
            />
          )}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
