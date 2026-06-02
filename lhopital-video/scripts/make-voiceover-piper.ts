// Generates per-scene Chinese narration WAVs with Piper, a fast offline neural
// TTS. Much more natural than espeak-ng and runs fully on CPU (no network at
// generation time, no API key, no ffmpeg).
//
// One-time setup:
//
//   pip3 install piper-tts
//   # Mandarin voice (zh_CN huayan), hosted on a GitHub release (not HuggingFace):
//   curl -L -o /tmp/piper-zh.tar.bz2 \
//     https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-zh_CN-huayan-medium.tar.bz2
//   mkdir -p models && tar xjf /tmp/piper-zh.tar.bz2 -C /tmp \
//     && cp /tmp/vits-piper-zh_CN-huayan-medium/zh_CN-huayan-medium.onnx* models/
//
// Then:
//
//   node --experimental-strip-types scripts/make-voiceover-piper.ts
//   npx remotion render LHopital out/lhopital.mp4
//
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { VOICEOVER, voiceoverPath } from "../src/voiceover/script.ts";

const MODEL = process.env.PIPER_MODEL ?? "models/zh_CN-huayan-medium.onnx";

if (!existsSync(MODEL)) {
  console.error(`Piper model not found at: ${MODEL}`);
  console.error("See the setup steps at the top of this file to download it,");
  console.error("or set PIPER_MODEL to your .onnx path.");
  process.exit(1);
}

for (const line of VOICEOVER) {
  const out = `public/${voiceoverPath(line.id, "wav")}`;
  mkdirSync(dirname(out), { recursive: true });
  execFileSync("piper", ["-m", MODEL, "-f", out], { input: line.tts });
  console.log(`saved ${out}`);
}

console.log("\nDone. Render with: npx remotion render LHopital out/lhopital.mp4");
