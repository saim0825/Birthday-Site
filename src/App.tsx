import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { CreatorStudio } from "./components/CreatorStudio";
import { TemplateGallery } from "./components/TemplateGallery";
import { ViewerPage } from "./components/ViewerPage";
import { CMSProvider } from "./context/CMSContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";

function AppContent() {
  const [currentView, setCurrentView] = useState<"landing" | "creator" | "gallery" | "view" | "admin">("landing");
  const [activeCardId, setActiveCardId] = useState<string>("birthday-demo");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("interactive-suite");

  const { isAuthenticated, user, logout } = useAdminAuth();

  useEffect(() => {
    // Check path for deep linking
    const path = window.location.pathname;

    if (path === "/admin" || path === "/dashboard") {
      setCurrentView("admin");
      return;
    }

    const match = path.match(/^\/w\/(.+)/);
    if (match && match[1]) {
      setActiveCardId(match[1]);
      setCurrentView("view");
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === "/admin" || p === "/dashboard") {
        setCurrentView("admin");
      } else {
        const m = p.match(/^\/w\/(.+)/);
        if (m && m[1]) {
          setActiveCardId(m[1]);
          setCurrentView("view");
        } else {
          setCurrentView("landing");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (view: "landing" | "creator" | "gallery" | "view" | "admin", cardId?: string) => {
    if (cardId) {
      setActiveCardId(cardId);
      window.history.pushState({}, "", `/w/${cardId}`);
    } else if (view === "admin") {
      window.history.pushState({}, "", "/admin");
    } else if (view === "landing") {
      window.history.pushState({}, "", "/");
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (currentView === "admin") {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setCurrentView("admin");
          }}
          onGoToWebsite={() => handleNavigate("landing")}
        />
      );
    }
    return <AdminDashboard onGoToWebsite={() => handleNavigate("landing")} />;
  }

  return (
    <div className="min-h-screen flow-bg-mesh text-[#2A1A1F] font-sans antialiased selection:bg-[#EE4374] selection:text-white">
      {/* Show Navbar on all views except full viewer and admin */}
      <Navbar onNavigate={(v) => handleNavigate(v)} currentView={currentView as any} />

      <main>
        {currentView === "landing" && (
          <LandingPage
            onNavigate={(v, id) => handleNavigate(v, id)}
            onSelectTemplate={(tid) => setSelectedTemplateId(tid)}
          />
        )}

        {currentView === "gallery" && (
          <TemplateGallery
            onSelectTemplate={(tid) => {
              setSelectedTemplateId(tid);
              handleNavigate("creator");
            }}
            onPreviewDemo={(cid) => handleNavigate("view", cid)}
          />
        )}

        {currentView === "creator" && (
          <CreatorStudio
            initialTemplateId={selectedTemplateId}
            onCreatedCard={(card) => {
              setActiveCardId(card.id);
            }}
            onNavigate={(v, id) => handleNavigate(v, id)}
          />
        )}

        {currentView === "view" && (
          <ViewerPage cardId={activeCardId} onNavigate={(v, id) => handleNavigate(v, id)} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <CMSProvider>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </CMSProvider>
  );
}
