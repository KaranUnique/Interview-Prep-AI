import React, { useState, useRef, useContext } from "react";
import { UserContext } from "../context/userContext";
import Navbar from "./Layouts/Navbar";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

export default function AIHelper() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([
    { id: 0, role: "assistant", text: "Hi — ask me anything!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef(null);

  function scrollToBottom() {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function addMessage(role, text) {
    setMessages((m) => [...m, { id: Date.now() + Math.random(), role, text }]);
    setTimeout(scrollToBottom, 50);
  }

  async function callApi(prompt, onProgress) {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      }
    );

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || `Status ${res.status}`);
    }

    if (res.body && typeof res.body.getReader === "function") {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulated = "";

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          accumulated += chunk;
          onProgress(chunk, accumulated);
        }
      }
      return accumulated;
    }

    const data = await res.json();
    return data.text || "No response.";
  }

  async function handleSend(e) {
    e?.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    setError(null);
    setInput("");
    addMessage("user", prompt);

    const placeholderId = Date.now() + Math.random();
    setMessages((m) => [
      ...m,
      { id: placeholderId, role: "assistant", text: "..." },
    ]);
    setLoading(true);

    try {
      let lastText = "";
      const onProgress = (chunk, accumulated) => {
        lastText = accumulated;
        setMessages((cur) =>
          cur.map((msg) =>
            msg.id === placeholderId ? { ...msg, text: lastText } : msg
          )
        );
      };

      const full = await callApi(prompt, onProgress);

      let displayText = lastText || full || "(no response)";
      if (
        typeof displayText === "string" &&
        displayText.startsWith("{") &&
        displayText.endsWith("}")
      ) {
        try {
          const parsed = JSON.parse(displayText);
          displayText = parsed.text || displayText;
        } catch { }
      }

      setMessages((cur) =>
        cur.map((msg) =>
          msg.id === placeholderId ? { ...msg, text: displayText } : msg
        )
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
      setMessages((cur) =>
        cur.map((msg) =>
          msg.id === placeholderId
            ? { ...msg, text: "Error: " + (err.message || "Failed") }
            : msg
        )
      );
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }

  function clearChat() {
    setMessages([
      { id: Date.now(), role: "assistant", text: "Hi — ask me anything!" },
    ]);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      {user && (
        <div className="h-16 sticky top-0 z-30 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-violet-500/30 shadow-sm transition-colors duration-300">
          <Navbar />
        </div>
      )}
      <div className="container mx-auto px-4 pt-6 pb-20 relative z-10">
        <div className="mx-auto w-full max-w-6xl bg-purple-50 dark:bg-white/5 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col transition-colors duration-300">

          {/* Email Verification Banner for Unverified Users */}
          {user && !user.isVerified && (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
              <FaLock className="text-6xl text-purple-400 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verify Your Email to Unlock AI
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
                To protect our systems and ensure the best experience, AI features are exclusively available to verified accounts. Please check your inbox for the verification link we sent when you registered.
              </p>
            </div>
          )}

          {/* Chat Interface (Only for verified users or public layout) */}
          {(!user || user.isVerified) && (
            <>
              {/* Header */}
              <header className="flex items-center justify-between p-4 border-b border-purple-100 dark:border-white/5 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xl font-bold text-white">
                    A
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">AI Assistant</h1>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="text-sm px-3 py-1 rounded-md bg-purple-100 dark:bg-white/6 hover:bg-purple-200 dark:hover:bg-white/10 text-gray-900 dark:text-white transition-colors duration-300"
                >
                  New chat
                </button>
              </header>

              {/* Messages */}
              <main className="p-4 h-[60vh] overflow-y-auto bg-white dark:bg-transparent transition-colors duration-300">
                <ol className="space-y-4">
                  {messages.map((m) => (
                    <li key={m.id} className="flex gap-3 items-start">
                      <div
                        className={`flex-none w-9 h-9 rounded-md flex items-center justify-center text-sm font-medium ${m.role === "user" ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                          } text-white transition-colors duration-300`}
                      >
                        {m.role === "user" ? "U" : "A"}
                      </div>
                      <div className="prose prose-invert max-w-none break-words bg-purple-50 dark:bg-white/3 p-3 rounded-lg flex-1 transition-colors duration-300">
                        <div className="text-sm text-gray-900 dark:text-white/80 whitespace-pre-wrap transition-colors duration-300">
                          {m.text}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
                <div ref={endRef} />
              </main>

              {/* Input */}
              <form
                onSubmit={handleSend}
                className="p-4 border-t border-purple-100 dark:border-white/5 bg-gradient-to-t from-purple-100/50 dark:from-black/20 to-transparent transition-colors duration-300"
              >
                <div className="flex gap-3 items-end">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={2}
                    placeholder="Ask a question... (Press Ctrl+Enter to send)"
                    className="flex-1 resize-none rounded-md bg-white dark:bg-white/5 focus:bg-gray-50 dark:focus:bg-white/6 p-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-white/40 border border-gray-200 dark:border-transparent transition-colors duration-300"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-60 text-white transition"
                  >
                    {loading ? "Loading..." : "Send"}
                  </button>
                </div>
                {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400 transition-colors duration-300">{error}</p>}
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
