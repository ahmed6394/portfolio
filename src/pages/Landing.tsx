import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";

export default function Landing() {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      {/* Later: ProductionMindset, MindsetSection, GetInTouch */}
    </main>
  );
}
