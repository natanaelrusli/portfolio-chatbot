export interface QAEntry {
  keywords: string[];
  answer: string;
}

export const qaEntries: QAEntry[] = [
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
      "Here are two projects I'm proud of:\n\n- **Project Alpha** — A real-time collaborative document editor supporting 50+ concurrent users with conflict resolution. Built with React, WebSocket, Node.js, and Redis. Used by 2 internal teams and improved document workflow efficiency by 30%.\n\n- **Project Beta** — A CLI tool for automated database migration and schema versioning, built with Go and PostgreSQL. Open-sourced with 200+ GitHub stars.",
  },
  {
    keywords: ["education", "degree", "university", "school", "study", "studied"],
    answer:
      "I hold a **B.S. in Computer Science** from University Name (2016–2020). I graduated with honors, with a focus on distributed systems.",
  },
  {
    keywords: ["certification", "certified", "certificate"],
    answer:
      "I hold the following certifications:\n\n- AWS Certified Solutions Architect – Associate\n- Google Cloud Professional Cloud Developer",
  },
  {
    keywords: ["contact", "email", "reach", "linkedin", "github", "hire"],
    answer:
      "You can reach me through the following channels:\n\n- **Email:** your.email@example.com\n- **LinkedIn:** linkedin.com/in/yourprofile\n- **GitHub:** github.com/yourusername\n- **Location:** City, Country",
  },
  {
    keywords: ["senior", "fit", "why", "hire", "strength", "good"],
    answer:
      "I believe I'm a strong fit for a senior role because:\n\n- I've led platform development serving 100K+ users with measurable performance improvements.\n- I have experience mentoring junior developers and driving team productivity.\n- I'm comfortable across the full stack — frontend, backend, DevOps, and system design.\n- I've delivered open-source tooling adopted beyond my immediate team, showing initiative and impact beyond day-to-day work.",
  },
  {
    keywords: ["interest", "hobby", "passion", "fun", "outside"],
    answer:
      "Outside of work, I'm passionate about:\n\n- Contributing to open source projects\n- Technical blogging and knowledge sharing\n- Competitive programming",
  },
  {
    keywords: ["language", "speak", "spoken", "fluent"],
    answer:
      "I speak **English** (Native) and **Spanish** (Conversational).",
  },
];

const FALLBACK =
  "I'm not sure I have an answer for that. Try asking about my experience, skills, projects, education, certifications, or contact info!";

export function findAnswer(query: string): string {
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

  return bestMatch ? bestMatch.answer : FALLBACK;
}
