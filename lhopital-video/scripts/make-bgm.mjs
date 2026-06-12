// Generates a calm, loopable lo-fi background-music track as a 16-bit PCM WAV.
// Pure Node, no ffmpeg required. Output: public/bgm.wav
//
//   node scripts/make-bgm.mjs
//
// Layers: warm chord pad + soft sub bass + a gentle pentatonic melody, run
// through a small feedback delay for a sense of space.
import { writeFileSync, mkdirSync } from "node:fs";

const SR = 44100;
const CHORD_SECONDS = 4;
const BARS = 8; // 8 chords x 4s = 32s loop
const DURATION = BARS * CHORD_SECONDS;
const N = Math.floor(SR * DURATION);

// vi - IV - I - V in A minor, twice. Each: [root, third, fifth] in Hz.
const Am = [220.0, 261.63, 329.63];
const F = [174.61, 220.0, 261.63];
const C = [261.63, 329.63, 392.0];
const G = [196.0, 246.94, 293.66];
const PROG = [Am, F, C, G, Am, F, C, G];

// A pentatonic melody (A minor pentatonic: A C D E G), one note per beat.
// 0 = rest. Frequencies in a comfortable mid-high octave.
const A4 = 440, C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99;
const MELODY = [
  E5, 0, C5, D5, E5, 0, A4, C5,
  C5, 0, A4, 0, D5, E5, G5, 0,
  E5, D5, C5, 0, A4, 0, C5, D5,
  D5, 0, C5, A4, 0, E5, 0, 0,
];
const BEAT = DURATION / MELODY.length; // seconds per melody slot

const padVoice = (freq, t) => {
  const vib = 1 + 0.003 * Math.sin(2 * Math.PI * 4.5 * t);
  const f = freq * vib;
  return (
    1.0 * Math.sin(2 * Math.PI * f * t) +
    0.28 * Math.sin(2 * Math.PI * 2 * f * t) +
    0.1 * Math.sin(2 * Math.PI * 3 * f * t)
  );
};

// Soft plucked tone: quick attack, exponential decay, a little brightness.
const pluck = (freq, t) => {
  if (t < 0) return 0;
  const env = Math.exp(-t * 3.2) * (1 - Math.exp(-t * 80));
  return (
    env *
    (Math.sin(2 * Math.PI * freq * t) +
      0.25 * Math.sin(2 * Math.PI * 2 * freq * t))
  );
};

const chordEnv = (t) => {
  const a = 0.4, r = 0.8;
  if (t < a) return t / a;
  if (t > CHORD_SECONDS - r) return Math.max(0, (CHORD_SECONDS - t) / r);
  return 1;
};

const dry = new Float64Array(N);

for (let i = 0; i < N; i++) {
  const t = i / SR;
  const ci = Math.floor(t / CHORD_SECONDS) % PROG.length;
  const tIn = t - ci * CHORD_SECONDS;
  const chord = PROG[ci];
  const e = chordEnv(tIn);

  let s = 0;
  // Pad + sub bass.
  s += 0.42 * padVoice(chord[0] / 2, t);
  s += 0.34 * padVoice(chord[0], t);
  s += 0.26 * padVoice(chord[1], t);
  s += 0.22 * padVoice(chord[2], t);
  s *= e;

  // Melody pluck.
  const mi = Math.floor(t / BEAT) % MELODY.length;
  const mFreq = MELODY[mi];
  if (mFreq) s += 0.5 * pluck(mFreq, t - mi * BEAT);

  // Slow tremolo for gentle movement.
  s *= 0.9 + 0.1 * Math.sin(2 * Math.PI * 0.12 * t);
  dry[i] = s;
}

// Simple stereo feedback delay (cheap reverb / space).
const out = new Float64Array(N * 2);
const d1 = Math.floor(SR * 0.19);
const d2 = Math.floor(SR * 0.27);
for (let i = 0; i < N; i++) {
  const wet1 = i >= d1 ? dry[i - d1] * 0.3 : 0;
  const wet2 = i >= d2 ? dry[i - d2] * 0.22 : 0;
  const l = dry[i] + wet1;
  const r = dry[i] + wet2;
  out[i * 2] = l;
  out[i * 2 + 1] = r;
}

// Normalize to a healthy level (this gets mixed lower in the video anyway).
let peak = 0;
for (let i = 0; i < out.length; i++) peak = Math.max(peak, Math.abs(out[i]));
const gain = 0.9 / peak;

const fadeWin = Math.floor(SR * 0.4);
const dataSize = N * 2 * 2;
const buf = Buffer.alloc(44 + dataSize);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 2 * 2, 28);
buf.writeUInt16LE(2 * 2, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataSize, 40);

let off = 44;
for (let i = 0; i < N; i++) {
  let edge = 1;
  if (i < fadeWin) edge = i / fadeWin;
  else if (i > N - fadeWin) edge = (N - i) / fadeWin;
  const l = Math.max(-1, Math.min(1, out[i * 2] * gain * edge));
  const r = Math.max(-1, Math.min(1, out[i * 2 + 1] * gain * edge));
  buf.writeInt16LE(Math.round(l * 32767), off);
  buf.writeInt16LE(Math.round(r * 32767), off + 2);
  off += 4;
}

mkdirSync("public", { recursive: true });
writeFileSync("public/bgm.wav", buf);
console.log(`Wrote public/bgm.wav (${DURATION}s, ${(dataSize / 1e6).toFixed(1)} MB)`);
