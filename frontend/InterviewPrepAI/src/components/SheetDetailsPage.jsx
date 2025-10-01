import { useParams } from "react-router-dom";
import gfg from "../assets/gfg.svg";
import leetcode from "../assets/leetcode.svg";
import youtube from "../assets/youtube.svg";
import { useState, useEffect } from "react";
import Navbar from "./Layouts/Navbar";
import { BASE_URL } from "../utils/apiPaths";

function SheetDetail() {
  const { id } = useParams();
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTopics, setCompletedTopics] = useState({});
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/sheets/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSheet(data.sheet);
        const saved = localStorage.getItem(`${id}-progress`);
        if (saved) {
          const progressData = JSON.parse(saved);
            setFollowed(progressData.followed || false);
            setCompletedTopics(progressData.completedTopics || {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const totalSubtopics =
    sheet?.sections?.reduce(
      (acc, section) =>
        acc +
        section.topics.reduce(
          (subAcc, topic) => subAcc + (topic.subtopics?.length || 0),
          0
        ),
      0
    ) || 0;

  const completedCount = Object.values(completedTopics).filter(Boolean).length;

  useEffect(() => {
    if (followed) {
      const percentage =
        totalSubtopics > 0
          ? Math.round((completedCount / totalSubtopics) * 100)
          : 0;

      localStorage.setItem(
        `${id}-progress`,
        JSON.stringify({
          followed: true,
          completedTopics,
          percentage,
        })
      );

      localStorage.setItem("sheet-last-update", Date.now().toString());
    }
  }, [completedTopics, completedCount, followed, id, totalSubtopics]);

  const handleCompleteToggle = (sectionIdx, topicIdx, subIdx) => {
    if (!followed) return;
    const key = `${sectionIdx}-${topicIdx}-${subIdx}`;
    setCompletedTopics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleFollow = () => {
    if (followed) {
      localStorage.removeItem(`${id}-progress`);
      setFollowed(false);
      setCompletedTopics({});
    } else {
      setFollowed(true);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="p-4 text-white bg-gray-900 min-h-screen">Loading...</p>
      </>
    );

  if (!sheet)
    return (
      <>
        <Navbar />
        <p className="p-4 text-white bg-gray-900 min-h-screen">
          Sheet not found
        </p>
      </>
    );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-6 md:px-10 py-8">
        <h1 className="text-2xl font-bold mb-2">{sheet.title}</h1>
        
        <p className="text-gray-300 mb-6">{sheet.description}</p>

        <div className="flex gap-6 text-gray-300 font-medium mb-6 text-sm">
          <p>
            <strong className="text-white">{sheet.questions}</strong> Questions
          </p>
          <p>
            <strong className="text-white">{sheet.followers}</strong> Followers
          </p>
          <p>
            <strong className="text-white">{completedCount}</strong> /{" "}
            {totalSubtopics} Completed
          </p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={handleFollow}
            className={`px-4 py-1.5 rounded-md font-semibold text-sm transition ${
              followed
                ? "bg-violet-500 text-white cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-600 text-white"
            }`}
          >
            {followed ? "Unfollow" : "Follow"}
          </button>
          {!followed && (
            <span className="text-xs bg-yellow-100 border-l-4 border-yellow-400 px-2 py-1 rounded text-gray-900">
              *Follow to access questions & resources
            </span>
          )}
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-6">
          {sheet.sections?.map((section, sectionIdx) => (
            <div
              key={sectionIdx}
              className="bg-gray-800 rounded-lg shadow-lg border-l-4 border-purple-500 p-4"
            >
              <div className="font-bold text-white mb-3 text-lg">
                {section.title}
              </div>
              {section.topics.map((topic, topicIdx) => (
                <div key={topicIdx} className="mb-4">
                  <div className="font-semibold text-gray-200 text-sm mb-2">
                    {topic.title}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {topic.subtopics?.map((sub, subIdx) => {
                      const key = `${sectionIdx}-${topicIdx}-${subIdx}`;
                      const completed = completedTopics[key];
                      return (
                        <li
                          key={subIdx}
                          className="flex items-center bg-gray-700 rounded-md px-3 py-2 text-sm shadow-sm"
                        >
                          {/* Progress toggle */}
                          <span
                            className={`w-4 h-4 rounded-full border-2 mr-2 cursor-pointer ${
                              completed
                                ? "bg-violet-900 border-violet-300"
                                : "border-gray-400 bg-gray-800"
                            } ${
                              !followed && "opacity-50 cursor-not-allowed"
                            }`}
                            onClick={() =>
                              handleCompleteToggle(sectionIdx, topicIdx, subIdx)
                            }
                            title={
                              followed ? "Click to mark solved" : "Follow to mark"
                            }
                          ></span>

                          {/* Title */}
                          <span className="flex-1 text-gray-100 truncate">
                            {sub.title}
                          </span>

                          {/* Links */}
                          <span className="flex gap-2 mr-2">
                            {["gfg", "leetcode", "youtube"].map((platform) =>
                              sub.links?.[platform] ? (
                                followed ? (
                                  <a
                                    key={platform}
                                    href={sub.links[platform]}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <img
                                      src={
                                        platform === "gfg"
                                          ? gfg
                                          : platform === "leetcode"
                                          ? leetcode
                                          : youtube
                                      }
                                      alt={platform}
                                      className="w-4 h-4 opacity-80 hover:scale-110 transition"
                                    />
                                  </a>
                                ) : (
                                  <img
                                    key={platform}
                                    src={
                                      platform === "gfg"
                                        ? gfg
                                        : platform === "leetcode"
                                        ? leetcode
                                        : youtube
                                    }
                                    alt={platform}
                                    className="w-4 h-4 opacity-30"
                                  />
                                )
                              ) : null
                            )}
                          </span>

                          {/* Difficulty */}
                          <span
                            className="px-2 py-0.5 rounded text-xs bg-purple-600 font-semibold"
                          >
                            {sub.difficulty}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Completion banner */}
        {completedCount === totalSubtopics && (
          <div className="mt-10 bg-gradient-to-r from-violet-400 to-purple-600 text-white text-center font-semibold p-6 rounded-xl shadow-md animate-bounce">
             Congratulations! You’ve completed all the topics in this sheet!
          </div>
        )}
      </div>
    </>
  );
}

export default SheetDetail;
