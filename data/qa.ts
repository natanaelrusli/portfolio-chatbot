export interface QAEntry {
  keywords: string[];
  answer: string;
  actions?: {
    label: string;
    url: string;
    type: "email" | "linkedin" | "github" | "external" | "download";
  }[];
}

export const qaEntries: QAEntry[] = [
  {
    keywords: [
      "hi",
      "hello",
      "hey",
      "greetings",
      "howdy",
      "good morning",
      "good afternoon",
      "good evening",
    ],
    answer:
      "Hello! Thanks for stopping by. I'm Nata Nael — ask me about my experience, projects, technical skills, or how to get in touch. How can I help you today?",
  },
  {
    keywords: [
      "how are you",
      "how are u",
      "what's up",
      "whats up",
      "how do you do",
    ],
    answer:
      "Doing well, thanks for asking! I'm here to share my professional background and projects. What would you like to know?",
  },
  {
    keywords: [
      "background",
      "about",
      "who",
      "introduction",
      "introduce",
      "yourself",
    ],
    answer:
      "Hi! My name is Nael. I'm a Software Engineer with experience of building enterprise grade web-apps and internal tools across ERP, Internal Tools, supply chain, and ad-tech projects. Experienced in maintaining production apps, developing feature development and mentoring 100+ engineers.",
  },
  {
    keywords: [
      "experience",
      "work",
      "career",
      "job",
      "history",
      "professional",
    ],
    answer:
      "Here's a summary of my professional experience:\n\n- **Senior Frontend Engineer at Synapsis.id** (April 2025 – Present): Developing and maintaining 7+ client projects, focusing on ERP systems and internal tools that streamline workflows through IoT, while improving reliability and reducing bugs in production systems.\n\n- **Frontend Engineer and Technical Trainer at Shopee** (Jul 2022 – Mar 2025): Built internal LMS and Survey Management systems for 1000+ employees across multiple countries, automated HRIS data integration, and mentored 100+ engineers to improve onboarding and performance.\n\n- **Frontend Engineer at StickEarn** (Dec 2021 – June 2022): Developed an advertising media dashboard for 50+ digital and mobile billboards, enhanced an advertisement monitoring dashboard, and created an internal component system with Storybook to speed up frontend development.",
  },
  {
    keywords: [
      "skill",
      "tech",
      "technology",
      "stack",
      "tools",
      "programming",
      "language",
    ],
    answer:
      "Here are my core technical skills:\n\n- **Languages:** TypeScript, JavaScript, Python, Go\n- **Frontend:** React, Next.js, Vue.js, Tailwind CSS\n- **Backend:** Node.js, Express, FastAPI, GraphQL\n- **Databases:** PostgreSQL, MongoDB, Redis\n- **DevOps:** Docker, Kubernetes, AWS, CI/CD\n- **Other:** System Design, Agile/Scrum, Technical Writing",
  },
  {
    keywords: [
      "project",
      "portfolio",
      "built",
      "build",
      "developed",
      "impactful",
    ],
    answer:
      "I'm particularly proud of:\n\n- **Shopee Internal LMS and Survey** — internal apps I built (not publicly available)\n- **Backend Learning** in the SegoKuning BE project — demonstrates my backend skills, especially with Go\n- **StickEarn component library** — improved development velocity and standardized design across apps\n\nTogether they reflect my ability to ship enterprise-grade web apps and backend systems.",
    actions: [
      {
        label: "SegoKuning",
        url: "https://github.com/natanaelrusli/SegoKuning-be",
        type: "github",
      },
      {
        label: "Stick Component",
        url: "https://github.com/stickearncom/stick-component",
        type: "github",
      },
    ],
  },
  {
    keywords: [
      "education",
      "degree",
      "university",
      "school",
      "study",
      "studied",
    ],
    answer:
      "I hold a **S1 Sistem Informasi** from Kwik Kian Gie School of Business (2015–2019). I graduated with honors; named best graduate of the 2015 batch.",
  },
  {
    keywords: [
      "cv",
      "resume",
      "see your cv",
      "your cv",
      "download cv",
      "get your cv",
      "curriculum",
    ],
    answer:
      "You can download my CV below. It includes my experience, skills, education, and contact details.",
    actions: [
      {
        label: "Download CV",
        url: "/api/download-cv",
        type: "download",
      },
    ],
  },
  {
    keywords: ["contact", "email", "reach", "linkedin", "github", "hire"],
    answer: "You can reach me through the following channels:",
    actions: [
      {
        label: "Email Me",
        url: "mailto:your.contact@natanaelrusli.com",
        type: "email",
      },
      {
        label: "LinkedIn",
        url: "https://linkedin.com/in/natanaelrusli",
        type: "linkedin",
      },
      {
        label: "GitHub",
        url: "https://github.com/natanaelrusli",
        type: "github",
      },
    ],
  },
  {
    keywords: ["senior", "fit", "why", "hire", "strength", "good"],
    answer:
      "I believe I'm a strong fit for a senior role because I have strong problem-solving skills, experience thinking about project architecture, and the ability to identify potential issues in an approach early.",
    actions: [
      {
        label: "View Resume",
        url: "https://linkedin.com/in/natanaelrusli",
        type: "linkedin",
      },
    ],
  },
  {
    keywords: ["interest", "hobby", "passion", "fun", "outside"],
    answer:
      "Outside of work, I'm passionate about gaming, watching movies and series, and exploring the automotive world.",
  },
  {
    keywords: ["language", "speak", "spoken", "fluent"],
    answer: "I speak **English** (Native) and **Spanish** (Conversational).",
  },
  {
    keywords: ["location", "live", "where", "city", "country", "based"],
    answer:
      "I am currently based in Jakarta, Indonesia and I am open to both remote work and relocation for the right opportunity.",
  },
  {
    keywords: ["focus", "learning", "now", "current", "studying"],
    answer:
      "Currently, I'm deepening my expertise in **GIS Web App** with Cesium JS and Geospatial Data, exploring and setting up my own **Home Server**. I'm also working on improving my skills in **Go** and **Rust** for high-performance backend services.",
  },
  {
    keywords: ["project", "projects", "portfolio", "github", "show", "work"],
    answer:
      "You can find my work on **GitHub** ([github.com/natanaelrusli](https://github.com/natanaelrusli)).",
    actions: [
      {
        label: "GitHub Profile",
        url: "https://github.com/natanaelrusli",
        type: "github",
      },
    ],
  },
];

const FALLBACK =
  "I'm not sure I have an answer for that. Try asking about my experience, skills, projects, education, certifications, or contact info! You can also check my [Linkedin](https://www.linkedin.com/in/natanaelrusli/) or [GitHub](https://github.com/natanaelrusli).";

export function findAnswer(query: string): {
  answer: string;
  actions?: QAEntry["actions"];
} {
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
