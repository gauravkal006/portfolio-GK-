export const profile = {
  name: "Gaurav Kalamkhede",
  firstName: "Gaurav",
  initials: "GK",
  title: "Full-Stack Developer & AI/ML Enthusiast",
  roles: ["Full-Stack Developer", "AI/ML Enthusiast", "Java Full-Stack Developer", "Computer Science Engineer"],
  location: "Amravati, Maharashtra",
  email: "gauravkal66@gmail.com",
  github: "https://github.com/gauravkal006",
  githubUser: "gauravkal006",
  linkedin: "https://www.linkedin.com/in/gaurav-k-137336237/",
  resume: "/resume.pdf",
  // Profile photo for the hero, framed in the arch (public/profile.webp, 900×1200 portrait).
  // Set to null to show the geometric sunrise illustration instead.
  photo: "profile.webp" as string | null,
  resumeFileName: "Gaurav-Kalamkhede-Resume.pdf",
  statement: "I build full-stack web apps, and AI tools that",
  statementEm: "read real documents.",
  intro:
    "Computer Science Engineering student at PRMITR, Amravati. I work mostly with Java, React and Node.js, and lately on retrieval-augmented systems that answer questions from typed, scanned and handwritten notes.",
} as const;

// Small cards that float beside the profile card in the hero. Facts only from the resume/projects.
export type HeroFact = { label: string; value: string; sub: string; glyph: "circle" | "half" | "square" | "triangle" | "arch" | "quarter" };
export const heroFacts: { left: HeroFact[]; right: HeroFact[] } = {
  left: [
    { label: "Studying", value: "B.Tech CSE", sub: "PRMITR · CGPA 8.1", glyph: "arch" },
    { label: "Interned", value: "Java full-stack", sub: "Compilers Technologies", glyph: "circle" },
    { label: "Based in", value: "Amravati", sub: "Maharashtra, India", glyph: "half" },
  ],
  right: [
    { label: "Recently built", value: "Validify", sub: "Angular 19 · .NET 9 · Azure", glyph: "square" },
    { label: "Daily stack", value: "Java · React", sub: "Spring Boot · Node.js", glyph: "triangle" },
    { label: "Exploring", value: "RAG & OCR", sub: "Answering questions from notes", glyph: "quarter" },
  ],
};

// Quote shown above the profile card. A real, attributed quote; replace with your own if you like.
export const heroQuote = {
  text: "Simplicity is prerequisite for reliability.",
  author: "Edsger W. Dijkstra",
};

// Competitive-programming profiles. Hidden until real handles are added: set `url` to the
// profile address (e.g. "https://leetcode.com/u/<handle>/") to show a platform.
export const codingProfiles: { name: string; short: string; color: string; url: string | null }[] = [
  { name: "LeetCode", short: "LC", color: "#FFA116", url: "https://leetcode.com/u/gauravkal66/" },
  { name: "HackerRank", short: "HR", color: "#2EC866", url: "https://www.hackerrank.com/profile/gauravkal66" },
  { name: "Codeforces", short: "CF", color: "#1F8ACB", url: null },
  { name: "CodeChef", short: "CC", color: "#B7834F", url: null },
];

// `index` matches the section's folio number (Nº) on the page.
export const navItems = [
  { id: "about", label: "About", index: "01" },
  { id: "skills", label: "Skills", index: "02" },
  { id: "projects", label: "Work", index: "03" },
  { id: "experience", label: "Journey", index: "05" },
  { id: "resume", label: "Resume", index: "07" },
  { id: "contact", label: "Contact", index: "08" },
] as const;
