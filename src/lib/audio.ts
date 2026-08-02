// Web Audio API Synthesizer for instant sound effects & melodies

class SoundFX {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private isMusicPlaying = false;
  private currentTrackTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Paper rustle / envelope opening sound
  playEnvelopeOpen() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.5));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Pop sound effect for balloons
  playPop() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      // Audio context error ignore
    }
  }

  // Candle blowing out sound (soft wind / woosh)
  playBlowCandle() {
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  // Cheerful Chime / Ta-Da sound for unboxing gifts or celebration
  playTaDa() {
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.5);
        } catch (e) {}
      }, idx * 100);
    });
  }

  // Play Happy Birthday tune synthesized
  playBirthdayTune(onLoop = true): () => void {
    this.initCtx();
    if (!this.ctx) return () => {};

    this.stopMusic();
    this.isMusicPlaying = true;

    // Happy Birthday notes: [freq, durationInSeconds]
    const melody: [number, number][] = [
      [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [349.23, 0.6], [329.63, 1.0], // Happy Birthday to you
      [261.63, 0.3], [261.63, 0.3], [293.66, 0.6], [261.63, 0.6], [392.00, 0.6], [349.23, 1.0], // Happy Birthday to you
      [261.63, 0.3], [261.63, 0.3], [523.25, 0.6], [440.00, 0.6], [349.23, 0.6], [329.63, 0.6], [293.66, 0.8], // Happy Birthday dear friend
      [466.16, 0.3], [466.16, 0.3], [440.00, 0.6], [349.23, 0.6], [392.00, 0.6], [349.23, 1.2]  // Happy Birthday to you
    ];

    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isMusicPlaying || !this.ctx) return;

      const [freq, dur] = melody[noteIndex];
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + dur);
      } catch (e) {}

      noteIndex = (noteIndex + 1) % melody.length;

      if (noteIndex === 0 && !onLoop) {
        this.isMusicPlaying = false;
        return;
      }

      const nextDelay = dur * 1000 + 80;
      this.currentTrackTimer = window.setTimeout(playNextNote, nextDelay);
    };

    playNextNote();

    return () => this.stopMusic();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.currentTrackTimer !== null) {
      clearTimeout(this.currentTrackTimer);
      this.currentTrackTimer = null;
    }
  }

  getIsPlaying() {
    return this.isMusicPlaying;
  }
}

export const soundFx = new SoundFX();
