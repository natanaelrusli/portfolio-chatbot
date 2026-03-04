"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { suggestions } from "./SuggestedQuestions";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dismissed, setDismissed] = useState(false);

  const filteredSuggestions = useMemo(
    () =>
      input.trim().length > 0
        ? suggestions.filter(
            (s) =>
              s.toLowerCase().includes(input.toLowerCase()) && s !== input
          )
        : [],
    [input]
  );
  const showSuggestions =
    filteredSuggestions.length > 0 && !dismissed;
  const clampedIndex =
    filteredSuggestions.length === 0
      ? -1
      : Math.min(selectedIndex, filteredSuggestions.length - 1);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  useEffect(() => {
    queueMicrotask(() => {
      setSelectedIndex(-1);
      setDismissed(false);
    });
  }, [input]);

  const handleSuggestionClick = (suggestion: string) => {
    onInputChange(suggestion);
    setDismissed(true);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredSuggestions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
      } else if (e.key === "Enter" || e.key === "Tab") {
        if (clampedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(filteredSuggestions[clampedIndex]);
        } else if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (input.trim() && !isLoading) {
            onSubmit(e);
          }
        }
      } else if (e.key === "Escape") {
        setDismissed(true);
      }
    } else {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() && !isLoading) {
          onSubmit(e);
        }
      }
    }
  };

  return (
    <div className="relative w-full">
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="max-h-48 overflow-y-auto py-1">
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${index === clampedIndex
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-700 dark:text-zinc-100"
                      : "text-zinc-600 dark:text-zinc-400"
                    }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        onSubmit={onSubmit}
        className="relative flex w-full items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 transition-colors focus-within:border-zinc-300 focus-within:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:focus-within:border-zinc-600 dark:focus-within:bg-zinc-800 sm:px-4 sm:py-3"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setDismissed(true), 200)}
          placeholder="Input your questions here..."
          rows={1}
          className="flex-1 resize-none bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-200 text-zinc-600 transition-all hover:bg-zinc-300 disabled:opacity-30 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </motion.form>
    </div>
  );
}
