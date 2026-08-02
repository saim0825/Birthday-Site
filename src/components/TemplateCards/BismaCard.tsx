import React, { useState, useEffect } from "react";
import { CardData } from "../../types";
import { soundFx } from "../../lib/audio";
import { fireConfettiCannon, fireFireworks, fireBalloonPopBurst } from "../../lib/confetti";
import { PartyPopper, Heart, Sparkles, Flame, Gift, Volume2, VolumeX, Share2, Send, CheckCircle2 } from "lucide-react";

interface BismaCardProps {
  card: CardData;
  onSendReaction?: (emoji: string, text: string, senderName: string) => void;
  isCustomPreview?: boolean;
}

export const BismaCard: React.FC<BismaCardProps> = ({ card, onSendReaction, isCustomPreview }) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [giftOpened, setGiftOpened] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [reactionText, setReactionText] = useState("");
  const [reactionSender, setReactionSender] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("💖");
  const [reactionSubmitted, setReactionSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [isOpeningAnimation, setIsOpeningAnimation] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpeningAnimation || isEnvelopeOpened) return;
    setIsOpeningAnimation(true);
    soundFx.playEnvelopeOpen();

    setTimeout(() => {
      setIsEnvelopeOpened(true);
      soundFx.playTaDa();
      if (card.interactiveOptions?.confetti) {
        fireFireworks();
        fireConfettiCannon();
      }
    }, 750);
  };

  // Trigger initial fireworks celebration on mount
  useEffect(() => {
    if (card.interactiveOptions?.confetti) {
      fireFireworks();
    }
  }, [card.id]);

  // Photo slider timer if multiple photos
  useEffect(() => {
    if (card.images && card.images.length > 1) {
      const interval = setInterval(() => {
        setActivePhotoIndex((prev) => (prev + 1) % card.images.length);
      }, 4500);
      return () => clearInterval(interval);
    }
  }, [card.images]);

  const handleBlowCandles = () => {
    soundFx.playBlowCandle();
    setCandlesBlown(true);
    setTimeout(() => {
      soundFx.playTaDa();
      fireConfettiCannon();
    }, 300);
  };

  const handleOpenGift = () => {
    soundFx.playTaDa();
    setGiftOpened(true);
    fireConfettiCannon();
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      soundFx.stopMusic();
      setIsPlayingMusic(false);
    } else {
      soundFx.playBirthdayTune();
      setIsPlayingMusic(true);
    }
  };

  const handleSubmitReaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSendReaction) {
      onSendReaction(selectedEmoji, reactionText, reactionSender || card.recipientName);
    }
    setReactionSubmitted(true);
    soundFx.playTaDa();
    fireConfettiCannon();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const currentThemeColor = card.themeColor || "#ec4899";

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white pb-24">
      {/* Background Animated Ambient Mesh Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-purple-600/20 via-fuchsia-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "6s" }} />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDuration: "8s" }} />

      {!isEnvelopeOpened ? (
        /* ==================== REALISTIC ENVELOPE UNBOXING INTRO ==================== */
        <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative z-20 py-12">
          <div className="text-center max-w-md space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-4 py-1.5 rounded-full text-purple-300 text-xs font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Special Delivery For You</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flow-gradient-text">
              You've Received a Wish! 💌
            </h1>
            <p className="text-xs sm:text-sm text-gray-400">
              Tap the envelope or wax seal below to unbox {card.recipientName}'s interactive greeting letter
            </p>
          </div>

          {/* Envelope Visual Container */}
          <div
            onClick={handleOpenEnvelope}
            className={`relative w-full max-w-md aspect-[4/2.8] bg-gradient-to-br from-[#1c112b] via-[#120a21] to-[#0a0515] border border-white/20 rounded-2xl shadow-[0_25px_60px_-15px_rgba(168,85,247,0.4)] cursor-pointer group transition-all duration-500 ${
              isOpeningAnimation ? "scale-105" : "hover:-translate-y-2 hover:border-purple-500/50"
            }`}
            style={{ perspective: "1000px" }}
          >
            {/* Top Flap with 3D Flip */}
            <div
              className={`absolute top-0 left-0 w-full h-[52%] bg-gradient-to-b from-[#2a1842] to-[#170c2a] border-b border-purple-400/30 transition-transform duration-700 ease-in-out origin-top z-30 ${
                isOpeningAnimation ? "[transform:rotateX(180deg)]" : ""
              }`}
              style={{
                clipPath: "polygon(0 0, 50% 100%, 100% 0)",
              }}
            />

            {/* Wax Seal */}
            <div
              className={`absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-fuchsia-600 via-purple-700 to-indigo-900 border-2 border-purple-300 flex items-center justify-center shadow-lg shadow-purple-900/50 z-40 transition-all duration-500 ${
                isOpeningAnimation ? "opacity-0 scale-50" : "group-hover:scale-110"
              }`}
            >
              <Heart className="w-6 h-6 text-fuchsia-300 fill-fuchsia-300 animate-pulse" />
            </div>

            {/* Inner Letter Preview sliding out */}
            <div
              className={`absolute top-4 left-[5%] w-[90%] h-[85%] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center flex flex-col justify-center items-center z-20 transition-all duration-700 ${
                isOpeningAnimation ? "-translate-y-28 opacity-0 scale-105" : ""
              }`}
            >
              <span className="text-[10px] font-extrabold text-purple-300 uppercase tracking-widest mb-1">
                Celebration Card
              </span>
              <h2 className="text-xl sm:text-2xl font-serif italic font-bold text-white mb-2">
                For {card.recipientName}
              </h2>
              <p className="text-[11px] text-gray-300 line-clamp-2 italic px-4">
                "{card.message}"
              </p>
            </div>

            {/* Envelope Bottom Label */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-gray-300 border-t border-white/10 pt-2.5 z-30">
              <span className="font-bold text-purple-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-fuchsia-400 fill-fuchsia-400" /> To: {card.recipientName}
              </span>
              <span className="text-gray-400">From: {card.senderName}</span>
            </div>
          </div>

          {/* Open Letter CTA Button */}
          <button
            onClick={handleOpenEnvelope}
            disabled={isOpeningAnimation}
            className="mt-8 px-9 py-4 rounded-full flow-btn-glow text-white font-extrabold text-sm transition-all cursor-pointer flex items-center gap-2.5 group"
          >
            <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 transition-transform" />
            <span>{isOpeningAnimation ? "Unboxing Letter..." : "✨ Open Letter ✨"}</span>
            <Heart className="w-4 h-4 text-fuchsia-200 fill-fuchsia-200" />
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 relative z-10 animate-fadeIn">
          {/* Floating Toolbar Controls */}
          <div className="flex items-center justify-between flow-glass px-5 py-3 rounded-full shadow-2xl mb-8">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
              <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300">
                Celebration Site for {card.recipientName}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsEnvelopeOpened(false);
                  setIsOpeningAnimation(false);
                }}
                className="p-2.5 rounded-full bg-purple-950/60 border border-purple-500/30 hover:border-purple-400 text-xs font-bold transition-all flex items-center gap-2 text-purple-300 cursor-pointer"
                title="View Envelope Intro"
              >
                <Heart className="w-4 h-4 text-fuchsia-400" />
                <span className="hidden md:inline">Envelope</span>
              </button>

              <button
                onClick={toggleMusic}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 text-xs font-bold transition-all flex items-center gap-2 text-purple-300 cursor-pointer"
              >
                {isPlayingMusic ? <Volume2 className="w-4 h-4 text-purple-400 animate-bounce" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span className="hidden sm:inline">{isPlayingMusic ? "Playing Tune" : "Play Tune"}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="p-2.5 rounded-full flow-btn-glow text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLink ? "Link Copied!" : "Share Website"}</span>
              </button>
            </div>
          </div>

        {/* 1. DYNAMIC CELEBRATION HEADER */}
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/30 px-4 py-1.5 rounded-full text-pink-300 text-xs font-extrabold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Special {card.occasion || "Birthday"} Wish</span>
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-pink-100 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">
            Happy {card.occasion || "Birthday"},{" "}
            <span style={{ color: currentThemeColor }} className="underline decoration-pink-500/40 underline-offset-8">
              {card.recipientName}!
            </span>{" "}
            🎉✨
          </h1>

          <p className="text-slate-400 text-sm sm:text-base font-medium max-w-lg mx-auto">
            Sent with boundless love & celebratory energy from{" "}
            <strong className="text-white font-bold">{card.senderName}</strong>
          </p>
        </div>

        {/* 2. GLOWING MEMORY PHOTO FRAME */}
        {card.images && card.images.length > 0 && (
          <div className="mb-12 relative group max-w-2xl mx-auto">
            <div
              className="absolute -inset-1.5 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition duration-500"
              style={{ backgroundColor: currentThemeColor }}
            />

            <div className="relative bg-slate-900 border border-white/15 rounded-[28px] p-4 sm:p-5 shadow-2xl overflow-hidden">
              <div className="aspect-[4/3] sm:aspect-[16/10] w-full rounded-[22px] overflow-hidden relative bg-slate-950">
                <img
                  src={card.images[activePhotoIndex]?.url || "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop"}
                  alt={`Memory ${activePhotoIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                {/* Photo Caption Overlay */}
                {card.images[activePhotoIndex]?.caption && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-between">
                    <span>✨ {card.images[activePhotoIndex].caption}</span>
                    <span className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                      {activePhotoIndex + 1} / {card.images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Multiple Photo Thumbnails / Dot Indicators */}
              {card.images.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {card.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        activePhotoIndex === idx
                          ? "w-8 bg-pink-500 shadow-md shadow-pink-500/50"
                          : "w-2.5 bg-slate-700 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. BEAUTIFULLY FORMATTED CUSTOM MESSAGE BOX */}
        <div className="mb-12 relative max-w-2xl mx-auto">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">A Special Wish For You</h3>
                <p className="text-xs text-slate-400">From {card.senderName}</p>
              </div>
            </div>

            <blockquote className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed italic border-l-4 border-pink-500 pl-4 my-4">
              "{card.message}"
            </blockquote>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-pink-300 font-bold">
                <Sparkles className="w-4 h-4" /> Customized Wish
              </span>
              <span>{new Date(card.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* 4. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWING */}
        {card.interactiveOptions?.cake !== false && (
          <div className="mb-12 max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
              🎂 Make a Wish & Blow out the Candles!
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {candlesBlown ? "✨ Wish made! The candles are blown out! 🎉" : "Tap the candles to blow them out!"}
            </p>

            {/* Cake Graphic */}
            <div
              onClick={handleBlowCandles}
              className="relative cursor-pointer group py-4 transition-transform duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
            >
              {/* Candles Row */}
              <div className="flex items-end justify-center gap-5 mb-1 z-10">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="flex flex-col items-center">
                    {/* Candle Flame */}
                    {!candlesBlown ? (
                      <div className="animate-bounce" style={{ animationDuration: `${0.8 + num * 0.2}s` }}>
                        <Flame className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                      </div>
                    ) : (
                      <div className="w-2 h-4 bg-slate-400/50 rounded-full blur-[1px] animate-pulse" />
                    )}
                    {/* Candle Stick */}
                    <div className="w-2.5 h-10 bg-gradient-to-b from-pink-300 to-purple-400 rounded-t-sm border border-white/20 shadow-sm" />
                  </div>
                ))}
              </div>

              {/* Cake Top Tier */}
              <div className="w-48 h-12 bg-gradient-to-r from-pink-500 via-pink-400 to-purple-500 rounded-t-2xl border-b-4 border-pink-600 flex items-center justify-around px-4 shadow-md">
                <span className="text-xs">🍓</span>
                <span className="text-xs">🍓</span>
                <span className="text-xs">🍓</span>
              </div>
              {/* Cake Base Tier */}
              <div className="w-56 h-16 bg-gradient-to-r from-purple-800 via-pink-700 to-indigo-900 rounded-b-2xl border-t-2 border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-xs font-black tracking-widest text-pink-200 uppercase">
                  HAPPY {card.occasion || "BIRTHDAY"}
                </span>
              </div>
            </div>

            <button
              onClick={handleBlowCandles}
              className={`mt-4 w-full py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                candlesBlown
                  ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                  : "bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-slate-950 shadow-lg shadow-amber-500/20"
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>{candlesBlown ? "Candles Extinguished! 🎊" : "Click to Blow Out Candles"}</span>
            </button>
          </div>
        )}

        {/* 5. SURPRISE GIFT BOX */}
        {card.interactiveOptions?.giftBox !== false && (
          <div className="mb-12 max-w-md mx-auto bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
              🎁 Unbox Your Secret Surprise
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {giftOpened ? "Surprise revealed below!" : "Click the gift box to open your surprise!"}
            </p>

            {!giftOpened ? (
              <div
                onClick={handleOpenGift}
                className="cursor-pointer group py-6 transition-transform hover:scale-110 active:scale-95 flex flex-col items-center"
              >
                <div className="relative">
                  <Gift className="w-24 h-24 text-pink-500 animate-bounce group-hover:text-pink-400 transition-colors drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]" />
                  <span className="absolute top-0 right-0 bg-yellow-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full shadow-md animate-pulse">
                    OPEN ME
                  </span>
                </div>
                <span className="mt-3 text-xs font-bold text-pink-300 group-hover:underline">
                  Tap to Unbox Gift 🎀
                </span>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-pink-950/60 to-purple-950/60 border border-pink-500/40 p-5 rounded-2xl text-left animate-fadeIn">
                <div className="flex items-center gap-2 text-pink-300 text-xs font-bold mb-2">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <span>Secret Gift Note</span>
                </div>
                <p className="text-sm text-slate-200 font-medium leading-relaxed">
                  {card.secretMessage || "🎁 Surprise! You deserve all the joy, love, and success in the world today and always!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 6. RECIPIENT REACTION & REPLY BOX */}
        <div className="max-w-md mx-auto bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
            💌 Send a Reaction or Reply
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Let {card.senderName} know how much this celebration meant to you!
          </p>

          {reactionSubmitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-center text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Reaction sent to {card.senderName}! 🎉</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitReaction} className="space-y-4">
              <div className="flex items-center justify-around bg-slate-950 p-2 rounded-2xl border border-white/5">
                {["💖", "🎂", "🥳", "😭", "🚀", "👑"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-2 rounded-xl transition-all cursor-pointer ${
                      selectedEmoji === emoji
                        ? "bg-pink-500/20 border border-pink-500 scale-110"
                        : "hover:bg-white/5 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Your Name (e.g. Bisma)"
                  value={reactionSender}
                  onChange={(e) => setReactionSender(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 mb-2"
                />
                <textarea
                  rows={2}
                  placeholder="Write a sweet thank-you note..."
                  value={reactionText}
                  onChange={(e) => setReactionText(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Reaction {selectedEmoji}</span>
              </button>
            </form>
          )}

          {/* Previous Reactions List */}
          {card.reactions && card.reactions.length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Reactions ({card.reactions.length})
              </span>
              {card.reactions.map((r, i) => (
                <div key={i} className="bg-slate-950/60 p-3 rounded-xl border border-white/5 text-xs flex items-start gap-2.5">
                  <span className="text-lg">{r.emoji}</span>
                  <div>
                    <span className="font-bold text-pink-300">{r.from || "Recipient"}</span>
                    {r.text && <p className="text-slate-300 mt-0.5">{r.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
