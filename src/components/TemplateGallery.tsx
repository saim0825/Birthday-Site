import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Eye,
  Crown,
  Zap,
  Heart,
  ChevronLeft,
  ChevronRight,
  Flame,
  Music,
  Gift,
  Check
} from "lucide-react";

interface TemplateGalleryProps {
  onSelectTemplate: (templateId: string) => void;
  onPreviewDemo: (cardId: string) => void;
}

export const TEMPLATES_DATA = [
  {
    id: "interactive-suite",
    name: "Grand Celebration Suite",
    description: "The fan-favorite interactive website! Features blowable candles, 3D gift unboxing, photo memory gallery, synth audio & balloon popping.",
    badge: "Featured & Popular",
    isPopular: true,
    accentColor: "from-[#EE4374] to-pink-600",
    previewUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
    icon: Sparkles,
    features: ["Mic Candle Blow", "Gift Box Unbox", "Photo Carousel", "Synth Tune"]
  },
  {
    id: "royal-golden",
    name: "Royal Gold Velvet",
    description: "Luxurious deep velvet & gold aesthetic with regal serif typography, royal candlelight ritual, and golden sparkle effects.",
    badge: "VIP Luxury",
    accentColor: "from-amber-500 to-yellow-600",
    previewUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
    icon: Crown,
    features: ["Gold Wax Seal", "Midnight Velvet", "Royal Fanfare", "Chandelier Glow"]
  },
  {
    id: "neon-cyber",
    name: "Cyber Neon Party Beat",
    description: "High-energy cyberpunk grid lighting, retro party synth beat, glowing neon beams, and electric particle bursts.",
    badge: "Party Beat",
    accentColor: "from-cyan-400 to-fuchsia-600",
    previewUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop",
    icon: Zap,
    features: ["Neon Grid Beat", "Synth Visualizer", "Laser Flame", "Cyber Confetti"]
  },
  {
    id: "sweet-heart",
    name: "Sweet Heart Romance",
    description: "Soft romantic pink glassmorphism, floating love hearts, handwritten notes, and intimate couples memory timeline.",
    badge: "Romantic",
    accentColor: "from-pink-400 to-rose-500",
    previewUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop",
    icon: Heart,
    features: ["Floating Hearts", "Velvet Note", "Couples Timeline", "Soft Candle Glow"]
  },
  {
    id: "glassmorphism-envelope",
    name: "Envelope & Precious Memories",
    description: "Interactive envelope opening experience with typing effect, star/balloon canvas, photo gallery, squabbles stage, and final surprise popup modal.",
    badge: "New & Interactive",
    accentColor: "from-purple-500 via-pink-500 to-indigo-600",
    previewUrl: "https://i.postimg.cc/T1WkQP0S/IMG-7302.avif",
    icon: Sparkles,
    features: ["Envelope Unboxing", "Typing Effect", "Memory Grid", "Surprise Popup"]
  }
];

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  onSelectTemplate,
  onPreviewDemo
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const total = TEMPLATES_DATA.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute 3 visible slots
  const leftIndex = (activeIndex - 1 + total) % total;
  const rightIndex = (activeIndex + 1) % total;

  return (
    <section
      className="py-24 text-[#2A1A1F] font-sans relative overflow-hidden bg-[#FAF4EE]"
      aria-label="Interactive Theme Selection Carousel"
    >
      {/* Background Soft Glow Orbs & Ambient Particles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-r from-[#EE4374]/15 via-[#FCE7EC]/50 to-[#D82C5D]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#FBE7ED] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#FCE7EC] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#FCE7EC] border border-[#EE4374]/20 px-4 py-1.5 rounded-full text-[#D82C5D] text-xs font-bold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#EE4374] animate-pulse" />
            <span>Interactive Carousel Suite</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2A1A1F] font-serif-display">
            Choose Your <span className="italic text-[#EE4374]">Interactive Theme</span>
          </h2>

          <p className="text-[#635158] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Swipe or use arrows to explore our immersive wish templates. Every site features candle blowing, sound tunes & unboxing.
          </p>
        </div>

        {/* CAROUSEL CONTAINER */}
        <div
          ref={containerRef}
          className="relative max-w-[1100px] mx-auto min-h-[520px] sm:min-h-[560px] flex items-center justify-center select-none"
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous template"
            className="absolute left-2 sm:left-4 z-40 p-3.5 rounded-full bg-[#FFFDFB]/90 border border-[#EE4374]/20 text-[#2A1A1F] hover:text-[#EE4374] hover:bg-[#FCE7EC] transition-all shadow-xl cursor-pointer hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#EE4374]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            aria-label="Next template"
            className="absolute right-2 sm:right-4 z-40 p-3.5 rounded-full bg-[#FFFDFB]/90 border border-[#EE4374]/20 text-[#2A1A1F] hover:text-[#EE4374] hover:bg-[#FCE7EC] transition-all shadow-xl cursor-pointer hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#EE4374]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* CAROUSEL CARDS STACK */}
          <div className="relative w-full max-w-[900px] h-[520px] sm:h-[540px] flex items-center justify-center">
            {TEMPLATES_DATA.map((template, idx) => {
              const isCenter = idx === activeIndex;
              const isLeft = idx === leftIndex;
              const isRight = idx === rightIndex;

              // Hide non-visible cards in 3-card window
              if (!isCenter && !isLeft && !isRight) return null;

              const IconComponent = template.icon;

              // Compute positioning styles
              let translateX = "0%";
              let rotate = 0;
              let scale = 0.8;
              let opacity = 0.65;
              let zIndex = 10;
              let blur = "blur(1px)";

              if (isCenter) {
                translateX = "0%";
                rotate = 0;
                scale = 1.0;
                opacity = 1;
                zIndex = 30;
                blur = "blur(0px)";
              } else if (isLeft) {
                translateX = "-42%";
                rotate = -12;
                scale = 0.82;
                opacity = 0.65;
                zIndex = 20;
                blur = "blur(1.5px)";
              } else if (isRight) {
                translateX = "42%";
                rotate = 12;
                scale = 0.82;
                opacity = 0.65;
                zIndex = 20;
                blur = "blur(1.5px)";
              }

              return (
                <motion.div
                  key={template.id}
                  initial={false}
                  animate={{
                    x: translateX,
                    rotate: rotate,
                    scale: scale,
                    opacity: opacity,
                    filter: blur
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 28,
                    mass: 0.8
                  }}
                  drag={isCenter ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(e, info) => {
                    if (info.offset.x < -50) handleNext();
                    if (info.offset.x > 50) handlePrev();
                  }}
                  onClick={() => {
                    if (isLeft) handlePrev();
                    if (isRight) handleNext();
                  }}
                  className={`absolute w-[290px] sm:w-[380px] rounded-[28px] bg-[#FFFDFB] border border-[#EE4374]/20 shadow-2xl transition-all duration-300 ${
                    isCenter
                      ? "ring-2 ring-[#EE4374]/40 shadow-[0_20px_50px_rgba(238,67,116,0.22)] cursor-default"
                      : "cursor-pointer hover:opacity-85"
                  }`}
                  style={{ zIndex }}
                >
                  {/* Top Accent Gradient Line */}
                  <div className={`h-2 rounded-t-[28px] bg-gradient-to-r ${template.accentColor}`} />

                  {/* Thumbnail Banner */}
                  <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-t-[24px] bg-[#FAF4EE]">
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDFB] via-[#FFFDFB]/20 to-transparent" />

                    {/* Badge */}
                    <span className="absolute top-3.5 left-3.5 bg-[#FCE7EC] border border-[#EE4374]/30 text-[#D82C5D] font-extrabold text-[10px] sm:text-[11px] px-3 py-1 rounded-full shadow-sm">
                      {template.badge}
                    </span>

                    {/* Floating Icon */}
                    <div className="absolute top-3.5 right-3.5 w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFFDFB]/90 backdrop-blur-md border border-[#EE4374]/20 flex items-center justify-center text-[#EE4374] shadow-md">
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <h3 className="text-lg sm:text-2xl font-bold font-serif-display text-[#2A1A1F]">
                      {template.name}
                    </h3>

                    {/* CENTER CARD FULL DETAILS */}
                    {isCenter ? (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <p className="text-xs sm:text-sm text-[#635158] leading-relaxed line-clamp-3">
                          {template.description}
                        </p>

                        {/* Feature Badges */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {template.features.map((feat, fidx) => (
                            <span
                              key={fidx}
                              className="text-[10px] font-bold text-[#D82C5D] bg-[#FCE7EC] px-2.5 py-0.5 rounded-full border border-[#EE4374]/15"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectTemplate(template.id);
                            }}
                            className="flex-1 py-3 px-4 rounded-full flow-btn-primary font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-transform"
                          >
                            <span>Use This Template</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>

                          {template.id === "interactive-suite" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onPreviewDemo("birthday-demo");
                              }}
                              className="px-3.5 py-3 rounded-full bg-[#FCE7EC] hover:bg-[#fbd3dd] text-[#D82C5D] border border-[#EE4374]/30 font-bold text-xs flex items-center gap-1 cursor-pointer"
                              title="Live Demo"
                            >
                              <Eye className="w-4 h-4 text-[#EE4374]" />
                              <span className="hidden sm:inline">Demo</span>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      /* SIDE CARDS MINIMAL FOOTER */
                      <div className="pt-2 text-[11px] font-bold text-[#EE4374] flex items-center justify-between">
                        <span>Click to View Theme</span>
                        <span>→</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* PAGINATION DOTS INDICATOR */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {TEMPLATES_DATA.map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setActiveIndex(dotIdx)}
              aria-label={`Go to template ${dotIdx + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                dotIdx === activeIndex
                  ? "w-8 h-2.5 bg-[#EE4374] shadow-sm shadow-[#EE4374]/40"
                  : "w-2.5 h-2.5 bg-[#EE4374]/30 hover:bg-[#EE4374]/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
