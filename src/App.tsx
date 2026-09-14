import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CVModal from "./components/CVModal";
import Landing from "./pages/Landing";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";

export default function App() {
  const [cvOpen, setCvOpen] = useState(false);
  return (
    <div className="min-h-screen bg-base text-primary">
      <Navbar onOpenCV={() => setCvOpen(true)} />
      {cvOpen && <CVModal onClose={() => setCvOpen(false)} />}
      <Routes>
        <Route path="/" element={<Landing onOpenCV={() => setCvOpen(true)} />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}
