import React from "react";
import { useCMS } from "../../context/CMSContext";
import {
  Users,
  Eye,
  Palette,
  Heart,
  Download,
  ArrowUpRight,
  Sparkles,
  LayoutTemplate,
  Image as ImageIcon,
  Settings,
  Star,
  Music,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface AdminOverviewProps {
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onSelectTab }) => {
  const { analytics, wishes, templates, reviews, hero, settings } = useCMS();

  const metrics = [
    {
      title: "Total Visitors",
      value: analytics.visitorsCount.toLocaleString(),
      change: "+12.4% this month",
      icon: Users,
      color: "from-[#EE4374] to-pink-600",
    },
    {
      title: "Total Page Views",
      value: analytics.pageViewsCount.toLocaleString(),
      change: "+18.2% this month",
      icon: Eye,
      color: "from-purple-600 to-indigo-600",
    },
    {
      title: "Active Templates",
      value: templates.length.toString(),
      change: "All systems operational",
      icon: Palette,
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Total Wishes Created",
      value: (wishes.length + analytics.totalWishesCount).toLocaleString(),
      change: "+2.4K today",
      icon: Heart,
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Card Downloads",
      value: analytics.downloadsCount.toLocaleString(),
      change: "PDF & PNG Exports",
      icon: Download,
      color: "from-blue-500 to-cyan-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Greeting */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#2A1820] via-[#23171B] to-[#1E1418] border border-[#EE4374]/30 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#EE4374]/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EE4374]/20 border border-[#EE4374]/30 text-[#EE4374] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Database Connected & Live</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif-display">
              Welcome back, Website Admin
            </h2>
            <p className="text-xs sm:text-sm text-[#A8949B] max-w-xl">
              You have full administrative control over <strong className="text-white">{settings.siteName}</strong>. Any changes you make here update the live website immediately.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab("hero")}
              className="flow-btn-primary px-5 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>Edit Hero Section</span>
            </button>
            <button
              onClick={() => onSelectTab("settings")}
              className="px-4 py-3 rounded-2xl bg-[#281B20] hover:bg-[#34232A] text-xs font-bold text-[#FCE7EC] border border-white/10 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Settings className="w-4 h-4 text-[#EE4374]" />
              <span>Site Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#1E1418] border border-[#EE4374]/20 hover:border-[#EE4374]/40 transition-all shadow-md group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#A8949B] uppercase tracking-wider">
                  {m.title}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${m.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white font-serif-display">
                {m.value}
              </div>
              <p className="text-[11px] text-[#EE4374] font-medium mt-1">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Access Control Modules */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#EE4374]" />
          <span>Quick Admin Controls</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onSelectTab("hero")}
            className="p-5 rounded-2xl bg-[#1E1418] border border-white/10 hover:border-[#EE4374] text-left transition-all cursor-pointer group hover:bg-[#281B20]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EE4374]/20 text-[#EE4374] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#EE4374] transition-colors">
              Edit Hero Section
            </h4>
            <p className="text-xs text-[#A8949B] mt-1">
              Headline, subheading, buttons, background artwork & badges
            </p>
          </button>

          <button
            onClick={() => onSelectTab("templates")}
            className="p-5 rounded-2xl bg-[#1E1418] border border-white/10 hover:border-[#EE4374] text-left transition-all cursor-pointer group hover:bg-[#281B20]"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#EE4374] transition-colors">
              Manage Templates
            </h4>
            <p className="text-xs text-[#A8949B] mt-1">
              Add, edit, hide, publish, or duplicate theme templates
            </p>
          </button>

          <button
            onClick={() => onSelectTab("images")}
            className="p-5 rounded-2xl bg-[#1E1418] border border-white/10 hover:border-[#EE4374] text-left transition-all cursor-pointer group hover:bg-[#281B20]"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#EE4374] transition-colors">
              Image Library
            </h4>
            <p className="text-xs text-[#A8949B] mt-1">
              Upload, replace, delete, and organize image assets
            </p>
          </button>

          <button
            onClick={() => onSelectTab("music")}
            className="p-5 rounded-2xl bg-[#1E1418] border border-white/10 hover:border-[#EE4374] text-left transition-all cursor-pointer group hover:bg-[#281B20]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-[#EE4374] transition-colors">
              Music & Soundtracks
            </h4>
            <p className="text-xs text-[#A8949B] mt-1">
              Manage audio tracks, default player settings & volume
            </p>
          </button>
        </div>
      </div>

      {/* Recent Created Wishes & System Status Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wishes List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#EE4374]" />
              <h3 className="text-base font-bold text-white">Recent Created Wishes</h3>
            </div>
            <button
              onClick={() => onSelectTab("wishes")}
              className="text-xs text-[#EE4374] hover:underline font-semibold"
            >
              View All ({wishes.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#FCE7EC]">
              <thead className="border-b border-white/10 text-[#A8949B] uppercase font-mono">
                <tr>
                  <th className="pb-3">Recipient</th>
                  <th className="pb-3">Sender</th>
                  <th className="pb-3">Template</th>
                  <th className="pb-3 text-right">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {wishes.slice(0, 5).map((w) => (
                  <tr key={w.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 font-bold text-white">{w.recipientName}</td>
                    <td className="py-3 text-[#A8949B]">{w.senderName}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#EE4374]/20 text-[#EE4374] text-[10px] font-bold">
                        {w.templateId}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono text-emerald-400 font-bold">
                      {w.viewsCount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health Panel */}
        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Platform Status</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#281B20] border border-white/5 flex items-center justify-between">
              <span className="text-[#A8949B]">Firestore Database</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Active & Synced
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#281B20] border border-white/5 flex items-center justify-between">
              <span className="text-[#A8949B]">Firebase Auth</span>
              <span className="text-emerald-400 font-bold">Protected</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#281B20] border border-white/5 flex items-center justify-between">
              <span className="text-[#A8949B]">Hero Artwork</span>
              <span className="text-amber-300 font-bold truncate max-w-[120px]">
                Active Image
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#281B20] border border-white/5 flex items-center justify-between">
              <span className="text-[#A8949B]">Pending Reviews</span>
              <span className="text-[#EE4374] font-bold">
                {reviews.filter((r) => r.status === "pending").length} Items
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
