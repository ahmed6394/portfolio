import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import BackToTop from "./components/BackToTop";
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
  useEffect(() => {
    try {
      if (sessionStorage.getItem("visit-logged")) return;
      sessionStorage.setItem("visit-logged", "1");
      fetch("/.netlify/functions/log-visit", { method: "GET" }).catch(() => {});
    } catch {
      /* sessionStorage unavailable → skip */
    }
  }, []);
  return (
    <div className="min-h-screen bg-base text-primary">
      <ScrollToTop />
      <BackToTop />
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
