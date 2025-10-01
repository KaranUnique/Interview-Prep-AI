import React, { useContext, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalNode, setPortalNode] = useState(null);
  const { user } = useContext(UserContext);
  // Helper for initial letter or fallback
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';
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

  // Ensure a single portal root for overlays (avoid duplicates if Navbar rendered more than once)
  useEffect(() => {
    let node = document.getElementById('nav-portal-root');
    if (!node) {
      node = document.createElement('div');
      node.id = 'nav-portal-root';
      document.body.appendChild(node);
    }
    setPortalNode(node);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = original; };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Navbar */}
      <div
        className="h-16 sticky top-0 z-40 bg-[#0b1120]/95 md:bg-gradient-to-r md:from-[#0a0f1f] md:via-[#0d1229] md:to-[#0a0f1f] backdrop-blur-md border-b border-violet-500/30 shadow-lg px-1"
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

          {/* Hamburger Icon for mobile */}
          <button
            className="md:hidden flex items-center justify-center text-gray-200 hover:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded transition"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileMenuOpen ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>

          {/* Services Nav (Desktop) */}
          <div className="hidden md:flex gap-8 text-gray-200 font-medium">
            {SERVICES.map((service) => {
              const isActive = location.pathname === service.path;
              if (service.title === "DSA Master Sheets") {
                return (
                  <Link
                    to={service.path}
                    key={service.id}
                    className={`relative cursor-pointer transition-all duration-200 hover:text-violet-300 ${isActive ? "text-violet-400" : "text-gray-300"}`}
                  >
                    {service.title}
                    <span
                      className={`absolute -bottom-1 left-0 w-full h-[2px] rounded-full transition-all duration-300 ${isActive ? "bg-gradient-to-r from-violet-400 to-fuchsia-400" : "opacity-0 group-hover:opacity-100"}`}
                    />
                  </Link>
                );
              }
              return (
                <span
                  key={service.id}
                  className={`relative cursor-pointer transition-all duration-200 hover:text-violet-300 ${isActive ? "text-violet-400" : "text-gray-300"}`}
                  onClick={() => handleServiceClick(service)}
                >
                  {service.title}
                  <span
                    className={`absolute -bottom-1 left-0 w-full h-[2px] rounded-full transition-all duration-300 ${isActive ? "bg-gradient-to-r from-violet-400 to-fuchsia-400" : "opacity-0 group-hover:opacity-100"}`}
                  />
                </span>
              );
            })}
          </div>

          {/* Profile Info - hidden on mobile to avoid duplicate with drawer */}
          <div className="hidden md:block">
            <ProfileInfoCard />
          </div>
        </div>
        {/* Mobile Menu Drawer */}
        {portalNode && mobileMenuOpen && createPortal(
          <div className="fixed inset-0 z-[999] md:hidden">
            <div
              className="absolute inset-0 bg-[#05070d]/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav
              id="mobile-nav-drawer"
              className="absolute top-0 right-0 h-full w-72 max-w-[82%] bg-[#0f1526] shadow-2xl flex flex-col pt-4 pb-8 px-5 overflow-y-auto border-l border-violet-600/30 transition-transform duration-300 will-change-transform data-[state=closed]:translate-x-full"
              data-state={mobileMenuOpen ? 'open' : 'closed'}
            >
              <div className="flex items-start justify-between mb-3 pr-1">
                {/* Profile Section */}
                <div className="flex items-center gap-3">
                  {user ? (
                    user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-11 h-11 rounded-full border border-violet-500/40 shadow-md object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-inner">
                        {userInitial}
                      </div>
                    )
                  ) : (
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br from-gray-600 to-gray-700">
                      ?
                    </div>
                  )}
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold text-white max-w-[140px] truncate">
                      {user ? (user.name || user.email) : 'Guest User'}
                    </span>
                    {user ? (
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.reload();
                        }}
                        className="text-[11px] text-violet-300 hover:text-violet-200 transition underline-offset-2 hover:underline self-start"
                      >
                        Logout
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowLoginModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="text-[11px] text-violet-300 hover:text-violet-200 transition underline-offset-2 hover:underline self-start"
                      >
                        Login
                      </button>
                    )}
                  </div>
                </div>
                <button
                  className="text-gray-400 hover:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 rounded"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              {/* Divider below profile section */}
              <div className="w-full h-px bg-white/10 mb-3" />
              <ul className="flex flex-col gap-1">
                {SERVICES.map((service) => {
                  const isActive = location.pathname === service.path;
                  const baseClasses = "group block w-full text-left px-4 py-3 rounded-md text-sm font-medium tracking-wide transition relative";
                  const activeClasses = "bg-violet-600/20 text-violet-300 border border-violet-500/40 shadow-inner";
                  const idleClasses = "text-gray-300 hover:text-white hover:bg-white/5";
                  const content = (
                    <>
                      <span className="relative z-10">{service.title}</span>
                      <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 group-active:opacity-100 transition bg-gradient-to-r from-violet-600/10 via-transparent to-fuchsia-600/10 pointer-events-none" />
                    </>
                  );
                  if (service.title === "DSA Master Sheets") {
                    return (
                      <li key={service.id}>
                        <Link
                          to={service.path}
                          className={`${baseClasses} ${isActive ? activeClasses : idleClasses}`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {content}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={service.id}>
                      <button
                        className={`${baseClasses} ${isActive ? activeClasses : idleClasses}`}
                        onClick={() => {
                          handleServiceClick(service);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {content}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-7 border-t border-white/10 pt-4">
                <p className="text-[10.5px] text-gray-500 leading-relaxed">
                  Seamless interview preparation: AI, role practice, aptitude & structured DSA sheets—now optimized for mobile.
                </p>
              </div>
            </nav>
          </div>,
          portalNode
        )}
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
