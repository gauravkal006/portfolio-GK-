const { useState } = React;

const projects = [
  {
    name: "Fruit Freshness Detection",
    code: "VISION / AI",
    category: "AI & ML",
    language: "Python",
    description: "A two-stage vision system that predicts banana, apple, and orange freshness and pinpoints decay using computer vision.",
    stack: ["YOLOv11", "ONNX", "TensorFlow Lite"],
    repository: "https://github.com/gauravkal006/Fruit_freshness_detection"
  },
  {
    name: "DocBlendAI",
    code: "DOCUMENTS / AI",
    category: "AI & ML",
    language: "Python",
    description: "A multi-format document question-answering assistant that labels answers by reliability, from certain to unreadable.",
    stack: ["Document AI", "OCR", "Q&A"],
    repository: "https://github.com/gauravkal006/DocBlendAI"
  },
  {
    name: "Smart Document Assistant",
    code: "DOCUMENTS / AI",
    category: "AI & ML",
    language: "TypeScript",
    description: "An AI-powered PDF workspace for summaries, key points, translation, question answering, and retrieval-augmented chat.",
    stack: ["Next.js", "FastAPI", "RAG"],
    repository: "https://github.com/gauravkal006/smart-document-assistant"
  },
  {
    name: "ExamShield-X",
    code: "EDTECH / AI",
    category: "AI & ML",
    language: "Python",
    description: "An online exam-proctoring demo with browser-based webcam monitoring, violation detection, and exam locking.",
    stack: ["Computer Vision", "Next.js", "Python"],
    repository: "https://github.com/gauravkal006/ExamShield-X"
  },
  {
    name: "StoreMyFiles",
    code: "CLOUD / FULL STACK",
    category: "Full stack",
    language: "JavaScript",
    description: "A cloud storage app for uploading, previewing, organizing, sharing, and restoring files.",
    stack: ["React", "Express", "Cloud storage"],
    repository: "https://github.com/gauravkal006/storemyfiles",
    demo: "https://storemyfiles.vercel.app"
  },
  {
    name: "myWallet Expense Tracker",
    code: "FINANCE / FULL STACK",
    category: "Full stack",
    language: "JavaScript",
    description: "A full-stack expense tracker for managing income, understanding spending habits, and visualizing finances.",
    stack: ["React", "Spring Boot", "MySQL"],
    repository: "https://github.com/gauravkal006/Expense-tracker-java"
  },
  {
    name: "Home Decor Platform",
    code: "COMMERCE / FULL STACK",
    category: "Full stack",
    language: "Java",
    description: "A full-stack Java learning project exploring e-commerce, service architecture, containers, and cloud infrastructure.",
    stack: ["Spring Boot", "React", "PostgreSQL"],
    repository: "https://github.com/gauravkal006/home-decor"
  },
  {
    name: "Weather App",
    code: "WEATHER / WEB APP",
    category: "Web experience",
    language: "JavaScript",
    description: "A responsive weather app for searching cities and exploring current conditions, detailed metrics, and map locations.",
    stack: ["React", "Weather API", "Maps"],
    repository: "https://github.com/gauravkal006/weather-app",
    demo: "https://gauravkal006.github.io/weather-app/"
  },
  {
    name: "Scroll-Driven Hero Animation",
    code: "MOTION / WEB",
    category: "Web experience",
    language: "JavaScript",
    description: "A scroll-led hero where a car travels across the page as the road, headline, and statistic panels animate into view.",
    stack: ["JavaScript", "CSS", "Scroll animation"],
    repository: "https://github.com/gauravkal006/Scroll-Driven-Hero-Section-Animation",
    demo: "https://gauravkal006.github.io/Scroll-Driven-Hero-Section-Animation/"
  },
  {
    name: "Lumière AR Store",
    code: "FASHION / WEB AR",
    category: "Web experience",
    language: "JavaScript",
    description: "An augmented-reality fashion storefront concept with virtual try-on and AI-assisted size recommendations.",
    stack: ["MediaPipe", "Web AR", "E-commerce"],
    repository: "https://github.com/gauravkal006/webion_AR"
  }
];

function ProjectGallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(projects.map((project) => project.category))];
  const visibleProjects = activeCategory === "All"
    ? projects
    : projects.filter((project) => project.category === activeCategory);

  return (
    <>
      <div className="project-tools" role="group" aria-label="Filter projects by category">
        {categories.map((category) => (
          <button
            className="filter-button"
            type="button"
            key={category}
            aria-pressed={activeCategory === category}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="project-grid" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <article className="project-card" key={project.repository}>
            <div className="project-visual" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <span className="project-number">{project.code} · {project.language}</span>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tags" aria-label="Technologies">
              {project.stack.map((technology) => <span className="tag" key={technology}>{technology}</span>)}
            </div>
            <div className="project-links">
              <a className="project-link" href={project.repository} target="_blank" rel="noopener noreferrer">Source code <span aria-hidden="true">↗</span></a>
              {project.demo && <a className="project-link" href={project.demo} target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("github-projects")).render(<ProjectGallery />);
if (window.initProjectMotion) requestAnimationFrame(window.initProjectMotion);