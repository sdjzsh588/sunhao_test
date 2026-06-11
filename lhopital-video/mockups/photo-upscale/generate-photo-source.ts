// One-off: generate a nostalgic "old photo" style image via MiniMax image-01,
// used as the EP03 (Real-ESRGAN) demo subject. The person is AI-generated
// (no real individual). We then degrade this into the "before" and run
// Real-ESRGAN to produce the "after".
import { mkdirSync, writeFileSync } from "node:fs";

const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const BASE = process.env.MINIMAX_BASE ?? "https://api.minimaxi.com";
if (!API_KEY || !GROUP_ID) {
  console.error("Missing MINIMAX keys");
  process.exit(1);
}

const prompt =
  "A warm nostalgic vintage family photograph from the 1980s: a kind smiling " +
  "elderly Chinese grandmother sitting in front of an old brick house, soft " +
  "natural light, gentle film grain, slightly faded warm tones, photorealistic, " +
  "sharp detailed face and hair, high quality, no text, no watermark.";

mkdirSync("public/aitool/photo-upscale", { recursive: true });

const res = await fetch(`${BASE}/v1/image_generation?GroupId=${GROUP_ID}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "image-01",
    prompt,
    aspect_ratio: "3:4",
    n: 1,
    prompt_optimizer: true,
    response_format: "base64",
  }),
});
const json = await res.json();
if (json?.base_resp?.status_code !== 0) {
  console.error(`Failed: ${JSON.stringify(json?.base_resp ?? json)}`);
  process.exit(1);
}
const b64 = json?.data?.image_base64?.[0];
const url = json?.data?.image_urls?.[0];
const bytes = b64
  ? Buffer.from(b64, "base64")
  : Buffer.from(await (await fetch(url)).arrayBuffer());
const out = "public/aitool/photo-upscale/source.jpg";
writeFileSync(out, bytes);
console.log(`saved ${out} (${(bytes.length / 1024).toFixed(0)} KB)`);
