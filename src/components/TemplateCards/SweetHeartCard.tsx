import React, { useState } from "react";
import { CardData } from "../../types";
import { soundFx } from "../../lib/audio";
import { fireConfettiCannon } from "../../lib/confetti";
import { Heart, Sparkles, Flame } from "lucide-react";

interface SweetHeartCardProps {
  card: CardData;
  onSendReaction?: (emoji: string, text: string, senderName: string) => void;
}

export const SweetHeartCard: React.FC<SweetHeartCardProps> = ({ card }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleBlow = () => {
    soundFx.playBlowCandle();
    setCandlesBlown(true);
    fireConfettiCannon();
  };

  return (
    <div className="min-h-screen bg-pink-950/90 text-pink-100 font-sans pb-24 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 pt-12 relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 border border-pink-400/40 bg-pink-500/20 px-4 py-1.5 rounded-full text-pink-200 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
            <span>Sweet Heart Celebration</span>
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">
            With Love to {card.recipientName} 💕
          </h1>

          <p className="text-pink-300 text-sm">
            Sent with warm cuddles from <strong>{card.senderName}</strong>
          </p>
        </div>

        {card.images && card.images.length > 0 && (
          <div className="mb-10 max-w-lg mx-auto p-3 rounded-3xl bg-pink-900/40 border border-pink-400/30 shadow-2xl">
            <img src={card.images[0].url} alt={card.recipientName} className="w-full h-80 object-cover rounded-2xl" />
          </div>
        )}

        <div className="mb-10 max-w-xl mx-auto bg-slate-900/90 border border-pink-400/30 p-8 rounded-3xl shadow-2xl text-center">
          <blockquote className="text-base sm:text-lg text-pink-100 italic">
            "{card.message}"
          </blockquote>
        </div>

        <div className="max-w-sm mx-auto bg-pink-900/40 border border-pink-400/30 p-6 rounded-3xl text-center">
          <button
            onClick={handleBlow}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg cursor-pointer"
          >
            {candlesBlown ? "Love & Wishes Sent! 💖" : "Blow Candle & Wish"}
          </button>
        </div>
      </div>
    </div>
  );
};
