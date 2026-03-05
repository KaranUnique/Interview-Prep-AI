import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa"; // Using react-icons since the project uses it heavily

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { updateUser, user } = useContext(UserContext);
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      try {
        const response = await axiosInstance.get(
          API_PATHS.AUTH.VERIFY_EMAIL(token),
        );
        setStatus("success");
        setMessage(response.data.message || "Email verified successfully!");

        // If the user is currently logged in, force update their context to verified
        if (user) {
          updateUser({ ...user, isVerified: true });
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Invalid or expired verification token.",
        );
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg transition-colors duration-300">
        <div className="text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <FaSpinner className="animate-spin text-5xl text-purple-600 dark:text-purple-400 mb-4" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Verifying Email...
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please wait while we verify your email address.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <FaCheckCircle className="text-5xl text-green-500 mb-4" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Verified!
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {message}
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <FaTimesCircle className="text-5xl text-red-500 mb-4" />
              <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
                Verification Failed
              </h2>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {message}
              </p>
              <button
                onClick={() => navigate("/login")}
                className="mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
