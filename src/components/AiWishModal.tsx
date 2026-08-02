import React, { useState } from "react";
import { Sparkles, X, Wand2, Loader2, Check } from "lucide-react";

interface AiWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyWish: (wish: string) => void;
  recipientName: string;
  senderName: string;
  occasion: string;
}

export const AiWishModal: React.FC<AiWishModalProps> = ({
  isOpen,
  onClose,
  onApplyWish,
  recipientName,
  senderName,
  occasion
}) => {
  const [relationship, setRelationship] = useState("Best Friend");
  const [tone, setTone] = useState("heartfelt");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedWish, setGeneratedWish] = useState("");

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/generate-wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName: recipientName || "Friend",
          senderName: senderName || "Me",
          relationship,
          occasion: occasion || "Birthday",
          tone
        })
      });

      const data = await res.json();
      if (data.wish) {
        setGeneratedWish(data.wish);
      }
    } catch (err) {
      console.error("AI Wish Generation error:", err);
      setGeneratedWish(`Happy ${occasion || 'Birthday'} ${recipientName || 'there'}! Wishing you an unforgettable day full of laughter, joy, and wonderful memories. — With love, ${senderName || 'Me'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-pink-500/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden text-white">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Wish Assistant</h3>
              <p className="text-xs text-slate-400">Craft personalized greeting messages powered by Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-bold text-slate-300 mb-1.5 block">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
            >
              <option value="Best Friend">Best Friend</option>
              <option value="Partner / Loved One">Partner / Loved One</option>
              <option value="Sibling / Cousin">Sibling / Cousin</option>
              <option value="Parent / Relative">Parent / Relative</option>
              <option value="Colleague / Boss">Colleague / Boss</option>
              <option value="Special Someone">Special Someone</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 mb-1.5 block">Message Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "heartfelt", label: "💖 Heartfelt & Touching" },
                { id: "hilarious", label: "😂 Hilarious & Funny" },
                { id: "poetic", label: "✨ Poetic & Elegant" },
                { id: "energetic", label: "🚀 High-Energy & Hype" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                    tone === t.id
                      ? "bg-pink-500/20 border-pink-500 text-pink-300 shadow-sm"
                      : "bg-slate-950 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-pink-200" />
                <span>Writing Wish...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Custom Wish</span>
              </>
            )}
          </button>

          {/* Generated Wish Output Box */}
          {generatedWish && (
            <div className="bg-slate-950 border border-pink-500/30 p-4 rounded-2xl space-y-3">
              <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider block">Generated Message:</span>
              <p className="text-xs text-slate-200 leading-relaxed italic">"{generatedWish}"</p>
              <button
                onClick={() => {
                  onApplyWish(generatedWish);
                  onClose();
                }}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use This Wish Message</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
