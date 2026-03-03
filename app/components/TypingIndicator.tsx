"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2"
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-indigo-600 text-[10px] font-bold text-white">
        NN
      </div>
      <div className="flex items-center gap-1 rounded-2xl px-3 py-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
