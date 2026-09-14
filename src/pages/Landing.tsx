import Hero from "../components/Hero";
import About from "../components/About";
import TechStack from "../components/TechStack";
import Projects from "../components/Projects";
import ProductionMindset from "../components/ProductionMindset";
import GetInTouch from "../components/GetInTouch";

export default function Landing({ onOpenCV }: { onOpenCV: () => void }) {
  return (
    <main>
      <Hero onOpenCV={onOpenCV} />
      <About />
      <TechStack />
      <Projects />
      <ProductionMindset />
      <GetInTouch />
    </main>
  );
}
