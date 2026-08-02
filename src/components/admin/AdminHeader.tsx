import React from "react";
import { Menu, ExternalLink, Database, Search, UserCheck, Sparkles, RefreshCw } from "lucide-react";
import { AdminTab } from "./AdminSidebar";
import { useCMS } from "../../context/CMSContext";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileSidebar: () => void;
  onGoToWebsite: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onGoToWebsite,
  searchTerm,
  setSearchTerm,
}) => {
  const { seedInitialDataIfEmpty } = useCMS();
  const [isSeeding, setIsSeeding] = React.useState(false);

  const tabTitles: Record<AdminTab, string> = {
    overview: "Dashboard Overview",
    hero: "Hero Section Editor",
    templates: "Theme Templates Management",
    images: "Image Library Manager",
    wishes: "Created Wishes & Cards",
    gallery: "Photo Gallery Manager",
    music: "Music Library & Player",
    analytics: "Platform Analytics & Stats",
    reviews: "Customer Reviews & Moderation",
    settings: "Global Website Settings",
    profile: "Admin Security & Profile",
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedInitialDataIfEmpty();
    setTimeout(() => {
      setIsSeeding(false);
      alert("Database synced with master default records successfully!");
    }, 600);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#1E1418]/90 backdrop-blur-md border-b border-[#EE4374]/20 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-[#281B20] text-[#EE4374] hover:bg-[#34232A]"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white font-serif-display tracking-tight">
            {tabTitles[activeTab]}
          </h1>
          <p className="text-[11px] text-[#A8949B] hidden sm:block font-medium">
            Changes save directly to Firestore database & update the live site instantly.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-[#A8949B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records..."
            className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-[#635158] outline-none focus:border-[#EE4374]"
          />
        </div>

        {/* Sync Database Button */}
        <button
          onClick={handleSeed}
          disabled={isSeeding}
          title="Sync default database schema"
          className="px-3 py-2 rounded-xl bg-[#281B20] hover:bg-[#34232A] text-xs font-semibold text-[#FCE7EC] border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Sync DB</span>
        </button>

        {/* View Live Site Button */}
        <button
          onClick={onGoToWebsite}
          className="flow-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Site</span>
        </button>

        {/* Admin Avatar Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-[#EE4374]/20 border border-[#EE4374]/40 flex items-center justify-center text-[#EE4374]">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="text-left hidden xl:block">
            <p className="text-xs font-bold text-white leading-tight">Site Owner</p>
            <p className="text-[10px] text-emerald-400 font-mono">Authenticated</p>
          </div>
        </div>
      </div>
    </header>
  );
};
