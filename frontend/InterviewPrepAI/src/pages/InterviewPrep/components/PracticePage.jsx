import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../context/userContext";
import TopicCard from "../../../components/Cards/TopicCard";
import AptitudeQuestionCard from "../../../components/Cards/AptitudeQuestionCard";
import Loader from "../../../components/Loader/Loader";
import DashboardLayout from "../../../components/Layouts/DashboardLayout";
import ProfileInfoCard from "../../../components/Cards/ProfileinfoCard";

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
  const { user, loading: userLoading } = useContext(UserContext);
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
      const res = await fetch(`/api/questions?topic=${topic}`);
      const data = await res.json();
      setQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      alert("Failed to generate questions.");
    }

    setLoading(false);
  };

  return (
    <>
      <DashboardLayout />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex flex-col">
        <main className="flex-1 container mx-auto px-4 py-10">
          {/* Profile Info Card (show only if logged in) */}
          {/* {user && (
            <div className="flex justify-end mb-4">
              <ProfileInfoCard />
            </div>
          )} */}
          <div className="rounded-xl shadow p-6 text-center mb-8">
            <h2 className="text-3xl font-semibold mb-4 text-white">Practice Cognitive Skills</h2>
            <p className="text-white/70 mb-6">Sharpen your logical reasoning, quantitative, and verbal skills with curated aptitude tests and exercises.</p>
          </div>
          {/* Topics */}
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            {topics.map((topic) => (
              <TopicCard key={topic} topic={topic} onClick={handleTopicClick} />
            ))}
          </div>
          {/* Loading */}
          {loading && <Loader />}
          {/* Professional prompt before questions are loaded */}
          {questions.length === 0 && !loading && (
            <div className="text-center text-white text-base py-8">
              <span className="inline-block bg-violet-100 text-gray-700 px-4 py-2 rounded font-medium shadow">
                Select a topic above to generate your first set of aptitude questions.
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
              <div className="flex justify-center mt-6">
                <button
                  className="bg-violet-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-violet-700 transition"
                  disabled={loading || !selectedTopic}
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res = await fetch(`/api/questions?topic=${selectedTopic}`);
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
    </>
  );
};

export default PracticePage;
