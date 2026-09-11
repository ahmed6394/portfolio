import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";

export default function Landing() {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      {/* Later: Projects, ProductionMindset, MindsetSection, GetInTouch */}
    </main>
  );
}
