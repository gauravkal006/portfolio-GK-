import { MotionConfig } from "motion/react";
import { AboutSection } from "./components/AboutSection";
import { CertificatesSection } from "./components/CertificatesSection";
import { CertificateViewer } from "./components/CertificateViewer";
import { BackToTop } from "./components/BackToTop";
import { BottomNav } from "./components/BottomNav";
import { ContactSection } from "./components/ContactSection";
import { ExperienceSection } from "./components/ExperienceSection";
import { FeaturedProjects } from "./components/FeaturedProjects";
import { GalaxyBackground } from "./components/GalaxyBackground";
import { Footer } from "./components/Footer";
import { GitHubActivity } from "./components/GitHubActivity";
import { HeroSection } from "./components/HeroSection";
import { IntroScreen } from "./components/IntroScreen";
import { Navbar } from "./components/Navbar";
import { ResumeSection } from "./components/ResumeSection";
import { ResumeViewer } from "./components/ResumeViewer";
import { ScrollProgress } from "./components/ScrollProgress";
import { SkillsSection } from "./components/SkillsSection";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="fixed top-3 left-3 z-[70] -translate-y-24 bg-ink px-4 py-2 text-sm font-medium text-bg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <IntroScreen />
      <GalaxyBackground />
      <ScrollProgress />
      <Navbar />
      <main id="main" tabIndex={-1} className="outline-none">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <FeaturedProjects />
        <GitHubActivity />
        <ExperienceSection />
        <CertificatesSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
      <ResumeViewer />
      <CertificateViewer />
      <BackToTop />
      <BottomNav />
    </MotionConfig>
  );
}
