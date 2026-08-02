import React, { useState, useEffect } from "react";
import { Sparkles, PartyPopper, Volume2, VolumeX, PlusCircle, Music } from "lucide-react";
import { soundFx } from "../lib/audio";

interface NavbarProps {
  onNavigate: (view: "landing" | "creator" | "gallery" | "view", cardId?: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentView }) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  // Attempt autoplay soundtrack on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      soundFx.playBirthdayTune();
      setIsPlayingMusic(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleSoundtrack = () => {
    if (isPlayingMusic) {
      soundFx.stopMusic();
      setIsPlayingMusic(false);
    } else {
      soundFx.playBirthdayTune();
      setIsPlayingMusic(true);
    }
  };

  return (
    <div className="w-full z-50">
      {/* Top Banner Ribbon */}
      <div className="bg-[#3E1523] text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#EE4374] animate-pulse" />
        <span>
          <strong className="text-[#FCE7EC]">CelebrationCraft Studio:</strong> Turn birthday wishes into interactive, blowable candle websites.
        </span>
        <button
          onClick={() => onNavigate("creator")}
          className="text-[#FCE7EC] underline font-bold hover:text-white transition-colors cursor-pointer ml-1"
        >
          Create Free Wish →
        </button>
      </div>

      {/* Main Header Nav */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#FFFDFB]/90 border-b border-[#EE4374]/15 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 bg-[#FCE7EC] border border-[#EE4374]/20 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <PartyPopper className="w-5 h-5 text-[#EE4374]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2A1A1F] font-serif-display group-hover:text-[#EE4374] transition-colors">
                  CelebrationCraft
                </span>
                <span className="bg-[#FCE7EC] border border-[#D82C5D]/20 text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full text-[#D82C5D]">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-[#635158] font-medium hidden sm:block">
                Interactive Birthday & Wish Web Experiences
              </p>
            </div>
          </div>

          {/* Navigation Links - Text Only */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#635158]">
            <button
              onClick={() => onNavigate("landing")}
              className={`hover:text-[#EE4374] transition-colors cursor-pointer ${currentView === "landing" ? "text-[#EE4374] font-bold" : ""}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate("gallery")}
              className={`hover:text-[#EE4374] transition-colors cursor-pointer ${currentView === "gallery" ? "text-[#EE4374] font-bold" : ""}`}
            >
              Theme Suites
            </button>
            <button
              onClick={() => onNavigate("creator")}
              className={`hover:text-[#EE4374] transition-colors cursor-pointer ${currentView === "creator" ? "text-[#EE4374] font-bold" : ""}`}
            >
              Studio
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Circular Floating Music Control Button */}
            <div className="relative">
              {isPlayingMusic && (
                <span className="absolute -inset-1 rounded-full bg-[#EE4374]/20 animate-ping pointer-events-none" />
              )}
              <button
                onClick={toggleSoundtrack}
                aria-label={isPlayingMusic ? "Stop Music" : "Play Music"}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#EE4374]/30 shadow-md flex items-center justify-center transition-all cursor-pointer hover:scale-110 active:scale-95 ${
                  isPlayingMusic
                    ? "bg-[#EE4374] text-white shadow-[#EE4374]/30 animate-bounce"
                    : "bg-[#FCE7EC] text-[#D82C5D] hover:bg-[#fbd3dd]"
                }`}
                title={isPlayingMusic ? "Stop Music" : "Play Birthday Soundtrack"}
              >
                {isPlayingMusic ? (
                  <Volume2 className="w-5 h-5 animate-pulse" />
                ) : (
                  <VolumeX className="w-5 h-5 text-[#635158]" />
                )}
              </button>
            </div>

            {/* Compact Primary CTA Button */}
            <button
              onClick={() => onNavigate("creator")}
              className="flow-btn-primary px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Wish</span>
            </button>
          </div>
        </div>
      </header>
    </div>
  );
};
