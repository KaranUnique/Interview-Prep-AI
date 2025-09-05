import React, { useContext, useState } from "react";
import ProfileInfoCard from "../Cards/ProfileinfoCard";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import Modal from "../Loader/Modal";
import Login from "../../pages/Auth/Login";

const Navbar = () => {
  const SERVICES = [
    { id: 1, title: "AI Assistance", path: "/ai-assistance" },
    { id: 2, title: "Cognitive Builder", path: "/aptitude" },
    { id: 3, title: "Role-Specific Preparation", path: "/role-prep" },
    { id: 4, title: "DSA Master Sheets", path: "/coding-sheets" },
    { id: 5, title: "Skill Assessment", path: "/assessment" },
  ];

  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleServiceClick = (service) => {
    if (service.title === "Cognitive Builder" && !user) {
      setShowLoginModal(true);
    } else {
      navigate(service.path);
    }
  };

  return (
    <>
      {/* Navbar */}
      <div
        className="h-16 sticky top-0 z-30
                   bg-gradient-to-r from-[#0a0f1f] via-[#0d1229] to-[#0a0f1f]
                   backdrop-blur-sm border-b border-violet-500/30 shadow-lg"
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-10 h-full">
          {/* Logo */}
          <Link to="/">
            <h2 className="text-lg md:text-2xl font-bold text-white tracking-wide">
              Interview{" "}
              <span className="text-violet-400 drop-shadow-[0_0_6px_rgba(167,139,250,0.9)]">
                Prep AI
              </span>
            </h2>
          </Link>

          {/* Services Nav */}
          <div className="hidden md:flex gap-8 text-gray-200 font-medium">
            {SERVICES.map((service) => {
              const isActive = location.pathname === service.path;
              return (
                <span
                  key={service.id}
                  className={`relative cursor-pointer transition-all duration-200
                    hover:text-violet-300 ${
                      isActive ? "text-violet-400" : "text-gray-300"
                    }`}
                  onClick={() => handleServiceClick(service)}
                >
                  {service.title}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-[2px] rounded-full
                      transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-violet-400 to-fuchsia-400"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                  />
                </span>
              );
            })}
          </div>

          {/* Profile Info */}
          <ProfileInfoCard />
        </div>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title="Login"
      >
        <Login setCurrentPage={() => {}} />
      </Modal>
    </>
  );
};

export default Navbar;
