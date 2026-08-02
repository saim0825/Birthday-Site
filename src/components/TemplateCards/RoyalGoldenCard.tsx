import React, { useState } from "react";
import { CardData } from "../../types";
import { soundFx } from "../../lib/audio";
import { fireConfettiCannon } from "../../lib/confetti";
import { Crown, Sparkles, Heart, Flame, Gift, Volume2, VolumeX, Share2 } from "lucide-react";

interface RoyalGoldenCardProps {
  card: CardData;
  onSendReaction?: (emoji: string, text: string, senderName: string) => void;
}

export const RoyalGoldenCard: React.FC<RoyalGoldenCardProps> = ({ card }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleBlow = () => {
    soundFx.playBlowCandle();
    setCandlesBlown(true);
    fireConfettiCannon();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-amber-100 font-serif pb-24 relative overflow-hidden">
      {/* Royal Gold Gradient Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-gradient-to-b from-amber-500/10 via-yellow-600/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 pt-12 relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 rounded-full text-amber-300 text-xs font-sans font-extrabold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Royal Celebration</span>
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-normal tracking-wide bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Happy {card.occasion || "Birthday"}, {card.recipientName}
          </h1>

          <p className="text-amber-200/70 text-sm font-sans">
            Presented with highest regards from <strong className="text-amber-200">{card.senderName}</strong>
          </p>
        </div>

        {/* Photo Frame */}
        {card.images && card.images.length > 0 && (
          <div className="mb-10 max-w-xl mx-auto border-2 border-amber-500/40 p-3 rounded-2xl bg-amber-950/20 shadow-2xl">
            <img
              src={card.images[0].url}
              alt={card.recipientName}
              className="w-full h-80 object-cover rounded-xl border border-amber-500/20"
            />
          </div>
        )}

        {/* Message Box */}
        <div className="mb-10 max-w-xl mx-auto bg-slate-900/90 border border-amber-500/30 p-8 rounded-2xl shadow-2xl text-center">
          <p className="text-lg text-amber-100 italic leading-relaxed font-serif">
            "{card.message}"
          </p>
          <div className="mt-6 pt-4 border-t border-amber-500/20 text-xs font-sans text-amber-400/80">
            With everlasting warmth • {card.senderName}
          </div>
        </div>

        {/* Candle Ritual */}
        <div className="max-w-sm mx-auto bg-amber-950/30 border border-amber-500/30 p-6 rounded-2xl text-center font-sans">
          <h3 className="text-amber-300 font-bold mb-3 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Illuminate the Royal Wish
          </h3>
          <button
            onClick={handleBlow}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
          >
            {candlesBlown ? "Wish Granted ✨" : "Blow Candle & Celebrate"}
          </button>
        </div>
      </div>
    </div>
  );
};
