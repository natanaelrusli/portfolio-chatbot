"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

const CV_PREVIEW_URL = "/api/download-cv?preview=1";
const CV_DOWNLOAD_URL = "/api/download-cv";

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  highlights?: string[];
  technologies?: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; url: string; type: "email" | "linkedin" | "github" | "external" | "download" }[];
  variant?: "experienceTimeline";
  timeline?: ExperienceItem[];
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
    case "download":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
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

function CvPreviewModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cv-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                CV Preview
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={CV_DOWNLOAD_URL}
                  download="Nata Nael CV.pdf"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-500"
                >
                  <ContactIcon type="download" />
                  Download
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-300"
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <iframe
                src={CV_PREVIEW_URL}
                title="CV Preview"
                className="h-[70vh] w-full border-0"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [cvModalOpen, setCvModalOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[80%] sm:px-4 sm:py-3 md:max-w-[75%] ${isUser
          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          : "text-zinc-600 dark:text-zinc-300"
          }`}
      >
        {!isUser && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-[10px] font-bold text-white">
              NN
            </div>
          </div>
        )}
        <div className="max-w-none text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          {isUser ? (
            <p className="leading-7">{message.content}</p>
          ) : message.variant === "experienceTimeline" && message.timeline && message.timeline.length > 0 ? (
            <>
              <p className="mb-3 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                Here’s my experience timeline:
              </p>
              <div className="relative ml-1 pl-4">
                <div className="absolute left-2 top-1 h-full w-px bg-zinc-200 dark:bg-zinc-700" />
                <div className="space-y-4">
                  {message.timeline.map((item, index) => (
                    <div key={`${item.company}-${item.period}-${index}`} className="relative flex gap-3">
                      <div className="relative z-10 mt-1 size-2 shrink-0 rounded-full bg-violet-500 shadow-[0_0_0_3px_rgba(139,92,246,0.3)] dark:bg-violet-400" />
                      <div className="pb-2">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-violet-600 dark:text-violet-300 mb-1">
                          {item.period}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                          {item.role}{" "}
                          <span className="font-normal text-zinc-500 dark:text-zinc-400">
                            • {item.company}
                          </span>
                        </p>
                        {item.highlights && item.highlights.length > 0 && (
                          <ul className="mt-1.5 ml-0 list-disc space-y-1 text-[13px] text-zinc-600 marker:text-zinc-400 dark:text-zinc-300">
                            {item.highlights.map((h, i) => (
                              <li key={i} className="ml-4 leading-6">
                                {h}
                              </li>
                            ))}
                          </ul>
                        )}
                        {item.technologies && item.technologies.length > 0 && (
                          <p className="mt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium text-zinc-600 dark:text-zinc-300">Technologies:</span>{" "}
                            {item.technologies.join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <ReactMarkdown components={mdComponents}>
                {message.content}
              </ReactMarkdown>
              {message.actions && message.actions.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {message.actions.map((action, i) =>
                    action.type === "download" ? (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCvModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
                      >
                        <ContactIcon type={action.type} />
                        {action.label}
                      </button>
                    ) : (
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
                    )
                  )}
                </div>
              )}
              <CvPreviewModal open={cvModalOpen} onClose={() => setCvModalOpen(false)} />
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
