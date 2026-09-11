import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import ProductionMindset from "../components/ProductionMindset";
import MindsetSection from "../components/MindsetSection";
import GetInTouch from "../components/GetInTouch";

export default function Landing() {
  return (
    <main>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <ProductionMindset />
      <MindsetSection />
      <GetInTouch />
    </main>
  );
}
