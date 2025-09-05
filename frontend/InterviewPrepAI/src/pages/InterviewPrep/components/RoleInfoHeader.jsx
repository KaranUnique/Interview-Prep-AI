import React from "react";

const RoleInfoHeader = ({
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
}) => {
  return (
    <>
      <div className="relative rounded-xl shadow p-4 md:p-8 overflow-hidden mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-1 truncate">{role}</h2>
            <p className="text-sm md:text-base text-[var(--color-text-dark)] mb-2 truncate">[ {topicsToFocus} ]</p>
            {description && (
              <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2"><span className="text-gray-950">Description: </span>{description}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-[13px] font-semibold text-white bg-purple-300 px-3 py-1 rounded-full">
                Experience: {experience} {Number(experience) === 1 ? "Year" : "Years"}
              </span>
              <span className="text-[13px] font-semibold text-white bg-purple-300  px-3 py-1 rounded-full">
                {questions} Q&A
              </span>
              <span className="text-[13px] font-semibold text-white bg-purple-300  px-3 py-1 rounded-full">
                Last Updated: {lastUpdated}
              </span>
            </div>
          </div>
        </div>
        {/* Decorative blobs, more subtle and responsive */}
        {/* <div className="pointer-events-none absolute top-0 right-0 w-1/2 h-full flex items-center justify-end z-0">
          <div className="w-24 h-24 bg-[var(--color-primary)] opacity-20 blur-2xl rounded-full absolute top-2 right-10 hidden md:block" />
          <div className="w-20 h-20 bg-[var(--color-accent-teal)] opacity-20 blur-2xl rounded-full absolute top-16 right-0" />
          <div className="w-16 h-16 bg-[var(--color-accent-yellow)] opacity-20 blur-2xl rounded-full absolute top-24 right-20" />
        </div> */}
      </div>
    </>
  );
};

export default RoleInfoHeader;
