import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const AptitudeQuestionCard = ({ question, options, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 mb-4 shadow-md hover:shadow-lg transition">
      {/* Expand button */}
      <button
        className="absolute top-4 right-4 text-gray-300 hover:text-violet-400 transition-transform"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronDown
          className={`w-5 h-5 transform transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Question */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold px-2.5 py-1 rounded-md shadow-md text-sm">
          Q
        </span>
        <h3 className="text-white/90 font-medium text-base leading-snug">
          {question}
        </h3>
      </div>

      {/* Options */}
      {options && Array.isArray(options) && (
        <div className="mt-3 space-y-1">
          {options.map((opt, i) => {
            const optionLabel = String.fromCharCode(65 + i); // A, B, C, D, ...
            return (
              <div
                key={i}
                className="text-sm text-gray-300 border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2"
              >
                <span className="font-bold text-violet-400">{optionLabel}.</span> {opt}
              </div>
            );
          })}
        </div>
      )}

      {/* Answer (expanded) */}
      {isExpanded && answer && (
        <div className="mt-4 text-sm text-green-300 font-medium bg-green-900/30 px-3 py-2 rounded-lg border border-green-400/30">
          ✅ Answer: <span className="font-semibold">{answer}</span>
        </div>
      )}
    </div>
  );
};

export default AptitudeQuestionCard;
