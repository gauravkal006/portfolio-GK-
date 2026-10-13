import { AboutSection } from "./components/AboutSection";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { BackToTop } from "./components/BackToTop";
import { ContactSection } from "./components/ContactSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { Footer } from "./components/Footer";
import { GitHubActivity } from "./components/GitHubActivity";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";
import { ResumeSection } from "./components/ResumeSection";
import { ScrollProgress } from "./components/ScrollProgress";
import { SkillsSection } from "./components/SkillsSection";

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[70] -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <AnimatedBackground />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <FeaturedProjects />
        <GitHubActivity />
        <ExperienceSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
