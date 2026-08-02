import React, { useState, useEffect, useRef } from "react";
import { CardData } from "../../types";
import { soundFx } from "../../lib/audio";
import { fireConfettiCannon, fireFireworks } from "../../lib/confetti";
import { Heart, Sparkles, Flame, Volume2, VolumeX, Send, CheckCircle2, X } from "lucide-react";

interface GlassmorphismEnvelopeCardProps {
  card: CardData;
  onSendReaction?: (emoji: string, text: string, senderName: string) => void;
  isCustomPreview?: boolean;
}

export const GlassmorphismEnvelopeCard: React.FC<GlassmorphismEnvelopeCardProps> = ({
  card,
  onSendReaction,
}) => {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [envelopeHiding, setEnvelopeHiding] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [surpriseModalOpen, setSurpriseModalOpen] = useState(false);

  // Reaction State
  const [selectedEmoji, setSelectedEmoji] = useState("💖");
  const [reactionText, setReactionText] = useState("");
  const [reactionSender, setReactionSender] = useState("");
  const [reactionSubmitted, setReactionSubmitted] = useState(false);

  // Canvas Refs
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fireworksCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Confetti particles state
  const confettiParticlesRef = useRef<any[]>([]);
  const fireworksParticlesRef = useRef<any[]>([]);

  // 1. Envelope Click Handler
  const handleOpenEnvelope = () => {
    if (envelopeOpened) return;
    setEnvelopeOpened(true);

    try {
      if (audioRef.current && bgMusicAvailable) {
        audioRef.current.play().catch(() => {});
        setIsPlayingMusic(true);
      } else {
        soundFx.playBirthdayTune();
        setIsPlayingMusic(true);
      }
    } catch {
      // fallback
    }

    setTimeout(() => {
      setEnvelopeHiding(true);
      triggerConfettiBurst(150);
      soundFx.playTaDa();
    }, 1200);
  };

  // 2. Typing Effect
  const messageToType = card.message || "Wishing you a day filled with love, laughter, and endless happiness. May all your dreams come true this year! ✨🎂";

  useEffect(() => {
    if (!envelopeHiding) return;
    let charIndex = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (charIndex < messageToType.length) {
        setTypedText((prev) => prev + messageToType.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [envelopeHiding, messageToType]);

  // 3. Canvas Animations (Stars, Balloons, Confetti, Fireworks)
  const [bgMusicAvailable, setBgMusicAvailable] = useState(true);

  useEffect(() => {
    // Check if birthday.mp3 is playable
    const audio = new Audio("birthday.mp3");
    audio.onerror = () => setBgMusicAvailable(false);
    audioRef.current = audio;
  }, []);

  const triggerConfettiBurst = (count = 100) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    for (let i = 0; i < count; i++) {
      confettiParticlesRef.current.push({
        x: width / 2,
        y: height / 2,
        size: Math.random() * 8 + 4,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        rotation: Math.random() * 360,
        rSpeed: Math.random() * 10 - 5,
        isBurst: true,
      });
    }
  };

  const createFirework = (x: number, y: number) => {
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    for (let i = 0; i < 40; i++) {
      fireworksParticlesRef.current.push({
        x,
        y,
        color,
        radius: Math.random() * 3 + 1,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 6 + 1,
        friction: 0.95,
        gravity: 0.1,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.015,
      });
    }
  };

  useEffect(() => {
    let animId: number;

    // Canvas setups
    const bgCanvas = bgCanvasRef.current;
    const confettiCanvas = confettiCanvasRef.current;
    const fireworksCanvas = fireworksCanvasRef.current;

    if (!bgCanvas || !confettiCanvas || !fireworksCanvas) return;

    const bgCtx = bgCanvas.getContext("2d");
    const cCtx = confettiCanvas.getContext("2d");
    const fCtx = fireworksCanvas.getContext("2d");

    if (!bgCtx || !cCtx || !fCtx) return;

    let width = (bgCanvas.width = confettiCanvas.width = fireworksCanvas.width = window.innerWidth);
    let height = (bgCanvas.height = confettiCanvas.height = fireworksCanvas.height = window.innerHeight);

    const handleResize = () => {
      if (!bgCanvas || !confettiCanvas || !fireworksCanvas) return;
      width = bgCanvas.width = confettiCanvas.width = fireworksCanvas.width = window.innerWidth;
      height = bgCanvas.height = confettiCanvas.height = fireworksCanvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Stars & Balloons Data
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2,
      alpha: Math.random(),
      speed: Math.random() * 0.02,
    }));

    const balloons = Array.from({ length: 15 }, () => ({
      x: Math.random() * width,
      y: height + Math.random() * 100,
      radius: 15 + Math.random() * 15,
      speed: 1 + Math.random() * 1.5,
      color: `hsl(${Math.random() * 360}, 70%, 75%)`,
      swing: Math.random() * 2,
      swingSpeed: 0.02,
    }));

    // Continuous Confetti
    if (confettiParticlesRef.current.length === 0) {
      for (let i = 0; i < 50; i++) {
        confettiParticlesRef.current.push({
          x: Math.random() * width,
          y: -20,
          size: Math.random() * 8 + 4,
          color: `hsl(${Math.random() * 360}, 80%, 60%)`,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          rSpeed: Math.random() * 10 - 5,
          isBurst: false,
        });
      }
    }

    const render = () => {
      // 1. Render Stars & Balloons
      bgCtx.clearRect(0, 0, width, height);
      stars.forEach((s) => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
        bgCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
        bgCtx.beginPath();
        bgCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        bgCtx.fill();
      });

      balloons.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(b.y * b.swingSpeed) * b.swing;
        if (b.y < -50) {
          b.x = Math.random() * width;
          b.y = height + Math.random() * 100;
        }
        bgCtx.fillStyle = b.color;
        bgCtx.beginPath();
        bgCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        bgCtx.fill();

        bgCtx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        bgCtx.beginPath();
        bgCtx.moveTo(b.x, b.y + b.radius);
        bgCtx.lineTo(b.x, b.y + b.radius + 20);
        bgCtx.stroke();
      });

      // 2. Render Confetti
      cCtx.clearRect(0, 0, width, height);
      confettiParticlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rSpeed;

        cCtx.save();
        cCtx.translate(p.x, p.y);
        cCtx.rotate((p.rotation * Math.PI) / 180);
        cCtx.fillStyle = p.color;
        cCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cCtx.restore();

        if (p.y > height + 20) {
          confettiParticlesRef.current[idx] = {
            x: Math.random() * width,
            y: -20,
            size: Math.random() * 8 + 4,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rSpeed: Math.random() * 10 - 5,
            isBurst: false,
          };
        }
      });

      // 3. Render Fireworks
      fCtx.clearRect(0, 0, width, height);
      for (let i = fireworksParticlesRef.current.length - 1; i >= 0; i--) {
        const p = fireworksParticlesRef.current[i];
        p.speed *= p.friction;
        p.x += Math.cos(p.angle) * p.speed;
        p.y += Math.sin(p.angle) * p.speed + p.gravity;
        p.alpha -= p.decay;

        fCtx.save();
        fCtx.globalAlpha = Math.max(0, p.alpha);
        fCtx.fillStyle = p.color;
        fCtx.beginPath();
        fCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        fCtx.fill();
        fCtx.restore();

        if (p.alpha <= 0) {
          fireworksParticlesRef.current.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Audio Control
  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (audioRef.current) audioRef.current.pause();
      soundFx.stopMusic();
      setIsPlayingMusic(false);
    } else {
      if (audioRef.current && bgMusicAvailable) {
        audioRef.current.play().catch(() => soundFx.playBirthdayTune());
      } else {
        soundFx.playBirthdayTune();
      }
      setIsPlayingMusic(true);
    }
  };

  // Blow Candles
  const handleBlowCandles = () => {
    soundFx.playBlowCandle();
    setCandlesBlown(true);
    triggerConfettiBurst(200);
    soundFx.playTaDa();
  };

  // Final Surprise Click
  const handleOpenFinalSurprise = () => {
    triggerConfettiBurst(250);
    fireConfettiCannon();
    fireFireworks();

    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        createFirework(
          Math.random() * window.innerWidth,
          Math.random() * (window.innerHeight * 0.5)
        );
      }, i * 250);
    }

    if (!isPlayingMusic) {
      toggleMusic();
    }

    setSurpriseModalOpen(true);
  };

  // Reaction submit
  const handleSubmitReaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSendReaction) {
      onSendReaction(selectedEmoji, reactionText, reactionSender || card.recipientName);
    }
    setReactionSubmitted(true);
    soundFx.playTaDa();
    triggerConfettiBurst(150);
  };

  // Photos List with fallbacks
  const defaultPhotos = [
    "https://i.postimg.cc/28H6nF34/IMG-1814.avif",
    "https://i.postimg.cc/pTYVrKg5/IMG-2720.avif",
    "https://i.postimg.cc/j5XKtt7s/IMG-2790.avif",
    "https://i.postimg.cc/gkcjwBz1/IMG-6820.jpg",
    "https://i.postimg.cc/WbtjcRbD/IMG-9187.avif",
    "https://i.postimg.cc/QxVsZLx7/IMG-9412.avif",
  ];

  const galleryImages = card.images && card.images.length > 0
    ? card.images.map((img, i) => ({
        url: img.url,
        caption: img.caption || `Precious Moment #${i + 1}`,
      }))
    : defaultPhotos.map((url, i) => ({
        url,
        caption: `Memory #${i + 1}`,
      }));

  const heroImage = galleryImages[0]?.url || "https://i.postimg.cc/T1WkQP0S/IMG-7302.avif";

  return (
    <div className="relative min-h-screen font-sans text-white bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-x-hidden select-none pb-28">

      {/* Embedded Custom Styles & Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Poppins:wght@300;400;600;700&display=swap');

        .envelope-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: radial-gradient(circle at center, #2d124d, #0f0c29);
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: opacity 1s ease, visibility 1s ease;
        }
        .envelope-overlay.hide {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }
        .envelope-wrapper {
          perspective: 1000px;
        }
        .envelope {
          position: relative;
          width: 280px;
          height: 180px;
          background: #ff4d6d;
          border-radius: 8px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          transition: transform 0.4s ease;
        }
        .envelope-wrapper:hover .envelope {
          transform: translateY(-5px) scale(1.03);
        }
        .envelope-back {
          position: absolute;
          inset: 0;
          background: #d90429;
          border-radius: 8px;
        }
        .envelope-paper {
          position: absolute;
          bottom: 10px;
          left: 15px;
          right: 15px;
          height: 150px;
          background: #fff;
          border-radius: 6px;
          padding: 20px 10px;
          text-align: center;
          transition: transform 0.6s ease-in-out;
          box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
          z-index: 2;
        }
        .envelope-text {
          font-family: 'Caveat', cursive;
          font-size: 1.6rem;
          color: #ff4d6d;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .tap-hint {
          display: inline-block;
          font-size: 0.75rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          animation: pulseHint 1.5s infinite;
        }
        .envelope-front {
          position: absolute;
          inset: 0;
          z-index: 3;
          border-left: 140px solid #ff758c;
          border-right: 140px solid #ff758c;
          border-bottom: 95px solid #ff4d6d;
          border-top: 85px solid transparent;
          border-radius: 0 0 8px 8px;
          pointer-events: none;
        }
        .envelope-top {
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          z-index: 4;
          border-left: 140px solid transparent;
          border-right: 140px solid transparent;
          border-top: 100px solid #ff4d6d;
          transform-origin: top;
          transition: transform 0.6s ease-in-out;
          pointer-events: none;
        }
        .heart-seal {
          position: absolute;
          top: 75px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 5;
          font-size: 2rem;
          transition: opacity 0.3s ease;
        }
        .envelope.open .envelope-top {
          transform: rotateX(180deg);
          z-index: 1;
        }
        .envelope.open .envelope-paper {
          transform: translateY(-80px);
          z-index: 4;
        }
        .envelope.open .heart-seal {
          opacity: 0;
        }
        @keyframes pulseHint {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes floatProfile {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes rotateGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes flickerFlame {
          0% { transform: translateX(-50%) scale(1); opacity: 0.9; }
          100% { transform: translateX(-50%) scale(1.15); opacity: 1; box-shadow: 0 0 18px #ff9d00, 0 0 30px #ff0000; }
        }
        @keyframes floatBubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes popIn {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ENVELOPE ENTRY OVERLAY SCREEN */}
      <div className={`envelope-overlay ${envelopeHiding ? "hide" : ""}`} onClick={handleOpenEnvelope}>
        <div className="envelope-wrapper">
          <div className={`envelope ${envelopeOpened ? "open" : ""}`}>
            <div className="envelope-back"></div>
            <div className="envelope-paper">
              <p className="envelope-text">For {card.recipientName || "Someone Special"} ❤️</p>
              <span className="tap-hint">Click to Open</span>
            </div>
            <div className="envelope-front"></div>
            <div className="envelope-top"></div>
            <div className="heart-seal">❤️</div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN ANIMATED CANVAS BACKGROUNDS */}
      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-[1]" />
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-[99]" />
      <canvas ref={fireworksCanvasRef} className="fixed inset-0 pointer-events-none z-[100]" />

      {/* AUDIO CONTROL BUTTON */}
      <div className="fixed top-5 right-5 z-[101]">
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] text-white font-semibold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer backdrop-blur-md border border-white/20"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
          <span>{isPlayingMusic ? "Pause Music 🎵" : "Play Music 🎵"}</span>
        </button>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 space-y-16">

        {/* 1. HERO SECTION */}
        <section className="min-h-[85vh] flex items-center justify-center pt-8">
          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden">
            
            {/* Profile Avatar */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <img
                src={heroImage}
                alt={card.recipientName}
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-[0_8px_25px_rgba(255,117,140,0.5)] relative z-10"
                style={{ animation: "floatProfile 3s infinite ease-in-out" }}
              />
              <div
                className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#ff758c] via-[#ff7eb3] to-[#7b2cbf] filter blur-md opacity-80"
                style={{ animation: "rotateGlow 4s linear infinite" }}
              />
            </div>

            {/* Badge */}
            <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-pink-200 mb-3 border border-white/10">
              {card.occasion || "Special Day 🎉"}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
              Happy Birthday,{" "}
              <span className="bg-gradient-to-r from-[#ff9a9e] via-[#fecfef] to-[#a1c4fd] bg-clip-text text-transparent">
                {card.recipientName || "Bisma"}
              </span>
              !
            </h1>

            {/* Animated Cake */}
            <div className="my-8 flex justify-center cursor-pointer group" onClick={handleBlowCandles} title="Click candle to blow!">
              <div className="relative w-40 h-32">
                {/* Candle */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-7 bg-gradient-to-b from-[#f7d070] to-[#f5a623] rounded-sm z-20">
                  {!candlesBlown && (
                    <div
                      className="absolute -top-4 left-1/2 -translate-x-1/2 w-3.5 h-5 bg-[#ff9d00] rounded-t-full rounded-b-md shadow-[0_0_12px_#ff9d00,0_0_24px_#ff0000]"
                      style={{ animation: "flickerFlame 0.6s infinite alternate" }}
                    />
                  )}
                </div>
                {/* Cake Layers */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-24 h-7 bg-white rounded-t-lg z-10 border-b border-pink-200 shadow-sm" />
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#ffb6c1] rounded-t-lg z-0 border-b border-pink-300" />
                <div className="absolute bottom-0 left-0 w-full h-9 bg-[#ff758c] rounded-t-xl" />
              </div>
            </div>

            {/* Blow Candle Button */}
            <div className="mb-6">
              <button
                onClick={handleBlowCandles}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-500/30 hover:bg-pink-500/50 border border-pink-300/40 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Flame className={`w-4 h-4 ${candlesBlown ? "text-gray-400" : "text-amber-400 fill-amber-400 animate-pulse"}`} />
                <span>{candlesBlown ? "Candles Blown! 🎉 Wishes Granted!" : "Click Candle to Make a Wish!"}</span>
              </button>
            </div>

            {/* Typing Message Box */}
            <div className="min-h-[60px] bg-black/20 border border-white/10 rounded-2xl p-4 sm:p-6 text-sm sm:text-lg text-pink-100 italic max-w-2xl mx-auto shadow-inner">
              <p>"{typedText}"<span className="inline-block w-0.5 h-4 ml-1 bg-pink-400 animate-pulse" /></p>
              <p className="text-right text-xs text-pink-300 not-italic font-bold mt-2">— With all my love, {card.senderName || "Your Besties"}</p>
            </div>

          </div>
        </section>

        {/* 2. PHOTO MEMORY SECTION */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
              ✨ Precious Memories
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">Click any memory to view full size</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                onClick={() => setSelectedPhoto(img.url)}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl cursor-pointer hover:-translate-y-2 hover:border-[#ff758c] transition-all duration-300"
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-sm font-semibold text-white drop-shadow">{img.caption}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. FUNNY SQUABBLES SECTION */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow-md">
              🛋️ The Daily Squabbles
            </h2>
            <p className="text-xs text-purple-200">Every friendship has its cute little arguments!</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-10 relative min-h-[360px] flex flex-col justify-between items-center overflow-hidden shadow-2xl">
            
            {/* Speech Bubbles */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
              <div
                className="bg-white text-gray-800 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold shadow-xl max-w-xs text-center border-2 border-pink-300 relative"
                style={{ animation: "floatBubble 2.5s infinite ease-in-out" }}
              >
                where you are busy from 2 day no mseg 😡
              </div>

              <div
                className="bg-white text-gray-800 p-3 sm:p-4 rounded-2xl text-xs sm:text-sm font-bold shadow-xl max-w-xs text-center border-2 border-purple-300 relative"
                style={{ animation: "floatBubble 2.5s infinite ease-in-out 1.2s" }}
              >
                I was busy making this surprise for you! 😭🎁
              </div>
            </div>

            {/* Cartoon Fight Image */}
            <div className="max-w-xs w-full mt-6 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 p-2">
              <img
                src="https://i.postimg.cc/KvRvNhtH/www-beatsnoop-com-final-9Judxzlp-Fn-removebg-preview.png"
                alt="Funny Fight"
                className="w-full h-auto object-contain"
              />
            </div>

          </div>
        </section>

        {/* 4. FINAL SURPRISE SECTION */}
        <section className="text-center pt-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-14 shadow-2xl space-y-6">
            <h2
              className="text-3xl sm:text-5xl font-extrabold text-white"
              style={{ textShadow: "0 0 10px #ff758c, 0 0 20px #ff758c, 0 0 30px #ff758c" }}
            >
              Happy Birthday ❤️
            </h2>
            <p className="text-sm sm:text-lg text-purple-200 max-w-xl mx-auto">
              May your year ahead be as bright, happy, and fabulous as your smile!
            </p>
            <div>
              <button
                onClick={handleOpenFinalSurprise}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#ff758c] via-[#ff7eb3] to-[#7b2cbf] text-white font-bold text-sm sm:text-base shadow-[0_4px_25px_rgba(255,117,140,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-white/30"
              >
                ✨ Click to Open Final Surprise! ✨
              </button>
            </div>
          </div>
        </section>

        {/* 5. REACTION FEEDBACK SECTION */}
        <section className="max-w-xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-pink-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Send Love Back to {card.senderName || "Sender"}</span>
          </div>

          {!reactionSubmitted ? (
            <form onSubmit={handleSubmitReaction} className="space-y-4">
              <div className="flex justify-center gap-2">
                {["💖", "🎉", "🎂", "🥳", "😭", "❤️"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-2 rounded-2xl transition-transform cursor-pointer ${
                      selectedEmoji === emoji ? "bg-white/30 scale-125 shadow-md" : "hover:scale-110"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Your Name"
                value={reactionSender}
                onChange={(e) => setReactionSender(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />

              <textarea
                placeholder="Write a thank you note or reaction..."
                value={reactionText}
                onChange={(e) => setReactionText(e.target.value)}
                rows={2}
                className="w-full bg-black/20 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 resize-none"
              />

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Reaction</span>
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 flex items-center justify-center gap-2 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Reaction sent! Thank you for sharing the love! 💖</span>
            </div>
          )}
        </section>

      </main>

      {/* LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-[1000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white hover:text-pink-400 p-2 cursor-pointer"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedPhoto}
            alt="Enlarged Memory"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
          />
        </div>
      )}

      {/* FINAL SURPRISE POPUP MODAL */}
      {surpriseModalOpen && (
        <div
          onClick={() => setSurpriseModalOpen(false)}
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white/20 border-2 border-white/40 backdrop-blur-2xl rounded-3xl p-8 text-center shadow-2xl"
            style={{ animation: "popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
          >
            <button
              onClick={() => setSurpriseModalOpen(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-4 my-4">
              <div className="inline-flex p-3 rounded-full bg-pink-500/30 text-pink-300">
                <Heart className="w-8 h-8 fill-pink-400 animate-pulse" />
              </div>

              <h3 className="text-xl font-bold text-pink-200 uppercase tracking-widest">
                Secret Gift Note
              </h3>

              <div className="p-4 rounded-2xl bg-black/30 border border-pink-400/30 text-2xl font-bold text-white shadow-inner">
                {card.secretMessage || "Boni, 5 footiya 🤪❤️"}
              </div>

              <p className="text-xs text-purple-200 italic">
                {card.secretMessage
                  ? "A special message sent straight from the heart!"
                  : "You are genuinely loved and appreciated more than words can express! Never stop shining bright!"}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
