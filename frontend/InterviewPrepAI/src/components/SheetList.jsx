import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Layouts/Navbar";
import { FiTrendingUp, FiBookOpen } from "react-icons/fi";
import { FiHelpCircle, FiUsers } from "react-icons/fi";
import { BASE_URL } from "../utils/apiPaths";

function SheetList({ type }) {
  const [sheetList, setSheetList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [timestamp, setTimestamp] = useState(Date.now());

  useEffect(() => {
    // Fetch sheets from backend API
    fetch(`${BASE_URL}/api/sheets`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched sheets:", data.sheets);
        setSheetList(data.sheets);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const checkUpdate = () => {
      const latest = localStorage.getItem("sheet-last-update");
      if (latest && parseInt(latest) > timestamp) {
        setTimestamp(parseInt(latest));
      }
    };
    const interval = setInterval(checkUpdate, 1000);
    return () => clearInterval(interval);
  }, [timestamp]);

  const getProgress = (sheetId) => {
    const data = JSON.parse(localStorage.getItem(`${sheetId}-progress`));
    if (!data || typeof data !== "object") return 0;

    const completedTopics = data.completedTopics || {};
    const completedCount =
      Object.values(completedTopics).filter(Boolean).length;

    const sheet = sheetList.find((s) => s.id === sheetId);
    if (!sheet || !sheet.sections) return 0;

    let total = 0;
    for (const section of sheet.sections) {
      for (const topic of section.topics) {
        total += topic.subtopics?.length || 0;
      }
    }

    return total > 0 ? Math.floor((completedCount / total) * 100) : 0;
  };

  if (loading)
    return (
      <>
        <Navbar />
        <p className="p-4 text-white">Loading sheets...</p>
      </>
    );
  if (!Array.isArray(sheetList)) return <p>No sheets available.</p>;

  let filteredSheet = [];
  if (type === "popular") {
    filteredSheet = [...sheetList]
      .sort((a, b) => b.followers - a.followers)
      .slice(0, 10);
  } else if (type === "all") {
    filteredSheet = [...sheetList];
  } else {
    filteredSheet = sheetList.filter((sheet) => sheet.category === type);
  }

  const displayedSheets = showAll ? filteredSheet : filteredSheet.slice(0, 7);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white px-6 py-8">
        <p className="text-2xl font-bold mb-8 flex items-center gap-2">
          {type === "popular" ? (
            <>
              <FiTrendingUp className="text-yellow-400" size={28} /> Popular Sheets
            </>
          ) : type === "all" ? (
            <>
              <FiBookOpen className="text-blue-400" size={28} /> All Sheets
            </>
          ) : type && typeof type === "string" ? (
            <>
              <FiBookOpen className="text-purple-400" size={28} /> {`${type.toUpperCase()} Sheets`}
            </>
          ) : (
            <>Sheets</>
          )}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedSheets.map((sheet) => {
            const progress = getProgress(sheet.id);
            const progressData = JSON.parse(localStorage.getItem(`${sheet.id}-progress`));
            const isFollowed = progressData && progressData.followed;
            return (
              <Link
                to={`/sheet/${sheet.id}`}
                key={sheet.id}
                className="relative bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-300 min-h-[180px]"
              >
                  <h3 className="text-base py-1 font-semibold text-white">
                    {sheet.title}
                  </h3>
                <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                  {sheet.description}
                </p>
                <p className="text-gray-400 text-[11px] mb-1 flex items-center gap-1">
                  <FiHelpCircle className="text-purple-400" /> {sheet.questions}{" "}
                  Questions
                </p>
                <p className="text-gray-400 text-[11px] mb-2 flex items-center gap-1">
                  <FiUsers className="text-purple-400" /> {sheet.followers}{" "}
                  Followers
                </p>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mb-2">
                  <div
                    className="h-1.5 rounded-full bg-purple-500 transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between mt-auto gap-2">
                  <button
                    className={`py-1 px-3 rounded text-[11px] font-medium transition ${
                      isFollowed
                        ? 'bg-violet-500 text-white cursor-not-allowed'
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                    disabled={isFollowed}
                  >
                    {isFollowed ? 'Followed' : 'Follow'}
                  </button>
                  <span className="text-[11px] bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">
                    {progress}%
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredSheet.length > 7 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-5 py-2 text-sm font-semibold bg-white/10 rounded-lg hover:bg-white/20 transition"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default SheetList;
