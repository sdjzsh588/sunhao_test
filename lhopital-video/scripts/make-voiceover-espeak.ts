// Generates per-scene Chinese narration WAVs with the offline espeak-ng engine.
// Works fully inside the sandbox (no network, no API key, no ffmpeg).
//
//   node --experimental-strip-types scripts/make-voiceover-espeak.ts
//
// Requires the `espeak-ng` binary (apt-get install espeak-ng). Output:
// public/voiceover/lhopital/<id>.wav — then render normally:
//
//   npx remotion render LHopital out/lhopital.mp4
//
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { VOICEOVER, voiceoverPath } from "../src/voiceover/script.ts";

const VOICE = "cmn"; // Mandarin Chinese
const WPM = "260"; // words/min — espeak Mandarin is slow, so push the pace up
const PITCH = "45"; // 0-99, slightly lower for a calmer tone

for (const line of VOICEOVER) {
  const outPath = `public/${voiceoverPath(line.id, "wav")}`;
  mkdirSync(dirname(outPath), { recursive: true });
  execFileSync("espeak-ng", [
    "-v", VOICE,
    "-s", WPM,
    "-p", PITCH,
    "-w", outPath,
    line.tts,
  ]);
  console.log(`saved ${outPath}`);
}

console.log("\nDone. Render with: npx remotion render LHopital out/lhopital.mp4");
