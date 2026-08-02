import React, { useState } from "react";
import { AdminSidebar, AdminTab } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminOverview } from "./AdminOverview";
import { AdminHeroEditor } from "./AdminHeroEditor";
import { AdminTemplates } from "./AdminTemplates";
import { AdminImageLibrary } from "./AdminImageLibrary";
import { AdminWishes } from "./AdminWishes";
import { AdminPhotoGallery } from "./AdminPhotoGallery";
import { AdminMusicLibrary } from "./AdminMusicLibrary";
import { AdminAnalytics } from "./AdminAnalytics";
import { AdminReviews } from "./AdminReviews";
import { AdminSettings } from "./AdminSettings";
import { AdminProfile } from "./AdminProfile";

interface AdminDashboardProps {
  onGoToWebsite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onGoToWebsite }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview onSelectTab={setActiveTab} />;
      case "hero":
        return <AdminHeroEditor />;
      case "templates":
        return <AdminTemplates />;
      case "images":
        return <AdminImageLibrary />;
      case "wishes":
        return <AdminWishes />;
      case "gallery":
        return <AdminPhotoGallery />;
      case "music":
        return <AdminMusicLibrary />;
      case "analytics":
        return <AdminAnalytics />;
      case "reviews":
        return <AdminReviews />;
      case "settings":
        return <AdminSettings />;
      case "profile":
        return <AdminProfile />;
      default:
        return <AdminOverview onSelectTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#181114] text-[#FCE7EC] font-sans flex select-none">
      {/* Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onGoToWebsite={onGoToWebsite}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Panel Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onGoToWebsite={onGoToWebsite}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          {renderActiveTabContent()}
        </main>
      </div>
    </div>
  );
};
