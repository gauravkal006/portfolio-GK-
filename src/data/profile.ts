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
  // Profile photo for the About section. Put the image in public/ (e.g. public/profile.jpg,
  // portrait ~800×1000) and set this to "/profile.jpg". While null, a GK monogram is shown.
  photo: null as string | null,
  resumeFileName: "Gaurav-Kalamkhede-Resume.pdf",
  intro:
    "Computer Science Engineering student at PRMITR, Amravati. I build full-stack web apps with Java, React, and Node.js, and AI tools that read, reason over, and answer questions from real documents.",
} as const;

// Competitive-programming profiles. SAMPLE LINKS: replace YOUR_USERNAME with your real handles.
// Set `url` to null to hide a platform.
export const codingProfiles: { name: string; short: string; color: string; url: string | null }[] = [
  { name: "LeetCode", short: "LC", color: "#FFA116", url: "https://leetcode.com/u/YOUR_USERNAME/" },
  { name: "HackerRank", short: "HR", color: "#2EC866", url: "https://www.hackerrank.com/profile/YOUR_USERNAME" },
  { name: "Codeforces", short: "CF", color: "#1F8ACB", url: "https://codeforces.com/profile/YOUR_USERNAME" },
  { name: "CodeChef", short: "CC", color: "#B7834F", url: "https://www.codechef.com/users/YOUR_USERNAME" },
];

export const navItems = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "resume", label: "Resume" },
  { id: "contact", label: "Contact" },
] as const;
