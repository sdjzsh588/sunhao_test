// Generates per-scene narration MP3s with ElevenLabs TTS.
//
// Run this in an environment that has network access to api.elevenlabs.io
// (the Claude Code web sandbox blocks it). Requires:
//
//   export ELEVENLABS_API_KEY=sk_...
//   # optional: pick a multilingual voice id (defaults to "Rachel")
//   export ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
//
//   node --strip-types generate-voiceover.ts
//
// Output: public/voiceover/lhopital/<id>.mp3 — then just re-render:
//
//   npx remotion render LHopital out/lhopital.mp4
//
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { VOICEOVER, voiceoverFile } from "./src/voiceover/script.ts";

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "21m00Tcm4TlvDq8ikWAM";

if (!API_KEY) {
  console.error("Missing ELEVENLABS_API_KEY environment variable.");
  process.exit(1);
}

for (const line of VOICEOVER) {
  process.stdout.write(`Generating ${line.id}... `);

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: line.text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.2,
        },
      }),
    },
  );

  if (!response.ok) {
    console.error(`\nFailed (${response.status}): ${await response.text()}`);
    process.exit(1);
  }

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  const outPath = `public/${voiceoverFile(line.id)}`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, audioBuffer);
  console.log(`saved ${outPath} (${(audioBuffer.length / 1024).toFixed(0)} KB)`);
}

console.log("\nDone. Re-render with: npx remotion render LHopital out/lhopital.mp4");
