"use client";

import { motion, AnimatePresence } from "framer-motion";

export const greetingSuggestions = [
  "Hi",
  "Hello",
  "Greetings",
  "Hey",
  "How are you?",
];

export const suggestions = [
  "What is your professional background?",
  "What are your experiences?",
  "What technical skills do you have?",
  "Tell me about your most impactful project",
  "Why would you be a good fit for a senior role?",
  "How can I contact you?",
  "What is your current focus?",
  "Can you show your projects?",
  "Where are you located?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  expanded: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export default function SuggestedQuestions({
  onSelect,
  expanded,
  onToggle,
  compact = false,
}: SuggestedQuestionsProps) {
  if (!compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-wrap justify-center gap-1.5 sm:gap-2"
      >
        {suggestions.map((q, i) => (
          <motion.button
            key={q}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.06 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(q)}
            className="rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-[11px] text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 sm:px-3.5 sm:py-2 sm:text-xs"
          >
            {q}
          </motion.button>
        ))}
      </motion.div>
    );
  }

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="mb-3 flex items-center gap-1.5 text-[11px] text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 sm:text-xs cursor-pointer"
      >
        <motion.svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="18 15 12 9 6 15" />
        </motion.svg>
        Suggestions
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5 pb-1 sm:gap-2">
              {suggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => onSelect(q)}
                  className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-2.5 py-1 text-[11px] text-zinc-500 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
