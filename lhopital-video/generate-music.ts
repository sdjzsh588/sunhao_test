// Generates a background-music bed with the ElevenLabs Music API (Eleven Music).
// Both narration (generate-voiceover.ts) and music use the SAME host and key:
//   host: api.elevenlabs.io   key: ELEVENLABS_API_KEY
//
// Requires the environment's network policy to allow `api.elevenlabs.io`.
//
//   export ELEVENLABS_API_KEY=sk_...
//   node --experimental-strip-types generate-music.ts
//   npx remotion render LHopital out/lhopital.mp4
//
// Output: public/bgm.mp3 — the composition prefers it over the synthesized
// public/bgm.wav when present. The track is looped in the video, so a short
// (~60s) bed is enough.
import { mkdirSync, writeFileSync } from "node:fs";

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY environment variable.");
  process.exit(1);
}

const PROMPT =
  "Calm, minimal lo-fi ambient background music for an educational math " +
  "explainer video. Soft felt piano and warm synth pads, gentle and " +
  "unobtrusive, relaxed steady mood, light or no percussion, absolutely no " +
  "vocals. Designed to sit quietly under a spoken narration.";

const LENGTH_MS = 60000; // 60s loopable bed (Eleven Music allows 3s–600s)

const response = await fetch(
  "https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128",
  {
    method: "POST",
    headers: {
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({ prompt: PROMPT, music_length_ms: LENGTH_MS }),
  },
);

if (!response.ok) {
  console.error(`Failed (${response.status}): ${await response.text()}`);
  process.exit(1);
}

const audio = Buffer.from(await response.arrayBuffer());
mkdirSync("public", { recursive: true });
writeFileSync("public/bgm.mp3", audio);
console.log(`saved public/bgm.mp3 (${(audio.length / 1024).toFixed(0)} KB)`);
console.log("\nDone. Render with: npx remotion render LHopital out/lhopital.mp4");
