import React, { useState } from "react";
import { useCMS } from "../../context/CMSContext";
import { HeroSectionConfig } from "../../types/cms";
import {
  LayoutTemplate,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  Image as ImageIcon,
} from "lucide-react";

export const AdminHeroEditor: React.FC = () => {
  const { hero, updateHero, images } = useCMS();
  const [formData, setFormData] = useState<HeroSectionConfig>({ ...hero });
  const [isSaved, setIsSaved] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateHero(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setFormData((prev) => ({ ...prev, heroBgImage: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAvatar = () => {
    if (!newAvatarUrl) return;
    setFormData((prev) => ({
      ...prev,
      customerAvatars: [...prev.customerAvatars, newAvatarUrl],
    }));
    setNewAvatarUrl("");
  };

  const handleRemoveAvatar = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      customerAvatars: prev.customerAvatars.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30">
        <div>
          <h2 className="text-xl font-extrabold text-white font-serif-display">
            Hero Section Editor
          </h2>
          <p className="text-xs text-[#A8949B] mt-1">
            Edit text, headline, CTA buttons, background artwork, ratings, and toggle section visibility in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Saved Live!
            </span>
          )}
          <button
            onClick={handleSave}
            className="flow-btn-primary px-6 py-3 rounded-2xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes Live</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Content Card */}
          <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374]">
              Headline & Copy Editor
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Top Badge Text
              </label>
              <input
                type="text"
                value={formData.badgeText}
                onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Main Headline
              </label>
              <textarea
                rows={2}
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-sm text-white font-serif-display font-bold outline-none focus:border-[#EE4374]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Subheading Description
              </label>
              <textarea
                rows={3}
                value={formData.subheading}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
                className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white leading-relaxed outline-none focus:border-[#EE4374]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  CTA Button Link
                </label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                />
              </div>
            </div>
          </div>

          {/* Text Sizes & Typography Scale Control Card */}
          <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Text Sizes & Typography Scale</span>
              </h3>
              <span className="text-[10px] text-[#EE4374] font-mono bg-[#EE4374]/10 px-2 py-0.5 rounded-full">
                Custom Font Sizes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  Headline Text Size
                </label>
                <select
                  value={formData.headlineFontSize || "text-4xl sm:text-6xl lg:text-7xl"}
                  onChange={(e) => setFormData({ ...formData, headlineFontSize: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                >
                  <option value="text-2xl sm:text-4xl lg:text-5xl">Small (2xl → 5xl)</option>
                  <option value="text-3xl sm:text-5xl lg:text-6xl">Medium (3xl → 6xl)</option>
                  <option value="text-4xl sm:text-6xl lg:text-7xl">Large (Standard - 4xl → 7xl)</option>
                  <option value="text-5xl sm:text-7xl lg:text-8xl">Extra Large (5xl → 8xl)</option>
                  <option value="text-6xl sm:text-8xl lg:text-9xl">Gigantic Display (6xl → 9xl)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  Subheading Description Text Size
                </label>
                <select
                  value={formData.subheadingFontSize || "text-base sm:text-lg"}
                  onChange={(e) => setFormData({ ...formData, subheadingFontSize: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                >
                  <option value="text-xs sm:text-sm">Small Body (xs → sm)</option>
                  <option value="text-sm sm:text-base">Medium Body (sm → base)</option>
                  <option value="text-base sm:text-lg">Large Body (Standard - base → lg)</option>
                  <option value="text-lg sm:text-xl">Extra Large (lg → xl)</option>
                  <option value="text-xl sm:text-2xl">Headline Subtitle (xl → 2xl)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  Top Badge Tag Font Size
                </label>
                <select
                  value={formData.badgeFontSize || "text-xs"}
                  onChange={(e) => setFormData({ ...formData, badgeFontSize: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                >
                  <option value="text-[10px]">Tiny (10px)</option>
                  <option value="text-xs">Small (xs - Standard)</option>
                  <option value="text-sm">Medium (sm)</option>
                  <option value="text-base">Large (base)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  CTA Button Font Size
                </label>
                <select
                  value={formData.buttonFontSize || "text-base"}
                  onChange={(e) => setFormData({ ...formData, buttonFontSize: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                >
                  <option value="text-xs">Compact Button (xs)</option>
                  <option value="text-sm">Medium Button (sm)</option>
                  <option value="text-base">Standard Button (base)</option>
                  <option value="text-lg">Large Prominent Button (lg)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hero Background & Photo Placement / Size Controls */}
          <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374] flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>Photo Placement & Frame Size Controls</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  Hero Image URL or Upload
                </label>
                <input
                  type="text"
                  value={formData.heroBgImage}
                  onChange={(e) => setFormData({ ...formData, heroBgImage: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374] font-mono text-[11px]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="px-4 py-2.5 rounded-2xl bg-[#EE4374]/20 hover:bg-[#EE4374]/30 border border-[#EE4374]/40 text-xs font-bold text-[#EE4374] flex items-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload New Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {images.length > 0 && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) setFormData({ ...formData, heroBgImage: e.target.value });
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-[#181114] border border-white/10 text-xs text-white outline-none"
                  >
                    <option value="">Select from Image Library...</option>
                    {images.map((img) => (
                      <option key={img.id} value={img.url}>
                        {img.name}
                      </option>
                    ))}
                  </select>
                )}

                {formData.heroBgImage && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, heroBgImage: "" })}
                    className="px-3 py-2.5 rounded-2xl bg-rose-950/50 hover:bg-rose-900 border border-rose-500/30 text-xs font-bold text-rose-300 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Image</span>
                  </button>
                )}
              </div>

              {/* Advanced Photo Placement Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-2">
                    Photo Layout Placement Mode
                  </label>
                  <select
                    value={formData.heroPhotoPlacement || "background"}
                    onChange={(e) => setFormData({ ...formData, heroPhotoPlacement: e.target.value as any })}
                    className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                  >
                    <option value="background">Full Canvas Background Wallpaper</option>
                    <option value="side-by-side">Side-by-Side Split (Headline Left, Photo Card Right)</option>
                    <option value="photo-top">Top Hero Banner Photo (Photo Above Text)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-2">
                    Photo Focus & Alignment Position
                  </label>
                  <select
                    value={formData.heroPhotoPosition || "object-[82%_center]"}
                    onChange={(e) => setFormData({ ...formData, heroPhotoPosition: e.target.value })}
                    className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                  >
                    <option value="object-center">Center Focus</option>
                    <option value="object-[82%_center]">Right Focal Point (82% Right - Standard)</option>
                    <option value="object-left">Left Focal Point</option>
                    <option value="object-right">Far Right Focus</option>
                    <option value="object-top">Top Focus (Face / Candle Focus)</option>
                    <option value="object-bottom">Bottom Focus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-2">
                    Photo Fit Scaling Mode
                  </label>
                  <select
                    value={formData.heroPhotoFit || "object-cover"}
                    onChange={(e) => setFormData({ ...formData, heroPhotoFit: e.target.value })}
                    className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                  >
                    <option value="object-cover">Cover (Crop to fill frame dynamically)</option>
                    <option value="object-contain">Contain (Fit entire image inside frame without cropping)</option>
                    <option value="object-fill">Fill (Stretch to fit bounds)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-2">
                    Photo Frame Width / Size
                  </label>
                  <select
                    value={formData.heroPhotoSize || "w-full"}
                    onChange={(e) => setFormData({ ...formData, heroPhotoSize: e.target.value })}
                    className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                  >
                    <option value="max-w-xs">Compact Photo Card (320px)</option>
                    <option value="max-w-md">Medium Photo Card (440px)</option>
                    <option value="max-w-lg">Large Photo Card (512px)</option>
                    <option value="max-w-xl">Extra Large Photo Card (576px)</option>
                    <option value="w-full">Full Width Responsive (100%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-2">
                    Hero Section Height
                  </label>
                  <select
                    value={formData.heroPhotoHeight || "min-h-[580px] lg:min-h-[660px]"}
                    onChange={(e) => setFormData({ ...formData, heroPhotoHeight: e.target.value })}
                    className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                  >
                    <option value="min-h-[480px]">Compact Banner (480px)</option>
                    <option value="min-h-[580px] lg:min-h-[660px]">Standard Hero Height (660px)</option>
                    <option value="min-h-[750px]">Tall Extended Height (750px)</option>
                    <option value="min-h-screen">Full Screen Height (100vh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#A8949B] mb-2">
                    Photo Opacity ({formData.heroPhotoOpacity ?? 100}%)
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    step={5}
                    value={formData.heroPhotoOpacity ?? 100}
                    onChange={(e) => setFormData({ ...formData, heroPhotoOpacity: Number(e.target.value) })}
                    className="w-full accent-[#EE4374] h-2 bg-[#181114] rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statistics & Ratings Editor */}
          <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374]">
              Statistics & Customer Ratings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  Rating Text
                </label>
                <input
                  type="text"
                  value={formData.ratingText}
                  onChange={(e) => setFormData({ ...formData, ratingText: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#A8949B] mb-2">
                  Wishes Created Metric
                </label>
                <input
                  type="text"
                  value={formData.wishesCreatedCount}
                  onChange={(e) => setFormData({ ...formData, wishesCreatedCount: e.target.value })}
                  className="w-full bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#EE4374]"
                />
              </div>
            </div>

            {/* Customer Avatars */}
            <div>
              <label className="block text-xs font-bold text-[#A8949B] mb-2">
                Customer Avatars ({formData.customerAvatars.length})
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {formData.customerAvatars.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={url}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#EE4374]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAvatar(idx)}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste image URL to add avatar..."
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                  className="flex-1 bg-[#181114] border border-[#EE4374]/20 rounded-2xl px-4 py-2.5 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAvatar}
                  className="px-4 py-2.5 rounded-2xl bg-[#EE4374] text-white font-bold text-xs hover:bg-pink-600"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Visibility Toggles */}
          <div className="p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/20 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#EE4374]">
              Section Visibility Toggles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#281B20] border border-white/5 cursor-pointer">
                <span className="text-white">Hero Badge</span>
                <input
                  type="checkbox"
                  checked={formData.showBadge}
                  onChange={(e) => setFormData({ ...formData, showBadge: e.target.checked })}
                  className="w-4 h-4 accent-[#EE4374]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#281B20] border border-white/5 cursor-pointer">
                <span className="text-white">Rating Stars</span>
                <input
                  type="checkbox"
                  checked={formData.showRating}
                  onChange={(e) => setFormData({ ...formData, showRating: e.target.checked })}
                  className="w-4 h-4 accent-[#EE4374]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#281B20] border border-white/5 cursor-pointer">
                <span className="text-white">Customer Avatars</span>
                <input
                  type="checkbox"
                  checked={formData.showAvatars}
                  onChange={(e) => setFormData({ ...formData, showAvatars: e.target.checked })}
                  className="w-4 h-4 accent-[#EE4374]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-[#281B20] border border-white/5 cursor-pointer">
                <span className="text-white">Entire Hero Section</span>
                <input
                  type="checkbox"
                  checked={formData.showHeroSection}
                  onChange={(e) => setFormData({ ...formData, showHeroSection: e.target.checked })}
                  className="w-4 h-4 accent-[#EE4374]"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile & Desktop Hero Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-24 p-6 rounded-3xl bg-[#1E1418] border border-[#EE4374]/30 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#EE4374]" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Live Hero Section Preview
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">
                Real-time Rendering
              </span>
            </div>

            {/* Live Card Container */}
            <div className="relative rounded-2xl overflow-hidden border border-[#EE4374]/20 bg-[#FAF4EE] text-[#2A1A1F] p-6 space-y-4 min-h-[360px] flex flex-col justify-center">
              {/* Background preview */}
              {formData.heroBgImage && (
                <div className="absolute inset-0 z-0">
                  <img
                    src={formData.heroBgImage}
                    alt="Hero BG"
                    className="w-full h-full object-cover object-right opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FAF4EE] via-[#FAF4EE]/80 to-transparent" />
                </div>
              )}

              <div className="relative z-10 space-y-3">
                {formData.showBadge && formData.badgeText && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7EC] text-[#D82C5D] text-[10px] font-extrabold uppercase tracking-wider border border-[#EE4374]/20">
                    <Sparkles className="w-3 h-3 text-[#EE4374]" />
                    <span>{formData.badgeText}</span>
                  </div>
                )}

                <h2 className="text-xl font-extrabold leading-tight text-[#2A1A1F] font-serif-display">
                  {formData.headline}
                </h2>

                <p className="text-xs text-[#635158] leading-relaxed">
                  {formData.subheading}
                </p>

                <div className="pt-1">
                  <span className="flow-btn-primary inline-block px-5 py-2.5 rounded-full font-bold text-xs text-white shadow-md">
                    {formData.buttonText}
                  </span>
                </div>

                {formData.showRating && (
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-[#635158] font-bold">
                    <span className="text-[#EE4374]">★★★★★</span>
                    <span>{formData.ratingText}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
