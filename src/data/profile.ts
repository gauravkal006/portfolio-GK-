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
  resumeFileName: "Gaurav-Kalamkhede-Resume.pdf",
  intro:
    "Computer Science Engineering student at PRMITR, Amravati. I build full-stack web apps with Java, React, and Node.js, and AI tools that read, reason over, and answer questions from real documents.",
} as const;

export const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
] as const;
