import React, { useState, useEffect } from "react";
import { CardData } from "../types";
import { BismaCard } from "./TemplateCards/BismaCard";
import { RoyalGoldenCard } from "./TemplateCards/RoyalGoldenCard";
import { NeonCyberCard } from "./TemplateCards/NeonCyberCard";
import { SweetHeartCard } from "./TemplateCards/SweetHeartCard";
import { HeroBalloonCanvas } from "./HeroBalloonCanvas";
import { Loader2, AlertCircle, ArrowLeft, PlusCircle, Sparkles } from "lucide-react";

interface ViewerPageProps {
  cardId: string;
  onNavigate: (view: "landing" | "creator" | "gallery" | "view", cardId?: string) => void;
}

export const ViewerPage: React.FC<ViewerPageProps> = ({ cardId, onNavigate }) => {
  const [card, setCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/cards/${cardId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Card not found");
        return res.json();
      })
      .then((data) => {
        setCard(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading card:", err);
        setError("Card not found or link has expired.");
        setLoading(false);
      });
  }, [cardId]);

  const handleSendReaction = async (emoji: string, text: string, senderName: string) => {
    try {
      const res = await fetch(`/api/cards/${cardId}/reaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, text, from: senderName })
      });
      const data = await res.json();
      if (data.card) {
        setCard(data.card);
      }
    } catch (err) {
      console.error("Error sending reaction:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF4EE] text-[#2A1A1F] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-[#EE4374] animate-spin mb-4" />
        <h2 className="text-xl font-bold font-serif-display">Unwrapping Celebration Site...</h2>
        <p className="text-xs text-[#635158] mt-1">Preparing candles, music, and interactive surprises</p>
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="min-h-screen bg-[#FAF4EE] text-[#2A1A1F] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#FCE7EC] border border-[#EE4374]/30 flex items-center justify-center text-[#EE4374] mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif-display mb-2">Celebration Card Not Found</h2>
        <p className="text-xs text-[#635158] max-w-md mb-6">{error || "The requested wish link does not exist."}</p>
        <button
          onClick={() => onNavigate("landing")}
          className="px-6 py-3 rounded-full flow-btn-primary text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#FAF4EE]">
      {/* Interactive Balloon Canvas Overlay for Recipient */}
      {card.interactiveOptions?.balloons !== false && <HeroBalloonCanvas />}

      {/* Render Template Card */}
      {card.templateId === "royal-golden" ? (
        <RoyalGoldenCard card={card} onSendReaction={handleSendReaction} />
      ) : card.templateId === "neon-cyber" ? (
        <NeonCyberCard card={card} onSendReaction={handleSendReaction} />
      ) : card.templateId === "sweet-heart" ? (
        <SweetHeartCard card={card} onSendReaction={handleSendReaction} />
      ) : (
        <BismaCard card={card} onSendReaction={handleSendReaction} />
      )}

      {/* Persistent CTA Bar Driving Virality */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] bg-[#FFFDFB]/90 backdrop-blur-2xl border border-[#EE4374]/20 px-4 py-3 rounded-full shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-full bg-[#FCE7EC] text-[#D82C5D]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#2A1A1F]">Create Your Own Wish Site</p>
            <p className="text-[10px] text-[#635158]">Free, instant & interactive</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate("creator")}
          className="px-5 py-2 rounded-full flow-btn-primary text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Create Wish</span>
        </button>
      </div>
    </div>
  );
};
