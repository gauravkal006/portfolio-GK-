export type ProjectCategory = "AI & ML" | "Full stack" | "Web experience";
export type ProjectMotif = "cloud" | "documents" | "shield" | "vision" | "finance" | "commerce" | "weather" | "motion" | "ar" | "exam";

export type Project = {
  name: string;
  label: string;
  category: ProjectCategory;
  motif: ProjectMotif;
  description: string;
  highlights?: string[];
  stack: string[];
  year?: string;
  repo: string;
  demo?: string;
  featured?: boolean;
  /**
   * Screenshot of the project, e.g. "images/projects/storemyfiles.webp" (a file in
   * public/images/projects/, ideally 1600×1000). Leave unset to show the illustrated template.
   */
  preview?: string;
};

const gh = (repo: string) => `https://github.com/gauravkal006/${repo}`;

export const projects: Project[] = [
  {
    name: "StoreMyFiles",
    label: "Cloud storage web app",
    category: "Full stack",
    motif: "cloud",
    year: "2026",
    description: "A full-stack cloud storage platform inspired by Google Drive for uploading, storing, previewing, sharing and managing files.",
    highlights: [
      "REST APIs in Node.js and Express.js backed by PostgreSQL for users and file data",
      "Responsive React interface with authentication and file management",
    ],
    stack: ["React", "Node.js", "Express.js", "PostgreSQL"],
    repo: gh("storemyfiles"),
    demo: "https://storemyfiles.vercel.app",
    preview: "images/projects/storemyfiles.webp",
    featured: true,
  },
  {
    name: "DocBlendAI",
    label: "Educational QA assistant",
    category: "AI & ML",
    motif: "documents",
    year: "Jan – June 2026",
    description: "A question-answering system that reads typed, scanned and handwritten academic documents and answers questions from them.",
    highlights: [
      "OCR and HTR for scanned and handwritten notes, with RAG to retrieve relevant content before answering",
      "Confidence labels show how reliable each answer is; evaluated with EM, semantic match, CER and WER",
    ],
    stack: ["Python", "RAG", "OCR", "HTR", "LLM"],
    repo: gh("DocBlendAI"),
    preview: "images/projects/docblendai.webp",
    featured: true,
  },
  {
    name: "Validify",
    label: "Certificate verification platform",
    category: "Full stack",
    motif: "shield",
    year: "June 2026",
    description: "A scalable certificate verification platform built on Angular 19 and a .NET 9 Web API with Clean Architecture and secure REST APIs.",
    highlights: [
      "Azure AD B2C authentication, role-based access control, JWT validation and Microsoft Graph user management",
      "Azure Functions, Key Vault, Blob Storage and SAS tokens for background jobs and protected file access",
      "Monitoring and diagnostics with Application Insights and Serilog",
    ],
    stack: ["Angular 19", ".NET 9", "Azure"],
    repo: gh("validify"),
    featured: true,
  },
  {
    name: "Smart Document Assistant",
    label: "AI PDF workspace",
    category: "AI & ML",
    motif: "documents",
    description: "An AI-powered PDF workspace for summaries, key points, translation, question answering and retrieval-augmented chat.",
    stack: ["Next.js", "FastAPI", "RAG"],
    repo: gh("smart-document-assistant"),
  },
  {
    name: "Fruit Freshness Detection",
    label: "Computer vision",
    category: "AI & ML",
    motif: "vision",
    description: "A two-stage vision system that predicts banana, apple and orange freshness and pinpoints decay.",
    stack: ["YOLOv11", "ONNX", "TensorFlow Lite"],
    repo: gh("Fruit_freshness_detection"),
    preview: "images/projects/fruit-freshness.webp",
  },
  {
    name: "ExamShield-X",
    label: "Exam proctoring",
    category: "AI & ML",
    motif: "exam",
    description: "An online exam-proctoring demo with browser-based webcam monitoring, violation detection and exam locking.",
    stack: ["Computer vision", "Next.js", "Python"],
    repo: gh("ExamShield-X"),
  },
  {
    name: "myWallet Expense Tracker",
    label: "Personal finance",
    category: "Full stack",
    motif: "finance",
    description: "A full-stack expense tracker for managing income, understanding spending habits and visualising finances.",
    stack: ["React", "Spring Boot", "MySQL"],
    repo: gh("Expense-tracker-java"),
  },
  {
    name: "Home Decor Platform",
    label: "E-commerce",
    category: "Full stack",
    motif: "commerce",
    description: "A full-stack Java learning project exploring e-commerce, service architecture, containers and cloud infrastructure.",
    stack: ["Spring Boot", "React", "PostgreSQL"],
    repo: gh("home-decor"),
  },
  {
    name: "Weather App",
    label: "Web app",
    category: "Web experience",
    motif: "weather",
    description: "A responsive weather app for searching cities and exploring current conditions, detailed metrics and map locations.",
    stack: ["React", "Weather API", "Maps"],
    repo: gh("weather-app"),
    demo: "https://gauravkal006.github.io/weather-app/",
    preview: "images/projects/weather-app.webp",
  },
  {
    name: "Scroll-Driven Hero Animation",
    label: "Motion study",
    category: "Web experience",
    motif: "motion",
    description: "A scroll-led hero where a car travels across the page as the road, headline and statistic panels animate into view.",
    stack: ["JavaScript", "CSS", "Scroll animation"],
    repo: gh("Scroll-Driven-Hero-Section-Animation"),
    demo: "https://gauravkal006.github.io/Scroll-Driven-Hero-Section-Animation/",
  },
  {
    name: "Lumière AR Store",
    label: "Web AR concept",
    category: "Web experience",
    motif: "ar",
    description: "An augmented-reality fashion storefront concept with virtual try-on and AI-assisted size recommendations.",
    stack: ["MediaPipe", "Web AR", "E-commerce"],
    repo: gh("webion_AR"),
  },
];

/** URL-safe id from the repository name, used for preview file names and animation ids. */
export const slugOf = (p: Project) => p.repo.split("/").pop()!.toLowerCase();

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
