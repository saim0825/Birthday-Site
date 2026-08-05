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
    "Happy Birthday Sarah! 🎉 May your year ahead be packed with endless laughter, spontaneous adventures, and unforgettable memories!"
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

      {/* ================= HERO SECTION (MATCHING EXACT REFERENCE DESIGN) ================= */}
      {hero.showHeroSection && (
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden z-10 bg-gradient-to-b from-[#FFF5F7] via-[#FAF9FB] to-[#FAF8FA]">
          {/* DECORATIVE FLOATING ELEMENTS */}
          {/* Top Left Pink Star */}
          <div className="absolute top-6 left-6 sm:left-14 z-10 pointer-events-none animate-pulse">
            <svg className="w-7 h-7 sm:w-9 sm:h-9 text-[#EE2B55] fill-[#EE2B55]" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Mid Left Orange 4-pointed Sparkle */}
          <div className="absolute top-1/2 left-6 sm:left-20 -translate-y-1/2 z-10 pointer-events-none">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#FF6B4A] fill-[#FF6B4A]" viewBox="0 0 24 24">
              <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
            </svg>
          </div>

          {/* Top Right Hanging Purple Balloon with String */}
          <div className="absolute top-0 right-10 sm:right-24 z-10 pointer-events-none flex flex-col items-center">
            <div className="w-0.5 h-10 bg-[#8B5CF6]/40" />
            <div className="w-8 h-10 sm:w-10 sm:h-12 bg-[#8B5CF6] rounded-full shadow-md relative">
              <div className="absolute top-2 left-2 w-2 h-3 bg-white/40 rounded-full" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-[#7C3AED] rounded-sm" />
            </div>
            <div className="w-1 h-3 border-l border-[#8B5CF6]/50 rotate-12 -mt-0.5" />
          </div>

          {/* Bottom Right Floating Confetti Graphic */}
          <div className="absolute bottom-20 right-16 sm:right-32 z-10 pointer-events-none">
            <div className="relative">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[18px] border-b-[#A855F7] rotate-45" />
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#3B82F6]" />
              <div className="absolute bottom-0 -left-2 w-1.5 h-1.5 rounded-full bg-[#EC4899]" />
            </div>
          </div>

          {/* Interactive Balloon Canvas Layer */}
          <HeroBalloonCanvas
            onPopCountChange={() => {
              setHeroPopCount((prev) => prev + 1);
            }}
          />

          {/* Main Hero Container */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-20 text-center">
            {/* Top Pill Badge */}
            {hero.showBadge && (
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FEE2E8]/80 border border-[#F43F5E]/20 shadow-xs backdrop-blur-xs">
                  <span className="text-[#E11D48] text-xs font-bold">•</span>
                  <span className="text-xs">✨</span>
                  <span className="text-[#E11D48] font-bold text-xs sm:text-sm tracking-tight">
                    {hero.badgeText || "#1 Digital Celebration Platform | Voted Top Brand"}
                  </span>
                </div>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="font-black tracking-tight leading-[1.08] text-[#0F172A] text-5xl sm:text-7xl lg:text-8xl max-w-4xl mx-auto">
              <div>Make Them</div>
              <div className="text-[#EE2B55] mt-1 sm:mt-2">
                Feel Truly Special
              </div>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="mt-6 text-slate-600 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-normal">
              Create stunning <strong className="font-bold text-slate-900">digital birthday pages</strong> and <strong className="font-bold text-slate-900">celebration websites</strong> for anniversaries, Valentine's, and every moment that deserves more than just a simple wish.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <button
                onClick={() => onNavigate("creator")}
                className="w-full sm:w-auto bg-[#EE2B55] hover:bg-[#D91B43] text-white font-bold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-lg shadow-[#EE2B55]/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{hero.buttonText || "Create Your Wish →"}</span>
              </button>

              <button
                onClick={() => {
                  const galleryEl = document.getElementById("template-gallery-section");
                  if (galleryEl) {
                    galleryEl.scrollIntoView({ behavior: "smooth" });
                  } else {
                    onNavigate("gallery");
                  }
                }}
                className="w-full sm:w-auto bg-[#F8FAFC] hover:bg-white border-2 border-slate-900 text-slate-900 font-bold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span className="text-xs text-slate-900">►</span>
                <span>See How It Works</span>
              </button>
            </div>

            {/* Subtext under buttons */}
            <div className="mt-6 text-slate-500 font-bold text-xs sm:text-sm tracking-wide">
              Birthday • Anniversary • Valentine's • And more
            </div>
          </div>
        </section>
      )}

      {/* Floating Bottom Right Feedback Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => alert("Thank you for your feedback! We love making your moments special.")}
          className="bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 transition-all cursor-pointer border border-white/10 active:scale-95"
        >
          <span className="text-sm">💬</span>
          <span>Your feedback is precious to us</span>
        </button>
      </div>

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
                desc: "Choose from our suite of themes — Grand Celebration, Royal Gold Velvet, Cyber Neon, or Romantic Sweetheart."
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
                <li><button onClick={() => onNavigate("gallery")} className="hover:text-[#EE4374]">Grand Celebration</button></li>
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
                <li><button onClick={() => onNavigate("view", "birthday-demo")} className="hover:text-[#EE4374]">Birthday Demo</button></li>
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
