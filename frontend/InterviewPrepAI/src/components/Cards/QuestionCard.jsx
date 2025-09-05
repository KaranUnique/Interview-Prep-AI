import React, { useState, useEffect, useRef } from "react";
import { LuChevronDown, LuPin, LuPinOff, LuSparkles } from "react-icons/lu";
import AIResponsePreview from '../../pages/InterviewPrep/components/AIResponsePreview';


const QuestionCard = ({
  question,
  answer,
  onLearnMore,
  isPinned,
  onTogglePin,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 border border-gray-200">
      {/* Question header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={toggleExpand}>
          <span className="bg-[#ede9fe] text-purple-700 font-bold px-2 py-1 rounded">
            Q
          </span>
          <h3 className="text-gray-800 font-medium">{question}</h3>
        </div>

        <div className="flex items-center gap-2">
          {onTogglePin && (
            <button
              className="text-gray-600 hover:text-blue-500"
              onClick={onTogglePin}
            >
              {isPinned ? <LuPinOff size={20}/> : <LuPin className="text-purple-900" size={20} />}
            </button>
          )}

          {onLearnMore && (
            <button
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-500"
              onClick={() => {
                setIsExpanded(true);
                onLearnMore();
              }}
            >
              <span className="bg-blue-100 rounded-full p-1 flex items-center justify-center">
                <LuSparkles size={18} className="text-blue-500" />
              </span>
              <span>Learn More</span>
            </button>
          )}

          {/* Answer indication on the right side (removed aptitude logic) */}

          <button className="ml-2" onClick={toggleExpand}>
            <LuChevronDown
              size={20}
              className={`transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Answer section */}
      {isExpanded && answer && (
        <div className="mt-3 text-gray-700 leading-relaxed">
          <AIResponsePreview content={answer} />
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
