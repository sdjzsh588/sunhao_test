// Generates per-scene Chinese narration MP3s with the MiniMax T2A API.
// MiniMax has native, natural Mandarin voices.
//
// Auth differs from ElevenLabs: it needs BOTH an API key (Bearer) and a GroupId.
// Allow `api.minimax.io` in the environment's network policy, then:
//
//   export MINIMAX_API_KEY=...
//   export MINIMAX_GROUP_ID=...
//   # optional voice (see your console > Voices), default is a Mandarin female:
//   # export MINIMAX_VOICE_ID="Chinese (Mandarin)_Warm_Bestie"
//
//   node --experimental-strip-types generate-voiceover-minimax.ts
//   npx remotion render LHopital out/lhopital.mp4
//
// Output: public/voiceover/lhopital/<id>.mp3 (the pipeline prefers mp3 over wav).
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { VOICEOVER, voiceoverPath } from "./src/voiceover/script.ts";

const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const VOICE_ID =
  process.env.MINIMAX_VOICE_ID ?? "Chinese (Mandarin)_Warm_Bestie";
const MODEL = process.env.MINIMAX_TTS_MODEL ?? "speech-2.8-hd";
const BASE = process.env.MINIMAX_BASE ?? "https://api.minimaxi.com";

if (!API_KEY || !GROUP_ID) {
  console.error("Missing MINIMAX_API_KEY and/or MINIMAX_GROUP_ID.");
  process.exit(1);
}

for (const line of VOICEOVER) {
  process.stdout.write(`Generating ${line.id}... `);

  const response = await fetch(`${BASE}/v1/t2a_v2?GroupId=${GROUP_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      text: line.tts,
      stream: false,
      language_boost: "Chinese",
      voice_setting: { voice_id: VOICE_ID, speed: 1.0, vol: 1.0, pitch: 0 },
      audio_setting: {
        sample_rate: 44100,
        bitrate: 256000,
        format: "mp3",
        channel: 1,
      },
    }),
  });

  const json = await response.json();
  if (json?.base_resp?.status_code !== 0 || !json?.data?.audio) {
    console.error(`\nFailed: ${JSON.stringify(json?.base_resp ?? json)}`);
    process.exit(1);
  }

  // MiniMax returns the audio as a hex-encoded string.
  const audio = Buffer.from(json.data.audio, "hex");
  const out = `public/${voiceoverPath(line.id, "mp3")}`;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, audio);
  console.log(`saved ${out} (${(audio.length / 1024).toFixed(0)} KB)`);
}

console.log("\nDone. Render with: npx remotion render LHopital out/lhopital.mp4");
