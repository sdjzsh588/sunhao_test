// EP04 BGM — punchier than the lo-fi napkin bed: clean, bright, modern, a bit
// more rhythmic for a snappy utility demo. Outputs to public/aitool/rembg/bgm.mp3.
import { mkdirSync, writeFileSync } from "node:fs";

const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const MODEL = process.env.MINIMAX_MUSIC_MODEL ?? "music-2.6";
const BASE = process.env.MINIMAX_BASE ?? "https://api.minimaxi.com";
if (!API_KEY || !GROUP_ID) {
  console.error("Missing MINIMAX_API_KEY and/or MINIMAX_GROUP_ID.");
  process.exit(1);
}

const PROMPT =
  "Bright, clean, modern minimal electronic instrumental for a snappy tech " +
  "tool demo. Crisp plucky synth, light four-on-the-floor groove, subtle claps, " +
  "upbeat but unobtrusive, confident and satisfying, no vocals. Sits under a " +
  "spoken narration.";

const response = await fetch(`${BASE}/v1/music_generation?GroupId=${GROUP_ID}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: MODEL,
    prompt: PROMPT,
    is_instrumental: true,
    audio_setting: { sample_rate: 44100, bitrate: 256000, format: "mp3" },
    output_format: "hex",
  }),
});
const json = await response.json();
if (json?.base_resp?.status_code !== 0 || !json?.data?.audio) {
  console.error(`Failed: ${JSON.stringify(json?.base_resp ?? json)}`);
  process.exit(1);
}
const audio = Buffer.from(json.data.audio, "hex");
mkdirSync("public/aitool/rembg", { recursive: true });
writeFileSync("public/aitool/rembg/bgm.mp3", audio);
console.log(`saved public/aitool/rembg/bgm.mp3 (${(audio.length / 1024).toFixed(0)} KB)`);
