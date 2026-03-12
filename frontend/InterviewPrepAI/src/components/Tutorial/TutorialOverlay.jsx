import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTutorial } from "../../context/tutorialContext";

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CloseIcon = () => (
  <svg
    width="18"
    height="18"
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

const TutorialOverlay = () => {
  const {
    isTutorialActive,
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    prevStep,
    skipTutorial,
  } = useTutorial();

  if (!isTutorialActive || !currentStep) return null;

  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === totalSteps - 1;
  const progressPct = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <AnimatePresence>
      {isTutorialActive && (
        <motion.div
          key="tutorial-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
          }}
          onClick={(e) => {
            // Close on backdrop click only if clicking the backdrop itself
            if (e.target === e.currentTarget) skipTutorial();
          }}
        >
          <motion.div
            key={`tutorial-step-${currentStepIndex}`}
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-violet-500/30"
          >
            {/* Progress bar */}
            <div className="h-1 w-full bg-gray-200 dark:bg-gray-700">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            <div className="p-6">
              {/* Header row */}
              <div className="flex items-start justify-between mb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 dark:from-violet-500/30 dark:to-fuchsia-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                    {currentStep.icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-violet-500 dark:text-violet-400 uppercase tracking-wider">
                      Step {currentStepIndex + 1} of {totalSteps}
                    </p>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug mt-0.5">
                      {currentStep.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={skipTutorial}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0 mt-0.5"
                  aria-label="Close tutorial"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">
                {currentStep.content}
              </p>

              {/* Feature highlights */}
              {currentStep.featureList && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className={`rounded-xl p-4 mb-5 bg-gradient-to-br ${currentStep.featureColor}`}
                >
                  <ul className="space-y-2">
                    {currentStep.featureList.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2.5 text-sm text-white font-medium"
                      >
                        <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                          <CheckIcon />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Welcome/Complete illustration placeholder */}
              {!currentStep.featureList && currentStepIndex === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl p-5 mb-5 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 border border-violet-100 dark:border-violet-800/30 text-center"
                >
                  <div className="flex justify-center gap-3 text-3xl mb-2">
                    <span>📝</span>
                    <span>🤖</span>
                    <span>📊</span>
                  </div>
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                    Sessions · AI Questions · DSA Sheets · Practice
                  </p>
                </motion.div>
              )}

              {!currentStep.featureList && isLast && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl p-5 mb-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30 text-center"
                >
                  <div className="flex justify-center gap-3 text-3xl mb-2">
                    <span>🏆</span>
                    <span>🎉</span>
                    <span>💪</span>
                  </div>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Ready to ace your interview!
                  </p>
                </motion.div>
              )}

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mb-5">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === currentStepIndex ? 20 : 7,
                      opacity: i <= currentStepIndex ? 1 : 0.3,
                      backgroundColor:
                        i === currentStepIndex
                          ? "rgb(139,92,246)"
                          : "rgb(209,213,219)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="h-2 rounded-full"
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={skipTutorial}
                  className={`text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition px-2 py-1.5 rounded-lg ${
                    isLast ? "invisible" : ""
                  }`}
                >
                  Skip tour
                </button>

                <div className="flex items-center gap-2">
                  {!isFirst && (
                    <button
                      onClick={prevStep}
                      className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={nextStep}
                    className="px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-90 transition shadow-md shadow-violet-200 dark:shadow-violet-900/30"
                  >
                    {isLast ? "Get Started! 🚀" : "Next →"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;
