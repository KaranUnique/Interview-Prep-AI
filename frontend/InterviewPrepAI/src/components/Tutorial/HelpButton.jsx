import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "../../context/tutorialContext";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useLocation } from "react-router-dom";

const FAQ_ITEMS = [
  {
    q: "How do I create an interview session?",
    a: 'Go to the Dashboard and click the purple "Add New" button (bottom-right). Fill in your target role, experience level, and the topics you want to focus on.',
  },
  {
    q: "How does AI question generation work?",
    a: "After creating a session, our AI analyzes your role and experience to generate relevant interview Q&A. Open a session to see your questions. Click \"Learn More\" on any question for a deeper explanation.",
  },
  {
    q: "Can I practice aptitude questions?",
    a: 'Yes! Navigate to "Cognitive Builder" from the top navigation menu to access aptitude, logical reasoning, and quantitative questions.',
  },
  {
    q: "How do I track my DSA progress?",
    a: 'Open "DSA Master Sheets" from the nav to access sheets from Striver, NeetCode, Love Babbar, and more. Mark problems as solved and your progress is saved automatically.',
  },
  {
    q: "What is the AI Assistant?",
    a: 'The AI Assistant (under "AI Assistance") is your personal interview coach — ask any technical question, get concept explanations, or practice follow-up Q&A in a chat interface.',
  },
  {
    q: "Can I delete a session?",
    a: "Yes. On the Dashboard, hover over any session card and click the delete (trash) icon. You'll be asked to confirm before it's permanently removed.",
  },
  {
    q: "How do I add more questions to a session?",
    a: 'Open a session and scroll to the bottom of the questions list. Click the "Learn More" button to generate an additional batch of AI questions for that session.',
  },
];

const HelpIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const CloseIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Auth / landing pages where we should NOT show the help button
const HIDDEN_ON_PATHS = ["/", "/login", "/signup"];

const HelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const { isTutorialActive, startTutorial } = useTutorial();
  const { user } = useContext(UserContext);
  const location = useLocation();

  const shouldHide =
    HIDDEN_ON_PATHS.includes(location.pathname) || isTutorialActive;

  if (shouldHide) return null;

  const handleRestartTutorial = () => {
    setIsOpen(false);
    startTutorial();
  };

  const toggleFaq = (index) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  };

  return (
    <>
      {/* FAQ / Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible backdrop to close panel */}
            <motion.div
              key="help-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[998]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="help-panel"
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ duration: 0.22, type: "spring", stiffness: 400, damping: 30 }}
              className="fixed bottom-24 right-4 md:right-10 z-[999] w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-violet-500/30 overflow-hidden"
            >
              {/* Panel header */}
              <div className="p-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold text-sm">Help & Resources</h3>
                  <p className="text-white/70 text-xs mt-0.5">
                    Answers to common questions
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
                  aria-label="Close help panel"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Restart tour CTA */}
              <div className="p-3 border-b border-gray-100 dark:border-gray-700/60">
                <button
                  onClick={handleRestartTutorial}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition text-left group"
                >
                  <span className="text-xl">🎯</span>
                  <div>
                    <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 group-hover:text-violet-800 dark:group-hover:text-violet-200 transition">
                      Restart Onboarding Tour
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Take the guided walkthrough again
                    </p>
                  </div>
                </button>
              </div>

              {/* FAQ section */}
              <div className="max-h-72 overflow-y-auto custom-scrollbar">
                <div className="p-3">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                    Frequently Asked Questions
                  </p>
                  <div className="space-y-0.5">
                    {FAQ_ITEMS.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl overflow-hidden border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50 transition"
                      >
                        <button
                          onClick={() => toggleFaq(i)}
                          className="w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition rounded-xl"
                        >
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-snug">
                            {item.q}
                          </span>
                          <motion.span
                            animate={{ rotate: expandedFaq === i ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-gray-400 flex-shrink-0"
                          >
                            <ChevronDown />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {expandedFaq === i && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <p className="px-3 pb-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {item.a}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/40">
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center">
                  Interview Prep AI · Your personal interview coach
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Help"
        title="Help & FAQ"
        className="fixed bottom-5 right-4 md:right-10 z-[998] w-12 h-12 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <CloseIcon size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="help"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <HelpIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default HelpButton;
