import React, { useState, useRef } from "react";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import Navbar from "./Layouts/Navbar";
import DashboardLayout from "./Layouts/DashboardLayout";

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
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

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
    setMessages((m) => [...m, { id: placeholderId, role: "assistant", text: "..." }]);
    setLoading(true);

    try {
      let lastText = "";
      const onProgress = (chunk, accumulated) => {
        lastText = accumulated;
        setMessages((cur) =>
          cur.map((msg) => (msg.id === placeholderId ? { ...msg, text: lastText } : msg))
        );
      };

      const full = await callApi(prompt, onProgress);

      // If the response is a JSON string, parse and display only the text value
      let displayText = lastText || full || "(no response)";
      if (typeof displayText === "string" && displayText.startsWith('{') && displayText.endsWith('}')) {
        try {
          const parsed = JSON.parse(displayText);
          displayText = parsed.text || displayText;
        } catch {}
      }
      setMessages((cur) =>
        cur.map((msg) => (msg.id === placeholderId ? { ...msg, text: displayText } : msg))
      );
    } catch (err) {
      setError(err.message || "Something went wrong");
      setMessages((cur) =>
        cur.map((msg) => (msg.id === placeholderId ? { ...msg, text: "Error: " + (err.message || "Failed") } : msg))
      );
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSend(e);
    }
  }

  function clearChat() {
    setMessages([{ id: Date.now(), role: "assistant", text: "Hi — ask me anything!" }]);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex flex-col">
      {user && (
        <div className="h-16 sticky top-0 z-30 bg-gradient-to-b from-gray-900 to-gray-800 border-b border-violet-500/30 shadow-sm">
          <Navbar />
        </div>
      )}
      <div className="container mx-auto px-4 pt-6 pb-20 relative z-10">
        <div className="mx-auto w-full max-w-6xl bg-white/5 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <header className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-xl font-bold">A</div>
              <div>
                <h1 className="text-lg font-semibold">AI Assistant</h1>
              </div>
            </div>

            <button
              onClick={clearChat}
              className="text-sm px-3 py-1 rounded-md bg-white/6 hover:bg-white/10"
            >
              New chat
            </button>
          </header>

          {/* Messages */}
          <main className="p-4 h-[60vh] overflow-y-auto" aria-live="polite">
            <ol className="space-y-4">
              {messages.map((m) => (
                <li key={m.id} className="flex gap-3 items-start">
                  <div
                    className={`flex-none w-9 h-9 rounded-md flex items-center justify-center text-sm font-medium ${
                      m.role === "user" ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    {m.role === "user" ? "U" : "A"}
                  </div>

                  <div className="prose prose-invert max-w-none break-words bg-white/3 p-3 rounded-lg flex-1">
                    <div className="text-sm text-white/80 whitespace-pre-wrap">{m.text}</div>
                  </div>
                </li>
              ))}
            </ol>
            <div ref={endRef} />
          </main>

          {/* Footer / Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent">
            <div className="flex gap-3 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask a question... (Press Ctrl+Enter to send)"
                className="flex-1 resize-none rounded-md bg-white/5 focus:bg-white/6 focus:outline-none p-3 placeholder:text-white/40 text-white"
                aria-label="Ask a question"
              />

              <div className="flex flex-col items-end gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-60"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.2" />
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="white" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 12l19-9-9 19-2-7-8-3z" fill="currentColor" />
                    </svg>
                  )}
                  <span className="text-sm">Send</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(messages.map((m) => `${m.role}: ${m.text}`).join('\n\n'));
                  }}
                  className="text-xs opacity-80 hover:opacity-100"
                >
                
                </button>
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
