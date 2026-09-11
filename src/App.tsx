import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import CaseStudies from "./pages/CaseStudies";

export default function App() {
  return (
    <div className="min-h-screen bg-base text-primary">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
