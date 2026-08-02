import React from "react";
import { useCMS } from "../../context/CMSContext";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Palette,
  Download,
  Calendar,
  Sparkles,
} from "lucide-react";

export const AdminAnalytics: React.FC = () => {
  const { analytics, wishes, templates } = useCMS();

  const handleExportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value\n" +
      `Visitors,${analytics.visitorsCount}\n` +
      `Page Views,${analytics.pageViewsCount}\n` +
      `Templates Created,${analytics.templatesCreatedCount}\n` +
      `Total Wishes,${analytics.totalWishesCount + wishes.length}\n` +
      `Downloads,${analytics.downloadsCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `celebrationcraft_analytics_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Platform Analytics & Traffic Report
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Real-time telemetry stats for visitors, wish creations, template popularity, and downloads.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-2">
          <div className="flex items-center justify-between text-[#A8949B]">
            <span className="text-xs font-bold uppercase">Total Unique Visitors</span>
            <Users className="w-5 h-5 text-[#EE4374]" />
          </div>
          <p className="text-3xl font-black text-white font-serif-display">
            {analytics.visitorsCount.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% Growth Rate
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-2">
          <div className="flex items-center justify-between text-[#A8949B]">
            <span className="text-xs font-bold uppercase">Page Impressions</span>
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white font-serif-display">
            {analytics.pageViewsCount.toLocaleString()}
          </p>
          <p className="text-[11px] text-purple-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 2.9 Views / Session
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-2">
          <div className="flex items-center justify-between text-[#A8949B]">
            <span className="text-xs font-bold uppercase">Wishes Created</span>
            <Heart className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white font-serif-display">
            {(analytics.totalWishesCount + wishes.length).toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-400 font-bold">
            99.8% Share Rate
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-2">
          <div className="flex items-center justify-between text-[#A8949B]">
            <span className="text-xs font-bold uppercase">Total Card Exports</span>
            <Download className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-white font-serif-display">
            {analytics.downloadsCount.toLocaleString()}
          </p>
          <p className="text-[11px] text-amber-400 font-bold">
            PDF & High-Res PNG
          </p>
        </div>
      </div>

      {/* Popular Templates Popularity Breakdown */}
      <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-4">
        <h3 className="text-base font-bold text-white font-serif-display flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#EE4374]" />
          <span>Popular Template Distribution</span>
        </h3>

        <div className="space-y-4">
          {templates.map((t, idx) => {
            const usagePercent = 85 - idx * 18;
            return (
              <div key={t.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{t.name} ({t.category})</span>
                  <span className="text-[#EE4374] font-mono">{usagePercent}% popularity</span>
                </div>
                <div className="h-3 rounded-full bg-[#181114] overflow-hidden p-0.5 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#EE4374] to-pink-500 transition-all duration-1000"
                    style={{ width: `${Math.max(15, usagePercent)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
