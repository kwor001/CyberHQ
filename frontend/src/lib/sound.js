// Web Audio API sound engine — zero external assets, fully offline.
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.55;
      this.master.connect(this.ctx.destination);
    } catch (e) {
      this.ctx = null;
    }
  }

  resume() {
    try {
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) {
      /* ignore */
    }
  }

  setMuted(m) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.55;
  }

  _tone({ freq = 440, start = 0, dur = 0.15, type = 'sine', gain = 0.3, sweepTo = null }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (sweepTo) osc.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  _noise({ start = 0, dur = 0.25, gain = 0.25, filter = 1200 }) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const frames = Math.floor(this.ctx.sampleRate * dur);
    const buf = this.ctx.createBuffer(1, frames, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = filter;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.master);
    src.start(t0);
    src.stop(t0 + dur);
  }

  play(name) {
    this.init();
    this.resume();
    if (!this.ctx) return;
    switch (name) {
      case 'click':
        this._tone({ freq: 660, dur: 0.08, type: 'triangle', gain: 0.25 });
        this._tone({ freq: 990, start: 0.03, dur: 0.07, type: 'sine', gain: 0.18 });
        break;
      case 'blip':
        this._tone({ freq: 1200, dur: 0.06, type: 'sine', gain: 0.2 });
        break;
      case 'type':
        this._tone({ freq: 300 + Math.random() * 120, dur: 0.03, type: 'square', gain: 0.08 });
        break;
      case 'hover':
        this._tone({ freq: 520, dur: 0.05, type: 'sine', gain: 0.1 });
        break;
      case 'alarm':
        for (let i = 0; i < 3; i++) {
          this._tone({ freq: 740, start: i * 0.34, dur: 0.16, type: 'square', gain: 0.28 });
          this._tone({ freq: 500, start: i * 0.34 + 0.17, dur: 0.16, type: 'square', gain: 0.28 });
        }
        break;
      case 'glitch':
        this._noise({ dur: 0.28, gain: 0.3, filter: 900 });
        this._tone({ freq: 900, dur: 0.25, type: 'sawtooth', gain: 0.2, sweepTo: 120 });
        break;
      case 'lock':
        this._tone({ freq: 160, dur: 0.28, type: 'sine', gain: 0.35, sweepTo: 60 });
        this._noise({ start: 0.05, dur: 0.09, gain: 0.22, filter: 2600 });
        break;
      case 'success':
        [523, 659, 784, 1046].forEach((f, i) =>
          this._tone({ freq: f, start: i * 0.09, dur: 0.22, type: 'triangle', gain: 0.28 })
        );
        break;
      case 'error':
        this._tone({ freq: 220, dur: 0.25, type: 'sawtooth', gain: 0.25, sweepTo: 110 });
        break;
      case 'powerup':
        this._tone({ freq: 300, dur: 0.35, type: 'square', gain: 0.22, sweepTo: 900 });
        break;
      case 'victory':
        [523, 659, 784, 1046, 1318, 1568].forEach((f, i) =>
          this._tone({ freq: f, start: i * 0.11, dur: 0.35, type: 'triangle', gain: 0.3 })
        );
        this._tone({ freq: 1046, start: 0.66, dur: 0.6, type: 'sine', gain: 0.25 });
        break;
      case 'whoosh':
        this._noise({ dur: 0.4, gain: 0.18, filter: 600 });
        this._tone({ freq: 200, dur: 0.4, type: 'sine', gain: 0.12, sweepTo: 700 });
        break;
      case 'scan':
        this._tone({ freq: 1500, dur: 0.05, type: 'square', gain: 0.12 });
        break;
      case 'reveal':
        this._tone({ freq: 760, dur: 0.14, type: 'sine', gain: 0.2 });
        this._tone({ freq: 1140, start: 0.06, dur: 0.12, type: 'sine', gain: 0.14 });
        break;
      case 'deny':
        this._noise({ dur: 0.5, gain: 0.28, filter: 500 });
        this._tone({ freq: 420, dur: 0.55, type: 'sawtooth', gain: 0.3, sweepTo: 70 });
        break;
      case 'block':
        this._tone({ freq: 180, dur: 0.14, type: 'square', gain: 0.3 });
        this._tone({ freq: 120, start: 0.15, dur: 0.18, type: 'square', gain: 0.3 });
        break;
      case 'boom':
        this._noise({ dur: 0.7, gain: 0.35, filter: 220 });
        this._tone({ freq: 120, dur: 0.7, type: 'sine', gain: 0.35, sweepTo: 40 });
        break;
      default:
        break;
    }
  }
}

const sound = new SoundEngine();
export default sound;
