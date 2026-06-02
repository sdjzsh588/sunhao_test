// Generates an instrumental background-music bed with the MiniMax Music API.
// Same host/auth as the MiniMax narration script (api.minimax.io + Bearer key
// + GroupId). `instrumental: true` produces music with no vocals.
//
//   export MINIMAX_API_KEY=...
//   export MINIMAX_GROUP_ID=...
//   node --experimental-strip-types generate-music-minimax.ts
//   npx remotion render LHopital out/lhopital.mp4
//
// Output: public/bgm.mp3 — the composition prefers it over the synthesized
// public/bgm.wav. The track is looped in the video, so a short bed is enough.
import { mkdirSync, writeFileSync } from "node:fs";

const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const MODEL = process.env.MINIMAX_MUSIC_MODEL ?? "music-2.6";
const BASE = process.env.MINIMAX_BASE ?? "https://api.minimax.io";

if (!API_KEY || !GROUP_ID) {
  console.error("Missing MINIMAX_API_KEY and/or MINIMAX_GROUP_ID.");
  process.exit(1);
}

const PROMPT =
  "Calm, minimal lo-fi ambient instrumental for an educational explainer " +
  "video. Soft piano and warm pads, gentle and unobtrusive, relaxed steady " +
  "mood, light percussion, no vocals. Sits quietly under a spoken narration.";

// On music-2.6 the flag is `is_instrumental` (not `instrumental`). With it set,
// the API produces a vocal-free bed and the `lyrics` field is not required.
const response = await fetch(`${BASE}/v1/music_generation?GroupId=${GROUP_ID}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: MODEL,
    prompt: PROMPT,
    is_instrumental: true, // no vocals (supported on music-2.6)
    audio_setting: { sample_rate: 44100, bitrate: 256000, format: "mp3" },
    output_format: "hex", // return audio as a hex string (decoded below)
  }),
});

const json = await response.json();
if (json?.base_resp?.status_code !== 0 || !json?.data?.audio) {
  console.error(`Failed: ${JSON.stringify(json?.base_resp ?? json)}`);
  process.exit(1);
}

const audio = Buffer.from(json.data.audio, "hex");
mkdirSync("public", { recursive: true });
writeFileSync("public/bgm.mp3", audio);
console.log(`saved public/bgm.mp3 (${(audio.length / 1024).toFixed(0)} KB)`);
console.log("\nDone. Render with: npx remotion render LHopital out/lhopital.mp4");
