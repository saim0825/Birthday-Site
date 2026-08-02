import React, { useState } from "react";
import { CardData } from "../../types";
import { soundFx } from "../../lib/audio";
import { fireConfettiCannon } from "../../lib/confetti";
import { Zap, Flame, PartyPopper } from "lucide-react";

interface NeonCyberCardProps {
  card: CardData;
  onSendReaction?: (emoji: string, text: string, senderName: string) => void;
}

export const NeonCyberCard: React.FC<NeonCyberCardProps> = ({ card }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);

  const handleBlow = () => {
    soundFx.playBlowCandle();
    setCandlesBlown(true);
    fireConfettiCannon();
  };

  return (
    <div className="min-h-screen bg-black text-cyan-300 font-mono pb-24 relative overflow-hidden">
      {/* Neon Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-3xl mx-auto px-4 pt-12 relative z-10">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 border border-cyan-500/50 bg-cyan-950/40 px-4 py-1.5 rounded-none text-cyan-400 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>NEON CELEBRATION PROTOCOL</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]">
            HBD //{card.recipientName.toUpperCase()}//
          </h1>

          <p className="text-pink-400 text-xs tracking-wider">
            TRANSMITTED BY: <span className="text-cyan-300">{card.senderName}</span>
          </p>
        </div>

        {card.images && card.images.length > 0 && (
          <div className="mb-10 max-w-lg mx-auto border-2 border-fuchsia-500/80 p-1 bg-black shadow-[0_0_30px_rgba(217,70,239,0.5)]">
            <img src={card.images[0].url} alt={card.recipientName} className="w-full h-80 object-cover" />
          </div>
        )}

        <div className="mb-10 max-w-xl mx-auto bg-slate-950 border border-cyan-500/50 p-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
          <p className="text-sm text-cyan-100 leading-relaxed font-sans">
            "{card.message}"
          </p>
        </div>

        <div className="max-w-sm mx-auto bg-slate-950 border border-pink-500/50 p-6 text-center shadow-[0_0_20px_rgba(236,72,153,0.4)]">
          <button
            onClick={handleBlow}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:from-cyan-400 hover:to-fuchsia-500 text-black font-black text-xs uppercase tracking-widest cursor-pointer"
          >
            {candlesBlown ? "SYSTEM CELEBRATING 🚀" : "IGNITE CANDLE BEAM"}
          </button>
        </div>
      </div>
    </div>
  );
};
