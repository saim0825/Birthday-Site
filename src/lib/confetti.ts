import confetti from "canvas-confetti";

export function fireConfettiCannon() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#ec4899", "#8b5cf6", "#3b82f6"],
  });
  fire(0.2, {
    spread: 60,
    colors: ["#f59e0b", "#10b981", "#ef4444"],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function fireFireworks() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#ff007f", "#00f0ff", "#ffdd00", "#7928ca"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#ec4899", "#a855f7", "#3b82f6", "#10b981"],
    });
  }, 250);
}

export function fireBalloonPopBurst(x: number, y: number) {
  confetti({
    particleCount: 35,
    spread: 70,
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
    colors: ["#ec4899", "#8b5cf6", "#f59e0b", "#3b82f6", "#10b981"],
    scalar: 0.9,
  });
}
