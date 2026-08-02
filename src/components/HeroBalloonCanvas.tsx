import React, { useState, useEffect } from "react";
import { soundFx } from "../lib/audio";
import { fireBalloonPopBurst, fireConfettiCannon } from "../lib/confetti";
import { Sparkles, PartyPopper } from "lucide-react";

interface Balloon {
  id: number;
  x: number; // percentage width (0-100)
  size: number; // px size (40-75)
  speed: number; // float duration seconds (12 - 25)
  color: string;
  delay: number; // seconds
  swayAmplitude: number;
  stringLength: number;
  label?: string;
}

const BALLOON_COLORS = [
  { fill: "#ec4899", glow: "rgba(236, 72, 153, 0.4)", border: "#db2777" }, // Pink
  { fill: "#8b5cf6", glow: "rgba(139, 92, 246, 0.4)", border: "#7c3aed" }, // Purple
  { fill: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)", border: "#2563eb" }, // Blue
  { fill: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", border: "#d97706" }, // Amber
  { fill: "#10b981", glow: "rgba(16, 185, 129, 0.4)", border: "#059669" }, // Emerald
  { fill: "#ef4444", glow: "rgba(239, 68, 68, 0.4)", border: "#dc2626" }, // Red
  { fill: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)", border: "#0891b2" }, // Cyan
];

interface HeroBalloonCanvasProps {
  onPopCountChange?: (count: number) => void;
}

export const HeroBalloonCanvas: React.FC<HeroBalloonCanvasProps> = ({ onPopCountChange }) => {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [popCount, setPopCount] = useState<number>(0);
  const [popEffects, setPopEffects] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);

  useEffect(() => {
    // Generate initial 12 balloons spread across the screen
    const initialBalloons: Balloon[] = Array.from({ length: 12 }).map((_, i) => ({
      id: i + 1,
      x: 5 + (i * 8) + (Math.random() * 5),
      size: 48 + Math.floor(Math.random() * 24),
      speed: 12 + Math.random() * 12,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length].fill,
      delay: Math.random() * 8,
      swayAmplitude: 15 + Math.random() * 25,
      stringLength: 50 + Math.random() * 30,
      label: i === 0 ? "Click Me!" : i === 3 ? "Wish! 🎉" : undefined,
    }));
    setBalloons(initialBalloons);
  }, []);

  const handlePopBalloon = (e: React.MouseEvent, balloonId: number) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    // Sound & particles
    soundFx.playPop();
    fireBalloonPopBurst(clickX, clickY);

    // Update counters
    const newCount = popCount + 1;
    setPopCount(newCount);
    if (onPopCountChange) onPopCountChange(newCount);

    // Track on server silently
    fetch("/api/pop-balloon", { method: "POST" }).catch(() => {});

    // Pop feedback floating text
    const popEffectId = Date.now() + Math.random();
    setPopEffects((prev) => [
      ...prev,
      { id: popEffectId, x: clickX, y: clickY, text: "+1 Pop! 🎈" },
    ]);

    setTimeout(() => {
      setPopEffects((prev) => prev.filter((p) => p.id !== popEffectId));
    }, 1000);

    // Remove popped balloon and respawn after delay
    setBalloons((prev) => prev.filter((b) => b.id !== balloonId));

    setTimeout(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: 5 + Math.random() * 90,
          size: 48 + Math.floor(Math.random() * 24),
          speed: 12 + Math.random() * 10,
          color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)].fill,
          delay: 0,
          swayAmplitude: 15 + Math.random() * 25,
          stringLength: 50 + Math.random() * 30,
        },
      ]);
    }, 1200);
  };

  const handleBurstAll = () => {
    soundFx.playTaDa();
    fireConfettiCannon();
    // Launch extra floating balloons
    const extraBalloons: Balloon[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 90,
      size: 50 + Math.floor(Math.random() * 25),
      speed: 10 + Math.random() * 8,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length].fill,
      delay: 0,
      swayAmplitude: 20 + Math.random() * 30,
      stringLength: 60,
    }));
    setBalloons((prev) => [...prev, ...extraBalloons]);
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Pop Floating Floating Text Effects */}
      {popEffects.map((effect) => (
        <div
          key={effect.id}
          style={{ left: effect.x, top: effect.y }}
          className="fixed z-50 transform -translate-x-1/2 -translate-y-1/2 text-pink-400 font-extrabold text-lg animate-bounce pointer-events-none drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
        >
          {effect.text}
        </div>
      ))}

      {/* Floating Balloons Layer */}
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-100px] pointer-events-auto cursor-pointer group transition-transform duration-200 hover:scale-110 active:scale-95"
          style={{
            left: `${b.x}%`,
            animation: `balloonFloat ${b.speed}s linear infinite`,
            animationDelay: `${b.delay}s`,
          }}
          onClick={(e) => handlePopBalloon(e, b.id)}
          title="Click to Pop! 🎈"
        >
          <div className="relative flex flex-col items-center">
            {/* Balloon Body SVG */}
            <svg
              width={b.size}
              height={b.size * 1.2}
              viewBox="0 0 100 120"
              className="drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-filter duration-300 group-hover:brightness-125"
            >
              <defs>
                <radialGradient id={`grad-${b.id}`} cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="30%" stopColor={b.color} />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
                </radialGradient>
              </defs>
              {/* Main Balloon Oval */}
              <ellipse cx="50" cy="50" rx="45" ry="50" fill={`url(#grad-${b.id})`} />
              {/* Highlight shine */}
              <ellipse cx="32" cy="30" rx="10" ry="16" fill="#ffffff" opacity="0.45" transform="rotate(-20 32 30)" />
              {/* Balloon knot */}
              <polygon points="45,98 55,98 50,108" fill={b.color} />
            </svg>

            {/* Balloon String */}
            <svg width="2" height={b.stringLength} className="opacity-60">
              <line
                x1="1"
                y1="0"
                x2="1"
                y2={b.stringLength}
                stroke="#cbd5e1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Optional Fun Label */}
            {b.label && (
              <span className="absolute -top-7 bg-pink-500/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg animate-pulse">
                {b.label}
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Floating Sparkles & Soft Confetti background particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-ping"
            style={{
              left: `${(i * 7 + 10) % 95}%`,
              top: `${(i * 11 + 5) % 85}%`,
              width: `${4 + (i % 5)}px`,
              height: `${4 + (i % 5)}px`,
              backgroundColor: BALLOON_COLORS[i % BALLOON_COLORS.length].fill,
              animationDuration: `${2 + (i % 4)}s`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Interactive Balloon Popper Floating Control Widget */}
      <div className="absolute top-24 right-6 pointer-events-auto z-20 hidden md:flex items-center gap-3 bg-slate-900/80 backdrop-blur-md border border-pink-500/30 px-3.5 py-2 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-pink-300">
          <PartyPopper className="w-4 h-4 text-pink-400 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Popped: <strong className="text-white text-sm">{popCount}</strong></span>
        </div>
        <button
          onClick={handleBurstAll}
          className="text-xs bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-3 py-1.5 rounded-xl shadow-md transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          More Balloons!
        </button>
      </div>
    </div>
  );
};
