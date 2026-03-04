export interface QAEntry {
  keywords: string[];
  answer: string;
  actions?: { label: string; url: string; type: "email" | "linkedin" | "github" | "external" }[];
}

export const qaEntries: QAEntry[] = [
  {
    keywords: ["hi", "hello", "hey", "greetings", "howdy", "good morning", "good afternoon", "good evening"],
    answer:
      "Hello! Thanks for stopping by. I'm Nata Nael — ask me about my experience, projects, technical skills, or how to get in touch. How can I help you today?",
  },
  {
    keywords: ["how are you", "how are u", "what's up", "whats up", "how do you do"],
    answer:
      "Doing well, thanks for asking! I'm here to share my professional background and projects. What would you like to know?",
  },
  {
    keywords: ["background", "about", "who", "introduction", "introduce", "yourself"],
    answer:
      "Hi! I'm a Software Engineer with a passion for building scalable web applications. I have experience working across the full stack — from crafting responsive UIs with React and Next.js to designing robust backend services with Node.js and Python. I'm currently focused on delivering impactful solutions using modern technologies.",
  },
  {
    keywords: ["experience", "work", "career", "job", "history", "professional"],
    answer:
      "Here's a summary of my professional experience:\n\n- **Senior Software Engineer at Company Name** (Jan 2023 – Present): Led development of a microservices platform serving 100K+ users, reduced API response times by 40%, and mentored 4 junior developers.\n\n- **Software Engineer at Previous Company** (Jun 2020 – Dec 2022): Built a customer-facing dashboard used by 500+ businesses, implemented CI/CD pipelines reducing deployment time by 60%, and contributed to open-source internal tooling.",
  },
  {
    keywords: ["skill", "tech", "technology", "stack", "tools", "programming", "language"],
    answer:
      "Here are my core technical skills:\n\n- **Languages:** TypeScript, JavaScript, Python, Go\n- **Frontend:** React, Next.js, Vue.js, Tailwind CSS\n- **Backend:** Node.js, Express, FastAPI, GraphQL\n- **Databases:** PostgreSQL, MongoDB, Redis\n- **DevOps:** Docker, Kubernetes, AWS, CI/CD\n- **Other:** System Design, Agile/Scrum, Technical Writing",
  },
  {
    keywords: ["project", "portfolio", "built", "build", "developed", "impactful"],
    answer:
      "I'm particularly proud of my work on Project Alpha and Project Beta. They showcase my ability to handle complex real-time systems and developer tooling.",
    actions: [
      { label: "View GitHub", url: "https://github.com/yourusername", type: "github" },
      { label: "Project Alpha", url: "https://github.com/yourusername/project-alpha", type: "external" },
    ],
  },
  {
    keywords: ["certification", "certified", "certificate"],
    answer:
      "I hold multiple industry-recognized certifications that validate my expertise in cloud architecture and development:",
    actions: [
      { label: "Verify on LinkedIn", url: "https://linkedin.com/in/yourprofile", type: "linkedin" },
    ],
  },
  {
    keywords: ["education", "degree", "university", "school", "study", "studied"],
    answer:
      "I hold a **B.S. in Computer Science** from University Name (2016–2020). I graduated with honors, with a focus on distributed systems.",
  },
  {
    keywords: ["contact", "email", "reach", "linkedin", "github", "hire"],
    answer:
      "You can reach me through the following channels:",
    actions: [
      { label: "Email Me", url: "mailto:your.email@example.com", type: "email" },
      { label: "LinkedIn", url: "https://linkedin.com/in/yourprofile", type: "linkedin" },
      { label: "GitHub", url: "https://github.com/yourusername", type: "github" },
    ],
  },
  {
    keywords: ["senior", "fit", "why", "hire", "strength", "good"],
    answer:
      "I believe I'm a strong fit for a senior role because:",
    actions: [
      { label: "View Resume", url: "https://linkedin.com/in/yourprofile", type: "external" },
    ],
  },
  {
    keywords: ["interest", "hobby", "passion", "fun", "outside"],
    answer:
      "Outside of work, I'm passionate about:",
  },
  {
    keywords: ["language", "speak", "spoken", "fluent"],
    answer:
      "I speak **English** (Native) and **Spanish** (Conversational).",
  },
  {
    keywords: ["location", "live", "where", "city", "country", "based"],
    answer: "I am currently based in **City, Country** and I am open to both remote work and relocation for the right opportunity.",
  },
  {
    keywords: ["focus", "learning", "now", "current", "studying"],
    answer: "Currently, I'm deepening my expertise in **System Design** and exploring **Generative AI** integration in web applications. I'm also working on improving my skills in **Go** and **Rust** for high-performance backend services.",
  },
  {
    keywords: ["project", "projects", "portfolio", "github", "show", "work"],
    answer: "You can find my work on **GitHub** ([github.com/yourusername](https://github.com/yourusername)). Notable projects include:\n\n- **Project Alpha**: A real-time collaborative editor.\n- **Project Beta**: A database migration CLI tool.\n\nType 'Tell me more about Project Alpha' for details!",
    actions: [
      { label: "GitHub Profile", url: "https://github.com/yourusername", type: "github" },
    ],
  },
  {
    keywords: ["alpha", "collaborative", "editor"],
    answer: "**Project Alpha** is a real-time collaborative document editor supporting 50+ concurrent users. \n- **Stack:** React, WebSocket, Node.js, Redis. \n- **Impact:** Improved document workflow efficiency by 30% for 2 internal teams.",
    actions: [
      { label: "View Project Alpha", url: "https://github.com/yourusername/project-alpha", type: "external" },
    ],
  },
  {
    keywords: ["beta", "migration", "cli"],
    answer: "**Project Beta** is a CLI tool for automated database migration and schema versioning. \n- **Stack:** Go, PostgreSQL. \n- **Recognition:** Open-sourced with 200+ GitHub stars.",
    actions: [
      { label: "View Project Beta", url: "https://github.com/yourusername/project-beta", type: "external" },
    ],
  },
];

const FALLBACK =
  "I'm not sure I have an answer for that. Try asking about my experience, skills, projects, education, certifications, or contact info!";

export function findAnswer(query: string): { answer: string; actions?: QAEntry["actions"] } {
  const normalized = query.toLowerCase();

  let bestMatch: QAEntry | null = null;
  let bestScore = 0;

  for (const entry of qaEntries) {
    const score = entry.keywords.filter((kw) => normalized.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch
    ? { answer: bestMatch.answer, actions: bestMatch.actions }
    : { answer: FALLBACK };
}
