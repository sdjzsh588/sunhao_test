// Generates a calm, loopable ambient background-music track as a 16-bit PCM WAV.
// Pure Node, no ffmpeg required. Output: public/bgm.wav
//
//   node scripts/make-bgm.mjs
//
import { writeFileSync, mkdirSync } from "node:fs";

const SAMPLE_RATE = 44100;
const BARS = 8; // 8 chords x 4s = 32s loopable bed
const CHORD_SECONDS = 4;
const DURATION = BARS * CHORD_SECONDS;
const N = Math.floor(SAMPLE_RATE * DURATION);

// vi - IV - I - V progression in A minor, repeated twice.
// Each chord: [bass, third, fifth] in Hz.
const Am = [220.0, 261.63, 329.63];
const F = [174.61, 220.0, 261.63];
const C = [261.63, 329.63, 392.0];
const G = [196.0, 246.94, 293.66];
const PROG = [Am, F, C, G, Am, F, C, G];

// Soft attack/release envelope across a single chord (seconds-based).
const env = (t) => {
  const a = 0.5; // attack
  const r = 0.9; // release
  if (t < a) return t / a;
  if (t > CHORD_SECONDS - r) return Math.max(0, (CHORD_SECONDS - t) / r);
  return 1;
};

// A warm voice = fundamental + gentle, decaying overtones.
const voice = (freq, t) => {
  const vib = 1 + 0.0035 * Math.sin(2 * Math.PI * 5 * t); // subtle vibrato
  const f = freq * vib;
  return (
    1.0 * Math.sin(2 * Math.PI * f * t) +
    0.32 * Math.sin(2 * Math.PI * 2 * f * t) +
    0.12 * Math.sin(2 * Math.PI * 3 * f * t)
  );
};

const left = new Float64Array(N);
const right = new Float64Array(N);

for (let i = 0; i < N; i++) {
  const time = i / SAMPLE_RATE;
  const chordIdx = Math.floor(time / CHORD_SECONDS) % PROG.length;
  const tIn = time - chordIdx * CHORD_SECONDS;
  const chord = PROG[chordIdx];
  const e = env(tIn);

  // Pad: the three chord tones plus a soft sub-bass.
  let s = 0;
  s += 0.5 * voice(chord[0] / 2, time); // sub bass
  s += 0.42 * voice(chord[0], time);
  s += 0.34 * voice(chord[1], time);
  s += 0.30 * voice(chord[2], time);

  // Sparse high arpeggio shimmer (one note per second), very quiet.
  const arpNote = chord[(Math.floor(time) % 3)] * 2;
  const arpT = time - Math.floor(time);
  const arpEnv = Math.max(0, 1 - arpT * 1.6);
  s += 0.12 * arpEnv * Math.sin(2 * Math.PI * arpNote * time);

  s *= e;

  // Slow tremolo for movement.
  const trem = 0.92 + 0.08 * Math.sin(2 * Math.PI * 0.15 * time);
  s *= trem;

  // Gentle stereo width via tiny phase offset.
  left[i] = s;
  right[i] = s * 0.96 + 0.04 * voice(chord[2] * 1.005, time) * e;
}

// Normalize to peak, then leave headroom (this is a *bed*, mixed low later).
let peak = 0;
for (let i = 0; i < N; i++) {
  peak = Math.max(peak, Math.abs(left[i]), Math.abs(right[i]));
}
const gain = (0.82 / peak) * 0.8;

// Loop-friendly crossfade: fade the last 0.4s into silence-safe edge.
const fadeWin = Math.floor(SAMPLE_RATE * 0.4);

const bytesPerSample = 2;
const channels = 2;
const dataSize = N * channels * bytesPerSample;
const buf = Buffer.alloc(44 + dataSize);

buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataSize, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(channels, 22);
buf.writeUInt32LE(SAMPLE_RATE, 24);
buf.writeUInt32LE(SAMPLE_RATE * channels * bytesPerSample, 28);
buf.writeUInt16LE(channels * bytesPerSample, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(dataSize, 40);

let off = 44;
for (let i = 0; i < N; i++) {
  let edge = 1;
  if (i < fadeWin) edge = i / fadeWin;
  else if (i > N - fadeWin) edge = (N - i) / fadeWin;

  const l = Math.max(-1, Math.min(1, left[i] * gain * edge));
  const r = Math.max(-1, Math.min(1, right[i] * gain * edge));
  buf.writeInt16LE(Math.round(l * 32767), off);
  buf.writeInt16LE(Math.round(r * 32767), off + 2);
  off += 4;
}

mkdirSync("public", { recursive: true });
writeFileSync("public/bgm.wav", buf);
console.log(`Wrote public/bgm.wav (${DURATION}s, ${(dataSize / 1e6).toFixed(1)} MB)`);
