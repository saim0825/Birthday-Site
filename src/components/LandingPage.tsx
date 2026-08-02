import React, { useState, useEffect } from "react";
import { HeroBalloonCanvas } from "./HeroBalloonCanvas";
import { TemplateGallery } from "./TemplateGallery";
import {
  Sparkles,
  PartyPopper,
  ArrowRight,
  Eye,
  Wand2,
  Share2,
  Heart,
  Flame,
  Gift,
  Zap,
  Lock,
  Music,
  Smile,
  Check,
  Compass,
  Volume2,
  RefreshCw,
  Award,
  Crown,
  Layers,
  Send,
  Sliders,
  Star
} from "lucide-react";
import { soundFx } from "../lib/audio";
import { fireConfettiCannon } from "../lib/confetti";
import { useCMS } from "../context/CMSContext";

interface LandingPageProps {
  onNavigate: (view: "landing" | "creator" | "gallery" | "view", cardId?: string) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectTemplate }) => {
  const { hero, settings, reviews } = useCMS();
  const [stats, setStats] = useState({ cardsCreated: 1248392, totalViews: 49800, balloonsPopped: 14280 });

  // Hero Interactive Demo Widget State
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [isGiftOpened, setIsGiftOpened] = useState(false);
  const [heroPopCount, setHeroPopCount] = useState(0);

  // Interactive AI Generator Demo State
  const [aiDemoOccasion, setAiDemoOccasion] = useState<"Birthday" | "Bestie" | "Anniversary">("Birthday");
  const [aiDemoResult, setAiDemoResult] = useState(
    "Happy Birthday Bisma! 🎉 May your year ahead be packed with endless laughter, spontaneous adventures, and unforgettable memories!"
  );
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.cardsCreated) {
          setStats(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleBlowHeroCandle = () => {
    soundFx.playBlowCandle();
    fireConfettiCannon();
    setIsCandleBlown(true);
    setTimeout(() => setIsCandleBlown(false), 4000);
  };

  const handleGenerateSampleAiWish = (type: "Birthday" | "Bestie" | "Anniversary") => {
    setAiDemoOccasion(type);
    setIsGeneratingAi(true);

    setTimeout(() => {
      if (type === "Birthday") {
        setAiDemoResult(
          "Happy Birthday! 🎉 Wishing you another 365 days of sparkling joy, big smiles, and achieving every single dream on your list!"
        );
      } else if (type === "Bestie") {
        setAiDemoResult(
          "To the world's absolute best friend ✨ Thank you for always being my rock, my partner in crime, and my favorite human!"
        );
      } else {
        setAiDemoResult(
          "Happy Anniversary! 💕 Here's to another year of shared laughter, quiet cozy moments, and building a beautiful future together."
        );
      }
      setIsGeneratingAi(false);
    }, 600);
  };

  const approvedReviews = reviews.filter((r) => r.status === "approved");

  return (
    <div className="min-h-screen text-[#2A1A1F] font-sans selection:bg-[#EE4374] selection:text-white relative overflow-x-hidden bg-[#FAF4EE]">
      {/* BACKGROUND AMBIENT GLOW ORBS */}
      <div className="absolute top-[-100px] left-[-100px] w-[550px] h-[550px] bg-[#FCE7EC] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-120px] w-[500px] h-[500px] bg-[#FBE7ED] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[25%] w-[450px] h-[450px] bg-[#FDE8EE] rounded-full blur-[140px] pointer-events-none" />

      {/* ================= HERO SECTION WITH DYNAMIC CMS DATA ================= */}
      {hero.showHeroSection && (
        <section className={`relative flex items-center pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden z-10 ${hero.heroPhotoHeight || "min-h-[580px] lg:min-h-[660px]"}`}>
          {/* Full Hero Background Image (When placement mode is "background") */}
          {hero.heroBgImage && (hero.heroPhotoPlacement || "background") === "background" && (
            <div className="absolute inset-0 w-full h-full z-0">
              <img
                src={hero.heroBgImage}
                alt="Interactive Birthday Platform - Hero Celebration Scene"
                className={`w-full h-full block ${hero.heroPhotoPosition || "object-[82%_center]"} ${hero.heroPhotoFit || "object-cover"}`}
                style={{ opacity: (hero.heroPhotoOpacity ?? 100) / 100 }}
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#FAF4EE] via-[#FAF4EE]/85 sm:via-[#FAF4EE]/70 lg:via-[#FAF4EE]/45 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF4EE] via-transparent to-[#FAF4EE]/20 pointer-events-none" />
            </div>
          )}

          {/* Interactive Balloon Canvas Layer */}
          <HeroBalloonCanvas
            onPopCountChange={() => {
              setHeroPopCount((prev) => prev + 1);
            }}
          />

          {/* Hero Content Overlaid or Side-by-Side */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
            {(hero.heroPhotoPlacement === "side-by-side" && hero.heroBgImage) ? (
              /* SIDE BY SIDE SPLIT LAYOUT */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-7 text-center lg:text-left space-y-7">
                  {hero.showBadge && hero.badgeText && (
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCE7EC]/90 backdrop-blur-md border border-[#EE4374]/20 text-[#D82C5D] font-extrabold uppercase tracking-wider shadow-sm ${hero.badgeFontSize || "text-xs"}`}>
                      <Sparkles className="w-3.5 h-3.5 text-[#EE4374] animate-pulse" />
                      <span>{hero.badgeText}</span>
                    </div>
                  )}

                  <h1 className={`font-extrabold leading-[1.12] tracking-tight font-serif-display text-[#2A1A1F] ${hero.headlineFontSize || "text-4xl sm:text-6xl lg:text-7xl"}`}>
                    {hero.headline}
                  </h1>

                  <p className={`text-[#635158] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal ${hero.subheadingFontSize || "text-base sm:text-lg"}`}>
                    {hero.subheading}
                  </p>

                  {/* Primary CTA */}
                  <div className="pt-2 flex justify-center lg:justify-start">
                    <button
                      onClick={() => onNavigate("creator")}
                      className={`flow-btn-primary px-9 py-4 rounded-full font-bold text-white flex items-center justify-center gap-3 cursor-pointer shadow-xl transition-all active:scale-95 w-full sm:w-auto ${hero.buttonFontSize || "text-base"}`}
                    >
                      <Wand2 className="w-5 h-5 text-white" />
                      <span>{hero.buttonText}</span>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Social Proof & Metrics */}
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 text-xs font-semibold text-[#635158]">
                    <div className="flex items-center gap-2 bg-[#FFFDFB]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EE4374]/15 shadow-sm">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span><strong className="text-[#2A1A1F]">{hero.wishesCreatedCount}</strong> Wishes Created</span>
                    </div>

                    {hero.showRating && (
                      <div className="flex items-center gap-1.5 text-[#EE4374] bg-[#FFFDFB]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EE4374]/15 shadow-sm">
                        {"★".repeat(5)} <span className="font-extrabold text-[#2A1A1F]">{hero.ratingText}</span>
                      </div>
                    )}

                    {hero.showAvatars && hero.customerAvatars.length > 0 && (
                      <div className="flex items-center gap-2 bg-[#FFFDFB]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EE4374]/15 shadow-sm">
                        <div className="flex -space-x-2 overflow-hidden">
                          {hero.customerAvatars.map((url, idx) => (
                            <img key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-[#FFFDFB] object-cover" src={url} alt="User" />
                          ))}
                        </div>
                        <span className="text-xs text-[#635158] font-medium flex items-center gap-1">
                          Loved worldwide <Heart className="w-3.5 h-3.5 text-[#EE4374] fill-current" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column Photo Frame */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDFB] bg-[#FFFDFB] p-2 ring-1 ring-[#EE4374]/20 ${hero.heroPhotoSize || "w-full"}`}>
                    <img
                      src={hero.heroBgImage}
                      alt="Hero Feature Frame"
                      className={`w-full h-80 sm:h-96 rounded-2xl block ${hero.heroPhotoPosition || "object-center"} ${hero.heroPhotoFit || "object-cover"}`}
                      style={{ opacity: (hero.heroPhotoOpacity ?? 100) / 100 }}
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDFB]/90 backdrop-blur-md p-3 rounded-xl border border-[#EE4374]/15 text-center">
                      <span className="text-xs font-bold text-[#D82C5D] flex items-center justify-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#EE4374]" /> Interactive Celebration Studio
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : hero.heroPhotoPlacement === "photo-top" && hero.heroBgImage ? (
              /* TOP PHOTO BANNER LAYOUT */
              <div className="max-w-3xl mx-auto text-center space-y-7">
                <div className="flex justify-center">
                  <div className={`relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FFFDFB] bg-[#FFFDFB] p-2 ${hero.heroPhotoSize || "w-full"}`}>
                    <img
                      src={hero.heroBgImage}
                      alt="Hero Top Banner"
                      className={`w-full h-64 sm:h-80 rounded-2xl block ${hero.heroPhotoPosition || "object-center"} ${hero.heroPhotoFit || "object-cover"}`}
                      style={{ opacity: (hero.heroPhotoOpacity ?? 100) / 100 }}
                    />
                  </div>
                </div>

                {hero.showBadge && hero.badgeText && (
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCE7EC]/90 backdrop-blur-md border border-[#EE4374]/20 text-[#D82C5D] font-extrabold uppercase tracking-wider shadow-sm ${hero.badgeFontSize || "text-xs"}`}>
                    <Sparkles className="w-3.5 h-3.5 text-[#EE4374] animate-pulse" />
                    <span>{hero.badgeText}</span>
                  </div>
                )}

                <h1 className={`font-extrabold leading-[1.12] tracking-tight font-serif-display text-[#2A1A1F] ${hero.headlineFontSize || "text-4xl sm:text-6xl lg:text-7xl"}`}>
                  {hero.headline}
                </h1>

                <p className={`text-[#635158] leading-relaxed max-w-xl mx-auto font-normal ${hero.subheadingFontSize || "text-base sm:text-lg"}`}>
                  {hero.subheading}
                </p>

                {/* Primary CTA */}
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => onNavigate("creator")}
                    className={`flow-btn-primary px-9 py-4 rounded-full font-bold text-white flex items-center justify-center gap-3 cursor-pointer shadow-xl transition-all active:scale-95 w-full sm:w-auto ${hero.buttonFontSize || "text-base"}`}
                  >
                    <Wand2 className="w-5 h-5 text-white" />
                    <span>{hero.buttonText}</span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              /* STANDARD BACKGROUND OVERLAY LAYOUT */
              <div className="max-w-2xl text-center lg:text-left space-y-7">
                {hero.showBadge && hero.badgeText && (
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCE7EC]/90 backdrop-blur-md border border-[#EE4374]/20 text-[#D82C5D] font-extrabold uppercase tracking-wider shadow-sm ${hero.badgeFontSize || "text-xs"}`}>
                    <Sparkles className="w-3.5 h-3.5 text-[#EE4374] animate-pulse" />
                    <span>{hero.badgeText}</span>
                  </div>
                )}

                <h1 className={`font-extrabold leading-[1.12] tracking-tight font-serif-display text-[#2A1A1F] ${hero.headlineFontSize || "text-4xl sm:text-6xl lg:text-7xl"}`}>
                  {hero.headline}
                </h1>

                <p className={`text-[#635158] leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal ${hero.subheadingFontSize || "text-base sm:text-lg"}`}>
                  {hero.subheading}
                </p>

                {/* Primary CTA */}
                <div className="pt-2 flex justify-center lg:justify-start">
                  <button
                    onClick={() => onNavigate("creator")}
                    className={`flow-btn-primary px-9 py-4 rounded-full font-bold text-white flex items-center justify-center gap-3 cursor-pointer shadow-xl transition-all active:scale-95 w-full sm:w-auto ${hero.buttonFontSize || "text-base"}`}
                  >
                    <Wand2 className="w-5 h-5 text-white" />
                    <span>{hero.buttonText}</span>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Social Proof & Metrics */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-5 text-xs font-semibold text-[#635158]">
                  <div className="flex items-center gap-2 bg-[#FFFDFB]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EE4374]/15 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span><strong className="text-[#2A1A1F]">{hero.wishesCreatedCount}</strong> Wishes Created</span>
                  </div>

                  {hero.showRating && (
                    <div className="flex items-center gap-1.5 text-[#EE4374] bg-[#FFFDFB]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EE4374]/15 shadow-sm">
                      {"★".repeat(5)} <span className="font-extrabold text-[#2A1A1F]">{hero.ratingText}</span>
                    </div>
                  )}

                  {hero.showAvatars && hero.customerAvatars.length > 0 && (
                    <div className="flex items-center gap-2 bg-[#FFFDFB]/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#EE4374]/15 shadow-sm">
                      <div className="flex -space-x-2 overflow-hidden">
                        {hero.customerAvatars.map((url, idx) => (
                          <img key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-[#FFFDFB] object-cover" src={url} alt="User" />
                        ))}
                      </div>
                      <span className="text-xs text-[#635158] font-medium flex items-center gap-1">
                        Loved worldwide <Heart className="w-3.5 h-3.5 text-[#EE4374] fill-current" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================= TRUST RIBBON & FEATURES (EXACT COLOR ATMOSPHERE) ================= */}
      <section className="py-6 bg-[#FDF6F4] border-y border-[#EE4374]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-6 text-xs text-[#635158] font-semibold">
          <div className="flex items-center gap-6">
            <span className="uppercase tracking-widest text-[10px] font-extrabold text-[#D82C5D]">INTERACTIVE MODULES</span>
            <span className="font-bold text-[#2A1A1F]">MIC CANDLE BLOWING</span>
            <span className="font-bold text-[#2A1A1F]">3D UNBOXING</span>
            <span className="font-bold text-[#2A1A1F]">AUDIO SYNTH TUNES</span>
            <span className="font-bold text-[#2A1A1F]">PHOTO MEMORY TIMELINE</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-[#EE4374]" /> FREE UNLIMITED LINKS</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#EE4374]" /> INSTANT SHARE</span>
          </div>
        </div>
      </section>

      {/* ================= ORIGINAL BENTO FEATURE GRID (ORIGINAL STRUCTURE) ================= */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCE7EC] border border-[#EE4374]/20 text-[#D82C5D] text-xs font-extrabold uppercase tracking-wider">
              <PartyPopper className="w-3.5 h-3.5 text-[#EE4374]" />
              <span>Engineered For Joy</span>
            </div>
            <h2 className={`font-extrabold text-[#2A1A1F] font-serif-display tracking-tight ${settings.sectionHeadingFontSize || "text-3xl sm:text-5xl"}`}>
              Everything Needed For An <span className="italic text-[#EE4374]">Unforgettable Wish</span>
            </h2>
            <p className={`text-[#635158] leading-relaxed ${settings.bodyTextFontSize || "text-sm sm:text-base"}`}>
              Standard greeting cards get lost in chat histories. CelebrationCraft creates an immersive website experience that recipients cherish forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bento Card 1: Mic Blowing */}
            <div className="flow-card rounded-[28px] p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FCE7EC] flex items-center justify-center text-[#EE4374]">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D82C5D] block">AUDIO MIC SENSOR</span>
                <h3 className="text-xl font-bold font-serif-display text-[#2A1A1F]">Blow Out Real Candles</h3>
                <p className="text-xs sm:text-sm text-[#635158] leading-relaxed">
                  Using real-time web microphone frequency detection, recipients can blow directly into their phone or mic to extinguish the birthday flames.
                </p>
              </div>
              <div className="pt-6 border-t border-[#EE4374]/10 text-xs font-bold text-[#EE4374] flex items-center gap-1">
                <span>Microphone Detection Supported</span>
              </div>
            </div>

            {/* Bento Card 2: DARK BURGUNDY PLUM LUXURY UNBOXING CARD (#32101E) */}
            <div className="flow-card-dark rounded-[28px] p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#EE4374]">
                  <Lock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-300 block">3D ENVELOPE UNBOXING</span>
                <h3 className="text-2xl font-bold font-serif-display text-white">Realistic Wax Seal & Ribbon</h3>
                <p className="text-xs sm:text-sm text-rose-100/80 leading-relaxed">
                  Recipients slide open a tactile envelope with wax seal breaking sound effects before revealing your personalized celebration layout.
                </p>
              </div>

              <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold text-rose-200">
                <span>Wax Seal Sound FX</span>
                <span className="text-[#EE4374]">✨ VIP Theme</span>
              </div>
            </div>

            {/* Bento Card 3: Memory Timeline */}
            <div className="flow-card rounded-[28px] p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FCE7EC] flex items-center justify-center text-[#EE4374]">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D82C5D] block">PHOTO CAROUSEL</span>
                <h3 className="text-xl font-bold font-serif-display text-[#2A1A1F]">Photo Memory Frames</h3>
                <p className="text-xs sm:text-sm text-[#635158] leading-relaxed">
                  Upload cherished memory photos with custom captions that animate smoothly as your recipient scrolls through your wish site.
                </p>
              </div>
              <div className="pt-6 border-t border-[#EE4374]/10 text-xs font-bold text-[#EE4374] flex items-center gap-1">
                <span>Unlimited High-Res Uploads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE TEMPLATE GALLERY SECTION ================= */}
      <TemplateGallery
        onSelectTemplate={(tid) => {
          onSelectTemplate(tid);
          onNavigate("creator");
        }}
        onPreviewDemo={(cid) => onNavigate("view", cid)}
      />

      {/* ================= ORIGINAL AI WISH ASSISTANT PREVIEW WIDGET ================= */}
      <section className="py-20 bg-[#FDF6F4] border-y border-[#EE4374]/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flow-card rounded-[32px] p-8 sm:p-12 shadow-xl bg-[#FFFDFB]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FCE7EC] border border-[#EE4374]/20 text-[#D82C5D] text-xs font-extrabold uppercase tracking-wider">
                  <Wand2 className="w-3.5 h-3.5 text-[#EE4374]" />
                  <span>AI Wish Assistant</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-display text-[#2A1A1F]">
                  Never Struggle With <span className="italic text-[#EE4374]">What To Write</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#635158] leading-relaxed">
                  Our built-in AI Wish Writer generates warm, emotional, or humorous celebration wishes personalized for your relationship.
                </p>

                {/* Tone Selectors */}
                <div className="flex gap-2 pt-2">
                  {(["Birthday", "Bestie", "Anniversary"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleGenerateSampleAiWish(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        aiDemoOccasion === t
                          ? "bg-[#EE4374] text-white shadow-sm"
                          : "bg-[#FAF4EE] text-[#635158] hover:bg-[#FCE7EC]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 bg-[#FAF4EE] p-6 rounded-2xl border border-[#EE4374]/15 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D82C5D]">
                    AI GENERATED SAMPLE
                  </span>
                  {isGeneratingAi && <RefreshCw className="w-4 h-4 text-[#EE4374] animate-spin" />}
                </div>

                <p className="text-sm font-serif-display font-medium text-[#2A1A1F] italic leading-relaxed min-h-[70px]">
                  "{aiDemoResult}"
                </p>

                <div className="mt-4 pt-3 border-t border-[#EE4374]/10 flex items-center justify-between">
                  <span className="text-[11px] text-[#635158]">Included free in Creator Studio</span>
                  <button
                    onClick={() => onNavigate("creator")}
                    className="text-xs font-extrabold text-[#EE4374] hover:underline cursor-pointer"
                  >
                    Use AI Writer In Studio →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3-STEP CREATION PROCESS ================= */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#2A1A1F] font-serif-display">
              Build Your Website in <span className="italic text-[#EE4374]">3 Easy Steps</span>
            </h2>
            <p className="text-[#635158] text-sm sm:text-base">
              No coding required. Instant live shareable links.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Select Interactive Theme",
                desc: "Choose from our suite of themes — Bisma Celebration, Royal Gold Velvet, Cyber Neon, or Romantic Sweetheart."
              },
              {
                step: "02",
                title: "Customize & Add Photos",
                desc: "Write your wish message (or use AI), add memory photos, select background tunes, and set secret unboxing notes."
              },
              {
                step: "03",
                title: "Share Unique Link",
                desc: "Generate your unique celebration link or custom URL slug and send it directly to your recipient to make their day!"
              }
            ].map((s, idx) => (
              <div key={idx} className="flow-card rounded-[28px] p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EE4374] text-white flex items-center justify-center text-lg font-extrabold mx-auto shadow-md shadow-[#EE4374]/25">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold font-serif-display text-[#2A1A1F]">{s.title}</h3>
                <p className="text-xs sm:text-sm text-[#635158] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION BANNER ================= */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-[#EE4374] rounded-[32px] p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-5xl font-extrabold font-serif-display tracking-tight">
                Make Someone Smile Today
              </h2>
              <p className="text-rose-100 text-sm sm:text-base font-medium">
                Create a stunning interactive celebration website in under 60 seconds. Free, easy, and unforgettable.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate("creator")}
                  className="px-8 py-4 rounded-full bg-white text-[#EE4374] hover:bg-rose-50 font-extrabold text-sm shadow-xl transition-all cursor-pointer"
                >
                  Create Celebration Website Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#FAF4EE] border-t border-[#EE4374]/15 pt-16 pb-12 text-xs text-[#635158]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#EE4374] text-white flex items-center justify-center font-bold text-sm">
                  🎉
                </div>
                <span className="text-xl font-bold font-serif-display text-[#2A1A1F]">CelebrationCraft Studio</span>
              </div>
              <p className="text-xs text-[#635158] leading-relaxed">
                Empowering people to send interactive, joyful greeting websites complete with sound, unboxing, and blowable candle magic.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#2A1A1F]">THEMES</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate("gallery")} className="hover:text-[#EE4374]">Bisma Celebration</button></li>
                <li><button onClick={() => onNavigate("gallery")} className="hover:text-[#EE4374]">Royal Gold Velvet</button></li>
                <li><button onClick={() => onNavigate("gallery")} className="hover:text-[#EE4374]">Cyber Neon Beat</button></li>
                <li><button onClick={() => onNavigate("gallery")} className="hover:text-[#EE4374]">Sweetheart Pink</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#2A1A1F]">STUDIO TOOLS</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate("creator")} className="hover:text-[#EE4374]">AI Wish Writer</button></li>
                <li><button onClick={() => onNavigate("creator")} className="hover:text-[#EE4374]">Candle Simulator</button></li>
                <li><button onClick={() => onNavigate("creator")} className="hover:text-[#EE4374]">Photo Frame Carousel</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-[#2A1A1F]">DEMOS</h4>
              <ul className="space-y-2">
                <li><button onClick={() => onNavigate("view", "bisma-birthday")} className="hover:text-[#EE4374]">Birthday Demo</button></li>
                <li><button onClick={() => onNavigate("creator")} className="hover:text-[#EE4374]">Anniversary Wish</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#EE4374]/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#635158]">
            <div>© 2026 CelebrationCraft Studio. All rights reserved.</div>
            <div>Crafted with love & joy.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
