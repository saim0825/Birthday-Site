import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { WebsiteSettings } from "../../types/cms";
import { Settings, Save, CheckCircle2, Globe, Palette, Mail, Share2, ShieldCheck } from "lucide-react";

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useCMS();
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Global Website Settings
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Branding, SEO, logo & favicon artwork, social links, theme colors, typography, and SMTP configurations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Settings Updated!
            </span>
          )}
          <button
            onClick={handleSubmit}
            className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding & Info */}
        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Identity & Branding</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Site Brand Name
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Copyright Text
              </label>
              <input
                type="text"
                value={formData.copyrightText}
                onChange={(e) => setFormData({ ...formData, copyrightText: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Logo Image URL
              </label>
              <input
                type="text"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white font-mono text-[11px] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Favicon Image URL
              </label>
              <input
                type="text"
                value={formData.faviconUrl}
                onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white font-mono text-[11px] outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEO Metadata */}
        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374]">
            SEO Metadata Configuration
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#A8949B] mb-2">
              Meta Title Tag
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#A8949B] mb-2">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
              className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none leading-relaxed"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>Social Media Channels</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-1">Twitter / X URL</label>
              <input
                type="text"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Theme & Fonts */}
        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>Theme Aesthetics & Typography Sizes</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">Primary Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="flex-1 bg-[#181114] border border-[#EE4374]/20 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">Secondary Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  className="flex-1 bg-[#181114] border border-[#EE4374]/20 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">Font Stack</label>
              <input
                type="text"
                value={formData.fontFamily}
                onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-white/10">
            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Section Titles Font Size
              </label>
              <select
                value={formData.sectionHeadingFontSize || "text-3xl sm:text-5xl"}
                onChange={(e) => setFormData({ ...formData, sectionHeadingFontSize: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              >
                <option value="text-2xl sm:text-3xl">Compact Headings (2xl → 3xl)</option>
                <option value="text-3xl sm:text-5xl">Standard Headings (3xl → 5xl)</option>
                <option value="text-4xl sm:text-6xl">Large Headings (4xl → 6xl)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Body Copy Font Size
              </label>
              <select
                value={formData.bodyTextFontSize || "text-sm sm:text-base"}
                onChange={(e) => setFormData({ ...formData, bodyTextFontSize: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              >
                <option value="text-xs sm:text-sm">Compact Body Text (xs → sm)</option>
                <option value="text-sm sm:text-base">Standard Body Text (sm → base)</option>
                <option value="text-base sm:text-lg">Large Body Text (base → lg)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Photo Gallery Aspect Ratio
              </label>
              <select
                value={formData.galleryPhotoAspect || "aspect-square"}
                onChange={(e) => setFormData({ ...formData, galleryPhotoAspect: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              >
                <option value="aspect-square">Square Cards (1:1 Ratio)</option>
                <option value="aspect-[4/3]">Standard Photo (4:3 Ratio)</option>
                <option value="aspect-video">Landscape Banner (16:9 Ratio)</option>
                <option value="aspect-[3/4]">Portrait Frame (3:4 Ratio)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SMTP Email Server */}
        <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>SMTP / Email Delivery Configuration</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-1">SMTP Host</label>
              <input
                type="text"
                value={formData.smtpHost}
                onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-1">SMTP Port</label>
              <input
                type="text"
                value={formData.smtpPort}
                onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-1">SMTP Username</label>
              <input
                type="text"
                value={formData.smtpUser}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-1">From Email Address</label>
              <input
                type="text"
                value={formData.smtpFrom}
                onChange={(e) => setFormData({ ...formData, smtpFrom: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
