import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

export const TutorialContext = createContext();

const TUTORIAL_COMPLETED_KEY = "tutorial_completed";

export const TUTORIAL_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Interview Prep AI! 🎉",
    content:
      "Let's take a quick tour to help you get the most out of your interview preparation. This will only take a minute!",
    icon: "👋",
    highlight: null,
    featureList: null,
  },
  {
    id: "dashboard",
    title: "Your Interview Sessions",
    content:
      "The Dashboard is your home base. Here you can see all your interview prep sessions — each one tailored to a specific job role and experience level.",
    icon: "📋",
    highlight: "dashboard",
    featureList: [
      "View all sessions at a glance",
      "Resume any session instantly",
      "Delete old sessions easily",
    ],
    featureColor: "from-violet-500 to-indigo-600",
  },
  {
    id: "create-session",
    title: "Create a Session",
    content:
      'Click the glowing "Add New" button (bottom-right) to create your first interview session. Fill in your role, years of experience, and the topics you want to focus on.',
    icon: "➕",
    highlight: "create-session",
    featureList: [
      "Choose your target job role",
      "Set your experience level",
      "Specify focus topics for precision",
    ],
    featureColor: "from-green-500 to-teal-600",
  },
  {
    id: "ai-questions",
    title: "AI-Generated Questions",
    content:
      "Once you open a session, our AI automatically generates tailored interview questions and detailed answers based on your role and experience. You can also load more anytime!",
    icon: "🤖",
    highlight: null,
    featureList: [
      "Role-specific question sets",
      "Detailed model answers",
      "Pin important questions",
    ],
    featureColor: "from-blue-500 to-cyan-600",
  },
  {
    id: "ai-helper",
    title: "AI Assistant",
    content:
      'Use the "AI Assistance" feature to ask any interview-related question, get concept explanations, or deep-dive into topics — think of it as your personal interview coach.',
    icon: "💡",
    highlight: "ai-helper",
    featureList: [
      "Ask any technical question",
      "Get concept explanations",
      "Practice conversational Q&A",
    ],
    featureColor: "from-amber-500 to-orange-600",
  },
  {
    id: "practice",
    title: "Cognitive Builder",
    content:
      'The "Cognitive Builder" gives you aptitude questions, logical reasoning, and quantitative problems — perfect for cracking non-technical interview rounds.',
    icon: "🧠",
    highlight: "practice",
    featureList: [
      "Aptitude & logical reasoning",
      "Quantitative problems",
      "Timed practice sessions",
    ],
    featureColor: "from-rose-500 to-pink-600",
  },
  {
    id: "dsa-sheets",
    title: "DSA Master Sheets",
    content:
      'Browse curated DSA sheets from top educators like Striver, Love Babbar, and NeetCode under "DSA Master Sheets". Track your progress as you solve each problem.',
    icon: "📊",
    highlight: "dsa-sheets",
    featureList: [
      "Striver SDE Sheet (191 Qs)",
      "NeetCode 150 & Love Babbar",
      "Track solved/unsolved problems",
    ],
    featureColor: "from-emerald-500 to-green-600",
  },
  {
    id: "complete",
    title: "You're All Set! 🚀",
    content:
      "You now know all the key features! Start by creating your first interview session. You can always revisit this tour using the Help button (bottom-right corner).",
    icon: "🎯",
    highlight: null,
    featureList: null,
  },
];

export const TutorialProvider = ({ children }) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    setTutorialCompleted(!!completed);
  }, []);

  const startTutorial = useCallback(() => {
    setCurrentStepIndex(0);
    setIsTutorialActive(true);
    localStorage.removeItem(TUTORIAL_COMPLETED_KEY);
    setTutorialCompleted(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev < TUTORIAL_STEPS.length - 1) return prev + 1;
      // Last step: complete
      setIsTutorialActive(false);
      localStorage.setItem(TUTORIAL_COMPLETED_KEY, "completed");
      setTutorialCompleted(true);
      return prev;
    });
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const skipTutorial = useCallback(() => {
    setIsTutorialActive(false);
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, "skipped");
    setTutorialCompleted(true);
  }, []);

  const completeTutorial = useCallback(() => {
    setIsTutorialActive(false);
    localStorage.setItem(TUTORIAL_COMPLETED_KEY, "completed");
    setTutorialCompleted(true);
  }, []);

  /** Call this after a user logs in or registers — starts tour only for first-time users */
  const triggerTutorialForNewUser = useCallback(() => {
    const completed = localStorage.getItem(TUTORIAL_COMPLETED_KEY);
    if (!completed) {
      setTimeout(() => setIsTutorialActive(true), 900);
    }
  }, []);

  const currentStep = TUTORIAL_STEPS[currentStepIndex] ?? null;

  return (
    <TutorialContext.Provider
      value={{
        isTutorialActive,
        currentStepIndex,
        currentStep,
        totalSteps: TUTORIAL_STEPS.length,
        tutorialCompleted,
        startTutorial,
        nextStep,
        prevStep,
        skipTutorial,
        completeTutorial,
        triggerTutorialForNewUser,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);

export default TutorialProvider;
