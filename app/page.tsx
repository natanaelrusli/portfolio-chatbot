"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { findAnswer } from "@/data/qa";
import { useTheme } from "./components/ThemeProvider";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import SuggestedQuestions from "./components/SuggestedQuestions";
import TypingIndicator from "./components/TypingIndicator";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; url: string; type: "email" | "linkedin" | "github" | "external" }[];
}

interface StoredChat {
  messages: Message[];
  savedAt: number;
  nextId: number;
}

const STORAGE_KEY = "portfolio-chat";
const MAX_MESSAGES = 100;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

function loadChat(): { messages: Message[]; nextId: number } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], nextId: 1 };

    const stored: StoredChat = JSON.parse(raw);
    if (Date.now() - stored.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return { messages: [], nextId: 1 };
    }

    if (stored.messages.length > MAX_MESSAGES) {
      localStorage.removeItem(STORAGE_KEY);
      return { messages: [], nextId: 1 };
    }

    return { messages: stored.messages, nextId: stored.nextId };
  } catch {
    return { messages: [], nextId: 1 };
  }
}

function saveChat(messages: Message[], nextId: number) {
  try {
    const data: StoredChat = { messages, savedAt: Date.now(), nextId };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

export default function Home() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestionsExpanded, setSuggestionsExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState<"top" | "bottom" | null>(null);
  const nextIdRef = useRef(1);
  const hasMessages = messages.length > 0;

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const canScroll = scrollHeight > clientHeight + 100;

      if (!canScroll) {
        setShowScrollButton(null);
        return;
      }

      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;

      if (isAtBottom) {
        setShowScrollButton("top");
      } else {
        setShowScrollButton("bottom");
      }
    }
  }, []);

  useEffect(() => {
    const scrollDiv = scrollRef.current;
    if (scrollDiv) {
      scrollDiv.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => scrollDiv.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, messages, isTyping]);

  // Mark as mounted after hydration so we can safely read theme/DOM. We schedule
  // setState in a microtask so it's not synchronous in the effect (avoids linter
  // "cascading renders" rule and hydration issues).
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  // Restore chat from localStorage on mount. Same microtask pattern: setState
  // runs in a callback so the effect doesn't trigger synchronous cascading renders.
  useEffect(() => {
    queueMicrotask(() => {
      const { messages: saved, nextId } = loadChat();
      if (saved.length > 0) {
        setMessages(saved);
        nextIdRef.current = nextId;
      }
    });
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      saveChat(messages, nextIdRef.current);
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: Message = {
        id: String(nextIdRef.current++),
        role: "user",
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      const delay = 400 + Math.random() * 600;
      setTimeout(() => {
        const { answer, actions } = findAnswer(text);
        const botMsg: Message = {
          id: String(nextIdRef.current++),
          role: "assistant",
          content: answer,
          actions,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, delay);
    },
    [isTyping],
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    nextIdRef.current = 1;
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput("");
  };

  const handleSuggestionSelect = (question: string) => {
    sendMessage(question);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-white dark:bg-zinc-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6 sm:py-4"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-xs font-bold text-white">
            NN
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Nata Nael
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasMessages && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearChat}
              className="flex h-8 items-center gap-1.5 rounded-lg bg-zinc-100 px-2.5 text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-500 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-red-950 dark:hover:text-red-400"
              aria-label="Clear chat"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              <span className="hidden text-xs sm:inline">Clear</span>
            </motion.button>
          )}
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            aria-label="Toggle theme"
          >
            {(!mounted || theme === "dark") ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </motion.header>

      {/* Messages Wrapper for Floating Buttons */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto scroll-smooth bg-zinc-50 px-3 py-4 dark:bg-zinc-900 sm:px-4 sm:py-6 md:px-6"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:gap-4">
            {!hasMessages && (
              <div className="flex flex-col items-center justify-center gap-8 px-2 py-12 sm:py-24">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-4 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h2 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      How can I help you today?
                    </h2>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      Ask about my experience, projects, or technical skills.
                    </p>
                  </div>
                </motion.div>
                <SuggestedQuestions
                  onSelect={handleSuggestionSelect}
                  expanded={true}
                  onToggle={() => { }}
                />
              </div>
            )}

            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Scroll Button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={showScrollButton === "top" ? scrollToTop : scrollToBottom}
              className="absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700 sm:bottom-6 sm:right-6 lg:right-10"
              aria-label={showScrollButton === "top" ? "Scroll to top" : "Scroll to bottom"}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-zinc-600 dark:text-zinc-400 transition-transform duration-300 ${showScrollButton === "top" ? "" : "rotate-180"}`}
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input area with inline suggestions */}
      <div className="shrink-0 border-t border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900 sm:px-4 sm:py-4 md:px-6">
        <div className="mx-auto max-w-2xl">
          {hasMessages && (
            <SuggestedQuestions
              onSelect={handleSuggestionSelect}
              expanded={suggestionsExpanded}
              onToggle={() => setSuggestionsExpanded((v) => !v)}
              compact
            />
          )}
          <ChatInput
            input={input}
            isLoading={isTyping}
            onInputChange={setInput}
            onSubmit={handleSubmit}
          />
          <p className="mt-2 text-center text-[10px] text-zinc-400 dark:text-zinc-600 sm:text-[11px]">
            Responses are generated based on provided profile static data
          </p>
        </div>
      </div>
    </div>
  );
}
