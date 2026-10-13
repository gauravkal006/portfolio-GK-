export type SkillGroup = {
  id: "languages" | "frontend" | "backend" | "data" | "ai" | "tools";
  title: string;
  note: string;
  items: string[];
};

// Every entry comes from the resume or from a project listed on this site.
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    title: "Languages",
    note: "Core languages from coursework and projects",
    items: ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "SQL", "HTML / CSS"],
  },
  {
    id: "backend",
    title: "Backend",
    note: "APIs, services and server-side architecture",
    items: ["Spring Boot", "Java backend", "Node.js", "Express.js", "RESTful APIs", "MVC architecture", "Authentication & authorization", "FastAPI", ".NET 9 Web API"],
  },
  {
    id: "frontend",
    title: "Frontend",
    note: "Interfaces that work on every screen",
    items: ["React", "Next.js", "Angular 19", "Tailwind CSS", "Responsive UI", "Accessibility"],
  },
  {
    id: "data",
    title: "Databases & cloud",
    note: "Storing, securing and serving data",
    items: ["PostgreSQL", "MySQL", "Azure Functions", "Azure Blob Storage", "Azure AD B2C", "Key Vault"],
  },
  {
    id: "ai",
    title: "AI / ML",
    note: "Document intelligence and computer vision",
    items: ["RAG", "LLMs", "OCR", "HTR", "YOLOv11", "TensorFlow Lite", "ONNX", "MediaPipe"],
  },
  {
    id: "tools",
    title: "Tools & platforms",
    note: "Day-to-day developer tooling",
    items: ["Git", "GitHub", "Linux", "VS Code", "Eclipse"],
  },
];
