import React from "react";
import DashboardLayout from "./Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";

const DsaSheet = () => {
  const navigate = useNavigate();
  return (
    <>
      <DashboardLayout />
      <div className="min-h-screen flex flex-col items-center pt-50 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <div
          className=" bg-white/10 backdrop-blur-md border shadow-md
                 border-white/20 hover:shadow-xl hover:scale-[1.02] 
                 transition-all duration-300 group rounded-xl  p-10 text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-4">
            DSA Master Sheet
          </h1>
          <p className="text-lg text-white/70 mb-2">Coming Soon!</p>
          <p className="text-base text-white/70 mb-6">
            Your ultimate resource for Data Structures & Algorithms interview preparation will be available here soon.
          </p>
          <p className="text-base text-violet-200 mb-4">
            Instantly write, run, and test your code online with our built-in compiler. Practice DSA problems and see results in real time—no setup required!
          </p>
          <button
            className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-violet-700 transition"
            onClick={() => navigate("/compiler")}
          >
            Try it for free
          </button>
        </div>
      </div>
    </>
  );
};

export default DsaSheet;
