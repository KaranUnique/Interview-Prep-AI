import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import TopicCard from "../../../components/Cards/TopicCard";
import AptitudeQuestionCard from "../../../components/Cards/AptitudeQuestionCard";
import Loader from "../../../components/Loader/Loader";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";

const topics = [
  "Logical Reasoning",
  "Data Interpretation",
  "Quantitative Aptitude",
  "Probability",
  "Verbal ability",
  "Puzzles",
];

const PracticePage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleTopicClick = async (topic) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (topic === "Career Specific Roadmap") {
      navigate("/dashboard");
      return;
    }
    setSelectedTopic(topic);
    setLoading(true);
    setQuestions([]);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/questions?topic=${topic}`
      );
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to generate questions.");
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
        <main className="flex-1 container mx-auto px-4 py-10">
          <div className="rounded-xl shadow-sm bg-purple-50 dark:bg-transparent p-6 text-center mb-8 transition-colors duration-300">
            <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
              Practice Cognitive Skills
            </h2>
            <p className="text-gray-700 dark:text-white/70 mb-6 transition-colors duration-300">
              Sharpen your logical reasoning, quantitative, and verbal skills
              with curated aptitude tests and exercises.
            </p>
          </div>

          {/* Topics */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {topics.map((topic) => (
              <TopicCard key={topic} topic={topic} onClick={handleTopicClick} />
            ))}
          </div>

          {/* Loading */}
          {loading && <Loader />}

          {/* Professional prompt before questions */}
          {questions.length === 0 && !loading && (
            <div className="text-center text-gray-700 dark:text-white text-base py-8 transition-colors duration-300">
              <span className="inline-block bg-violet-100 dark:bg-violet-100 text-gray-700 px-4 py-2 rounded font-medium shadow">
                Select a topic above to generate your first set of aptitude
                questions.
              </span>
            </div>
          )}

          {/* Questions */}
          {questions.length > 0 && (
            <>
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <AptitudeQuestionCard
                    key={idx}
                    question={q.question}
                    options={q.options}
                    answer={q.answer}
                  />
                ))}
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-6">
                <button
                  className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-full font-semibold shadow transition"
                  disabled={loading || !selectedTopic}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/questions?topic=${selectedTopic}`
                      );
                      const data = await res.json();
                      setQuestions((prev) => [...prev, ...data]);
                    } catch (error) {
                      console.error("Error fetching questions:", error);
                      alert("Failed to generate more questions.");
                    }
                    setLoading(false);
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
};

export default PracticePage;
