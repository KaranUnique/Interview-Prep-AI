


import Navbar from "./Layouts/Navbar";
import { LuSparkles } from "react-icons/lu";

export default function SkillAssessmentComingSoon() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-4 py-10">
  <div className="relative rounded-xl p-10 max-w-xl w-full text-center bg-white/10 backdrop-blur-md border shadow-md border-white/20">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-purple-700 px-4 py-2 rounded-full border border-purple-400 text-white font-semibold text-lg shadow">
            <LuSparkles /> AI Powered
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 mt-8">
            Skill Assessment Platform
          </h1>
          <p className="text-lg text-gray-200 mb-6">
            <span className="font-semibold text-purple-400">Coming Soon!</span> <br />
            Our next-gen skill assessment platform will help you master interviews with realistic, AI-generated mock tests and instant feedback.
          </p>
          <div className="mb-6">
            <ul className="list-disc list-inside text-left text-gray-300 mx-auto max-w-md text-base">
              <li>Role-specific mock tests for developers</li>
              <li>Instant feedback and detailed explanations</li>
              <li>Progress tracking and personalized insights</li>
              <li>Powered by advanced AI for up-to-date, industry-relevant questions</li>
            </ul>
          </div>
          <div className="mt-8">
            <span className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow">
              🚀 Stay tuned for launch!
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
