import React from "react";
import {
  Home,
  LayoutTemplate,
  Palette,
  Image as ImageIcon,
  Heart,
  Camera,
  Music,
  BarChart3,
  Star,
  Settings,
  UserCheck,
  LogOut,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";

export type AdminTab =
  | "overview"
  | "hero"
  | "templates"
  | "images"
  | "wishes"
  | "gallery"
  | "music"
  | "analytics"
  | "reviews"
  | "settings"
  | "profile";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onGoToWebsite: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onGoToWebsite,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const { logout, sessionTimer } = useAdminAuth();

  const menuItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "overview", label: "Dashboard Overview", icon: Home },
    { id: "hero", label: "Hero Section", icon: LayoutTemplate },
    { id: "templates", label: "Theme Templates", icon: Palette },
    { id: "images", label: "Image Library", icon: ImageIcon },
    { id: "wishes", label: "Wishes", icon: Heart },
    { id: "gallery", label: "Photo Gallery", icon: Camera },
    { id: "music", label: "Music Library", icon: Music },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "settings", label: "Website Settings", icon: Settings },
    { id: "profile", label: "Admin Profile", icon: UserCheck },
  ];

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#1E1418] border-r border-[#EE4374]/20 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#EE4374] to-pink-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              CMS
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight font-serif-display">
                CelebrationCraft
              </h2>
              <p className="text-[10px] text-[#EE4374] font-semibold uppercase tracking-wider">
                Admin Control Panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-[#A8949B] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#EE4374] text-white shadow-lg shadow-[#EE4374]/30"
                    : "text-[#A8949B] hover:bg-[#281B20] hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#EE4374]"}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </button>
            );
          })}
        </nav>

        {/* Footer Info & Logout */}
        <div className="p-4 border-t border-white/10 space-y-3 bg-[#181114]/60">
          {/* Session Timer Badge */}
          <div className="flex items-center justify-between text-[11px] text-[#A8949B] bg-[#23171B] px-3 py-2 rounded-xl border border-white/5">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Session Timeout:
            </span>
            <span className="font-mono font-bold text-amber-300">
              {formatTimer(sessionTimer)}
            </span>
          </div>

          <button
            onClick={onGoToWebsite}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-[#FCE7EC] bg-[#281B20] hover:bg-[#34232A] transition-colors cursor-pointer border border-white/5"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#EE4374]" />
            <span>Preview Public Site</span>
          </button>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 transition-colors cursor-pointer border border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
