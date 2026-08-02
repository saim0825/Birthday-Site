import React, { useState } from "react";
import { CardData, CardImage } from "../types";
import { AiWishModal } from "./AiWishModal";
import { BismaCard } from "./TemplateCards/BismaCard";
import { RoyalGoldenCard } from "./TemplateCards/RoyalGoldenCard";
import { NeonCyberCard } from "./TemplateCards/NeonCyberCard";
import { SweetHeartCard } from "./TemplateCards/SweetHeartCard";
import {
  Sparkles,
  Wand2,
  Upload,
  Music,
  Cake,
  Gift,
  Flame,
  Volume2,
  Share2,
  ArrowRight,
  Eye,
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal,
  Plus,
  Trash2
} from "lucide-react";
import { fireConfettiCannon } from "../lib/confetti";
import { soundFx } from "../lib/audio";

interface CreatorStudioProps {
  initialTemplateId?: string;
  onCreatedCard: (card: CardData, shortUrl: string) => void;
  onNavigate: (view: "landing" | "creator" | "gallery" | "view", cardId?: string) => void;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({
  initialTemplateId = "bisma-interactive",
  onCreatedCard,
  onNavigate
}) => {
  const [templateId, setTemplateId] = useState(initialTemplateId);
  const [recipientName, setRecipientName] = useState("Bisma");
  const [senderName, setSenderName] = useState("Your Besties");
  const [occasion, setOccasion] = useState("Birthday");
  const [message, setMessage] = useState(
    "Happy Birthday Bisma! 🎉 May your day be filled with endless laughter, boundless joy, sweet surprises, and all the happiness in the world!"
  );
  const [themeColor, setThemeColor] = useState("#EE4374");
  const [musicTrack, setMusicTrack] = useState("happy-piano");
  const [customSlug, setCustomSlug] = useState("");
  const [secretMessage, setSecretMessage] = useState(
    "🎁 Surprise! You are genuinely loved and appreciated more than words can express."
  );

  const [images, setImages] = useState<CardImage[]>([
    {
      url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
      caption: "Celebrating another glorious year!"
    },
    {
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
      caption: "Unforgettable memories together"
    }
  ]);

  const [interactiveOptions, setInteractiveOptions] = useState({
    cake: true,
    candles: true,
    balloons: true,
    giftBox: true,
    confetti: true,
    soundEffects: true
  });

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");
  const [generatedLinkModal, setGeneratedLinkModal] = useState<{ shortUrl: string; fullUrl: string; cardId: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Handle image upload local preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImages((prev) => [
            ...prev,
            {
              url: uploadEvent.target!.result as string,
              caption: "Special Memory"
            }
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName,
          senderName,
          occasion,
          message,
          templateId,
          images,
          themeColor,
          musicTrack,
          interactiveOptions,
          secretMessage,
          customSlug: customSlug || undefined
        })
      });

      const data = await response.json();

      if (data.success && data.card) {
        soundFx.playTaDa();
        fireConfettiCannon();
        onCreatedCard(data.card, data.shortUrl);
        setGeneratedLinkModal({
          shortUrl: data.shortUrl,
          fullUrl: data.fullUrl,
          cardId: data.card.id
        });
      } else {
        alert(data.error || "Failed to generate link");
      }
    } catch (err) {
      console.error("Error generating card link:", err);
      alert("Failed to save card. Please check network connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewCardData: CardData = {
    id: "preview-card",
    recipientName: recipientName || "Recipient Name",
    senderName: senderName || "Your Name",
    occasion: occasion || "Birthday",
    message: message || "Your custom wish message will appear here...",
    templateId,
    images: images.length > 0 ? images : [
      {
        url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop",
        caption: "Celebration Photo"
      }
    ],
    themeColor,
    musicTrack,
    interactiveOptions,
    secretMessage,
    createdAt: new Date().toISOString(),
    views: 0,
    reactions: []
  };

  return (
    <div className="min-h-screen bg-[#FAF4EE] text-[#2A1A1F] font-sans pt-6 pb-24 relative overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#FCE7EC] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#FDE8EE] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#EE4374]/15">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#FCE7EC] border border-[#EE4374]/20 px-3.5 py-1 rounded-full text-[#D82C5D] text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#EE4374]" />
              <span>Creator Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-display text-[#2A1A1F]">
              Customize & Build <span className="italic text-[#EE4374]">Celebration Website</span>
            </h1>
            <p className="text-[#635158] text-sm">
              Real-time interactive editor with instant live preview.
            </p>
          </div>

          {/* Mobile View Toggle */}
          <div className="flex lg:hidden bg-[#FFFDFB] p-1 rounded-full border border-[#EE4374]/20 self-start shadow-sm">
            <button
              onClick={() => setPreviewTab("edit")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                previewTab === "edit" ? "bg-[#EE4374] text-white" : "text-[#635158]"
              }`}
            >
              Form Editor
            </button>
            <button
              onClick={() => setPreviewTab("preview")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === "preview" ? "bg-[#EE4374] text-white" : "text-[#635158]"
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Live Preview
            </button>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: EDITOR & LIVE PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: FORM CONTROLS */}
          <div className={`lg:col-span-6 space-y-6 ${previewTab === "preview" ? "hidden lg:block" : "block"}`}>
            <form onSubmit={handleGenerateLink} className="space-y-6">
              {/* Step 1: Template Selection */}
              <div className="flow-card rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold font-serif-display text-[#2A1A1F] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#EE4374]" />
                  <span>1. Select Template Theme</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "bisma-interactive", title: "Bisma Celebration", badge: "Most Popular", color: "from-[#EE4374] to-purple-600" },
                    { id: "royal-golden", title: "Royal Gold Velvet", badge: "VIP Luxury", color: "from-amber-500 to-yellow-600" },
                    { id: "neon-cyber", title: "Cyber Neon Glow", badge: "High Energy", color: "from-cyan-400 to-fuchsia-600" },
                    { id: "sweet-heart", title: "Sweet Heart Pink", badge: "Romantic", color: "from-pink-400 to-rose-500" }
                  ].map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTemplateId(t.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                        templateId === t.id
                          ? "bg-[#FCE7EC] border-[#EE4374] ring-2 ring-[#EE4374]/30 shadow-sm"
                          : "bg-[#FFFDFB] border-[#EE4374]/15 hover:border-[#EE4374]/30"
                      }`}
                    >
                      <div className={`w-full h-1.5 rounded-full bg-gradient-to-r ${t.color} mb-2`} />
                      <h4 className="text-xs font-bold text-[#2A1A1F]">{t.title}</h4>
                      <span className="text-[10px] text-[#D82C5D] font-semibold">{t.badge}</span>
                      {templateId === t.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#EE4374] flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Recipient & Sender Information */}
              <div className="flow-card rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold font-serif-display text-[#2A1A1F] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#EE4374]" />
                  <span>2. Celebration Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#635158] mb-1.5 block">Recipient's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Bisma"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-[#FAF4EE] border border-[#EE4374]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2A1A1F] focus:outline-none focus:border-[#EE4374] focus:ring-1 focus:ring-[#EE4374]/30 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#635158] mb-1.5 block">Sender / From *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Your Besties"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full bg-[#FAF4EE] border border-[#EE4374]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2A1A1F] focus:outline-none focus:border-[#EE4374] focus:ring-1 focus:ring-[#EE4374]/30 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#635158] mb-1.5 block">Occasion Type</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-[#FAF4EE] border border-[#EE4374]/20 rounded-xl px-3.5 py-2.5 text-xs text-[#2A1A1F] focus:outline-none focus:border-[#EE4374] focus:ring-1 focus:ring-[#EE4374]/30 font-semibold"
                  >
                    <option value="Birthday">Birthday 🎉</option>
                    <option value="Anniversary">Anniversary 💕</option>
                    <option value="Graduation">Graduation 🎓</option>
                    <option value="Friendship">Best Wishes & Friendship ✨</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Custom Wish Message & AI Writer */}
              <div className="flow-card rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-serif-display text-[#2A1A1F] flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[#EE4374]" />
                    <span>3. Custom Wish Message</span>
                  </h3>

                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-full bg-[#FCE7EC] border border-[#EE4374]/30 text-[#D82C5D] hover:text-[#EE4374] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#EE4374]" />
                    <span>AI Wish Assistant</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  required
                  placeholder="Write a heartwarming message for the recipient..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF4EE] border border-[#EE4374]/20 rounded-xl p-3.5 text-xs text-[#2A1A1F] focus:outline-none focus:border-[#EE4374] focus:ring-1 focus:ring-[#EE4374]/30 leading-relaxed font-medium"
                />
              </div>

              {/* Step 4: Photo Memories */}
              <div className="flow-card rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold font-serif-display text-[#2A1A1F] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#EE4374]" />
                  <span>4. Photo Memories Frame</span>
                </h3>

                <div className="relative border-2 border-dashed border-[#EE4374]/30 hover:border-[#EE4374] rounded-2xl p-6 text-center transition-colors bg-[#FAF4EE]">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-[#EE4374] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#2A1A1F]">Upload Photos from Device</p>
                  <p className="text-[11px] text-[#635158] mt-0.5">Drag and drop or click to browse image files</p>
                </div>

                {/* Image List Preview */}
                <div className="space-y-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-[#FAF4EE] p-2.5 rounded-2xl border border-[#EE4374]/15">
                      <img src={img.url} alt={`Preview ${idx}`} className="w-12 h-12 object-cover rounded-xl border border-[#EE4374]/20" />
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Image caption..."
                          value={img.caption || ""}
                          onChange={(e) => {
                            const newCap = e.target.value;
                            setImages((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, caption: newCap } : item))
                            );
                          }}
                          className="w-full bg-[#FFFDFB] border border-[#EE4374]/20 rounded-lg px-2.5 py-1 text-xs text-[#2A1A1F] focus:outline-none focus:border-[#EE4374]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-2 text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 5: Secret Gift Box Note */}
              <div className="flow-card rounded-3xl p-6 space-y-4">
                <h3 className="text-base font-bold font-serif-display text-[#2A1A1F] flex items-center gap-2">
                  <Gift className="w-4 h-4 text-[#EE4374]" />
                  <span>5. Secret Gift Box Note</span>
                </h3>

                <div>
                  <label className="text-xs font-bold text-[#635158] mb-1.5 block">Surprise Message Inside Unboxing Box</label>
                  <input
                    type="text"
                    placeholder="Enter a secret surprise message revealed when recipient opens the gift box..."
                    value={secretMessage}
                    onChange={(e) => setSecretMessage(e.target.value)}
                    className="w-full bg-[#FAF4EE] border border-[#EE4374]/20 rounded-xl p-3 text-xs text-[#2A1A1F] focus:outline-none focus:border-[#EE4374] font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#635158] mb-1.5 block">Custom Short Slug (Optional)</label>
                  <div className="flex items-center bg-[#FAF4EE] border border-[#EE4374]/20 rounded-xl px-3 py-2 text-xs">
                    <span className="text-[#635158] mr-1">app.com/w/</span>
                    <input
                      type="text"
                      placeholder="bisma-birthday"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      className="bg-transparent text-[#2A1A1F] font-bold outline-none flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full flow-btn-primary font-extrabold text-base transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>Generating Shareable Website...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-5 h-5 text-white" />
                    <span>Generate Shareable Website Link</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: LIVE REAL-TIME PREVIEW */}
          <div className={`lg:col-span-6 sticky top-24 ${previewTab === "edit" ? "hidden lg:block" : "block"}`}>
            <div className="flow-card rounded-3xl p-3 shadow-2xl bg-[#FFFDFB]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#EE4374]/10 mb-3 text-xs font-bold text-[#2A1A1F]">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#EE4374]" /> Live Interactive Preview
                </span>
                <span className="text-[10px] text-[#D82C5D] bg-[#FCE7EC] px-2.5 py-0.5 rounded-full border border-[#EE4374]/20">
                  {templateId}
                </span>
              </div>

              {/* Live Card Render Frame */}
              <div className="rounded-2xl overflow-hidden max-h-[750px] overflow-y-auto border border-[#EE4374]/15 bg-[#FAF4EE]">
                {templateId === "royal-golden" ? (
                  <RoyalGoldenCard card={previewCardData} />
                ) : templateId === "neon-cyber" ? (
                  <NeonCyberCard card={previewCardData} />
                ) : templateId === "sweet-heart" ? (
                  <SweetHeartCard card={previewCardData} />
                ) : (
                  <BismaCard card={previewCardData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI WISH WRITER MODAL */}
      {isAiModalOpen && (
        <AiWishModal
          recipientName={recipientName}
          occasion={occasion}
          onSelectWish={(aiMsg) => setMessage(aiMsg)}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {/* SUCCESSFUL LINK GENERATION MODAL */}
      {generatedLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFFDFB] border border-[#EE4374]/20 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-[#FCE7EC] rounded-full flex items-center justify-center mx-auto text-[#EE4374]">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-serif-display text-[#2A1A1F]">Website Generated! 🎉</h3>
              <p className="text-xs text-[#635158]">
                Your interactive celebration website for <strong className="text-[#EE4374]">{recipientName}</strong> is ready to share.
              </p>
            </div>

            <div className="bg-[#FAF4EE] p-4 rounded-2xl border border-[#EE4374]/15 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D82C5D] block">
                SHAREABLE LINK
              </span>
              <div className="flex items-center justify-between bg-[#FFFDFB] px-3.5 py-2.5 rounded-xl border border-[#EE4374]/20 text-xs text-[#2A1A1F] font-mono font-bold">
                <span className="truncate mr-2">{generatedLinkModal.fullUrl}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLinkModal.fullUrl);
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                  }}
                  className="px-3 py-1 bg-[#EE4374] hover:bg-[#D82C5D] text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGeneratedLinkModal(null);
                  onNavigate("view", generatedLinkModal.cardId);
                }}
                className="flex-1 py-3.5 rounded-full flow-btn-primary font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open & View Website</span>
              </button>

              <button
                onClick={() => setGeneratedLinkModal(null)}
                className="px-5 py-3.5 rounded-full bg-[#FAF4EE] hover:bg-[#FCE7EC] text-[#2A1A1F] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
