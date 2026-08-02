import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { Heart, Search, Eye, Trash2, ExternalLink, Calendar, Users } from "lucide-react";

export const AdminWishes: React.FC = () => {
  const { wishes, deleteWish } = useCMS();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWishes = wishes.filter(
    (w) =>
      w.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Created Wishes & Cards
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            View user-generated interactive wishes, inspect preview links, track total views, and manage user content.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#A8949B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wishes..."
            className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#635158] outline-none focus:border-[#EE4374]"
          />
        </div>
      </div>

      {/* Table List */}
      <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs text-[#FCE7EC]">
          <thead className="border-b border-white/10 text-[#A8949B] uppercase font-mono">
            <tr>
              <th className="pb-4">Recipient Name</th>
              <th className="pb-4">Sender Name</th>
              <th className="pb-4">Template Used</th>
              <th className="pb-4">Message Snippet</th>
              <th className="pb-4 text-center">Total Views</th>
              <th className="pb-4 text-center">Date</th>
              <th className="pb-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredWishes.map((w) => (
              <tr key={w.id} className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-extrabold text-white">{w.recipientName}</td>
                <td className="py-4 text-[#A8949B]">{w.senderName}</td>
                <td className="py-4">
                  <span className="px-2.5 py-1 rounded-full bg-[#EE4374]/20 text-[#EE4374] text-[10px] font-bold">
                    {w.templateId}
                  </span>
                </td>
                <td className="py-4 max-w-xs truncate text-[#A8949B]">{w.message}</td>
                <td className="py-4 text-center font-mono font-bold text-emerald-400">
                  {w.viewsCount.toLocaleString()}
                </td>
                <td className="py-4 text-center text-[#A8949B] font-mono">{w.createdAt}</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/w/${w.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#281B20] hover:bg-[#34232A] text-xs font-bold text-white inline-flex items-center gap-1 cursor-pointer"
                      title="Open Live Card"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#EE4374]" />
                    </a>
                    <button
                      onClick={() => deleteWish(w.id)}
                      className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 text-rose-300 transition-colors cursor-pointer"
                      title="Delete Wish Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
