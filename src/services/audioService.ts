// Lightweight Web Audio API synthesizer for optional cyber UI sound feedback

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  public playBeep(freq: number = 800, duration: number = 0.05, type: OscillatorType = 'sine', gainVal: number = 0.03) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // safe fallback
    }
  }

  public playKeyClick() {
    this.playBeep(1200, 0.02, 'triangle', 0.02);
  }

  public playAlertSound() {
    this.playBeep(600, 0.08, 'sawtooth', 0.04);
    setTimeout(() => {
      this.playBeep(900, 0.12, 'sine', 0.05);
    }, 90);
  }

  public playSuccessSound() {
    this.playBeep(523.25, 0.08, 'sine', 0.03); // C5
    setTimeout(() => {
      this.playBeep(659.25, 0.12, 'sine', 0.03); // E5
    }, 80);
  }
}

export const SoundEngine = new SoundEffectsEngine();
