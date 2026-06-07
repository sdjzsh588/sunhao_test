// Generates per-section narration for an AIToolPromo video via MiniMax T2A.
// Pass the tool slug as an arg (default: napkin). Writes clips to
// public/aitool/<slug>/voiceover/<id>.mp3.
//
//   node --experimental-strip-types generate-voiceover-aitool-minimax.ts napkin
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { napkinV3 } from "./src/compositions/AIToolPromo/config/napkin-v3.ts";

const CONFIGS = { napkin: napkinV3 } as const;
const slug = (process.argv[2] ?? "napkin") as keyof typeof CONFIGS;
const config = CONFIGS[slug];
if (!config) {
  console.error(`Unknown tool slug: ${slug}`);
  process.exit(1);
}

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

for (const line of config.voiceover) {
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
      // Punchy short-form delivery: a touch faster than default.
      voice_setting: { voice_id: VOICE_ID, speed: 1.08, vol: 1.0, pitch: 0 },
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
  const audio = Buffer.from(json.data.audio, "hex");
  const out = `public/aitool/${slug}/voiceover/${line.id}.mp3`;
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, audio);
  console.log(`saved ${out} (${(audio.length / 1024).toFixed(0)} KB)`);
}

console.log("\nDone.");
