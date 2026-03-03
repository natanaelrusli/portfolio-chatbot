"use client";

import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; url: string; type: "email" | "linkedin" | "github" | "external" }[];
}

interface ChatMessageProps {
  message: Message;
}

const ContactIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "email":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      );
    case "linkedin":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "github":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    default:
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
  }
};

const mdComponents: Components = {
  p: ({ children }) => <p className="my-2 leading-7">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
      {children}
    </strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  h1: ({ children }) => (
    <h1 className="mb-2 mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-1 mt-3 text-sm font-bold text-zinc-900 dark:text-zinc-100">
      {children}
    </h3>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-lg bg-zinc-100 p-3 text-xs dark:bg-zinc-800">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="my-2">{children}</pre>,
  blockquote: ({ children }) => (
    <blockquote className="my-2 border-l-2 border-violet-400 pl-3 italic text-zinc-500 dark:border-violet-500 dark:text-zinc-400">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-violet-600 underline decoration-violet-300 underline-offset-2 hover:text-violet-500 dark:text-violet-400 dark:decoration-violet-600 dark:hover:text-violet-300"
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-3 border-zinc-200 dark:border-zinc-700" />,
};

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[80%] sm:px-4 sm:py-3 md:max-w-[75%] ${
          isUser
            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
            : "text-zinc-600 dark:text-zinc-300"
        }`}
      >
        {!isUser && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-[10px] font-bold text-white">
              AI
            </div>
          </div>
        )}
        <div className="max-w-none text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {isUser ? (
            <p className="leading-7">{message.content}</p>
          ) : (
            <>
              <ReactMarkdown components={mdComponents}>
                {message.content}
              </ReactMarkdown>
              {message.actions && message.actions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.actions.map((action, i) => (
                    <a
                      key={i}
                      href={action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                    >
                      <ContactIcon type={action.type} />
                      {action.label}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
