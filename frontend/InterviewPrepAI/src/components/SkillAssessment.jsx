import React from "react";
import DashboardLayout from "./Layouts/DashboardLayout";

const DsaSheet = () => {
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
            Skill Assessment
          </h1>
          <p className="text-lg text-white/70 mb-2">Coming Soon!</p>
          <p className="text-base text-white/70">
           Your personalized skill assessment tools and mock tests will be available here soon to <br/>help you evaluate and improve your interview readiness.
          </p>
        </div>
      </div>
    </>
  );
};

export default DsaSheet;
