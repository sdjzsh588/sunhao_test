// One-off: generate EP04 (rembg) demo subjects via MiniMax image-01. Each has a
// clear foreground subject over a non-trivial background, so the cutout reads as
// impressive. People/animals are AI-generated (no real individual). We then run
// rembg to remove the background and composite onto a new one.
import { mkdirSync, writeFileSync } from "node:fs";

const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const BASE = process.env.MINIMAX_BASE ?? "https://api.minimaxi.com";
if (!API_KEY || !GROUP_ID) {
  console.error("Missing MINIMAX keys");
  process.exit(1);
}

const IMAGES = [
  {
    name: "portrait",
    prompt:
      "A young Chinese woman, head and shoulders, smiling softly, looking at " +
      "the camera, standing outdoors in a green park with blurred trees and " +
      "sunlight behind her, natural light, photorealistic, sharp detail.",
  },
  {
    name: "product",
    prompt:
      "A single clean white sneaker standing on a rustic wooden table, soft " +
      "window light, a slightly cluttered cafe background behind it, " +
      "photorealistic product photo, sharp focus on the shoe.",
  },
  {
    name: "pet",
    prompt:
      "A fluffy orange tabby cat sitting upright on a messy living-room sofa " +
      "with blankets and cushions behind it, warm indoor light, photorealistic, " +
      "sharp detail on the fur.",
  },
];

mkdirSync("public/aitool/rembg/src", { recursive: true });
for (const img of IMAGES) {
  process.stdout.write(`Generating ${img.name}... `);
  const res = await fetch(`${BASE}/v1/image_generation?GroupId=${GROUP_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "image-01",
      prompt: img.prompt,
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
  writeFileSync(`public/aitool/rembg/src/${img.name}.jpg`, bytes);
  console.log(`saved (${(bytes.length / 1024).toFixed(0)} KB)`);
}
console.log("Done.");
