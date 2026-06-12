// Generates illustrations with the MiniMax text-to-image API (image-01) and
// saves them to public/images/<name>.{png,jpg}. Used for ink-wash 野史
// backdrops / figures that scenes composite with <Img> + Ken Burns motion.
//
//   export MINIMAX_API_KEY=...  MINIMAX_GROUP_ID=...
//   node --experimental-strip-types generate-image-minimax.ts
//
// Requests base64 so we don't depend on the image CDN host being allow-listed;
// falls back to fetching the returned URL if only URLs come back.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

const API_KEY = process.env.MINIMAX_API_KEY;
const GROUP_ID = process.env.MINIMAX_GROUP_ID;
const MODEL = process.env.MINIMAX_IMAGE_MODEL ?? "image-01";
const BASE = process.env.MINIMAX_BASE ?? "https://api.minimaxi.com";

if (!API_KEY || !GROUP_ID) {
  console.error("Missing MINIMAX_API_KEY and/or MINIMAX_GROUP_ID.");
  process.exit(1);
}

const STYLE =
  "Traditional Chinese ink-wash painting (水墨), monochrome black ink on warm " +
  "rice paper, loose expressive brushwork, lots of negative space, misty, " +
  "elegant and atmospheric, no text, no signature, no border.";

// name -> prompt. Cinematic 16:9 ink-wash plates for the 空城计 story, one per
// scene. Existing files are skipped so good plates are kept across runs.
const IMAGES: { name: string; prompt: string; aspect?: string }[] = [
  {
    name: "kongcheng-bg",
    prompt: `${STYLE} A lone ancient Chinese walled city on a plain at dusk, distant layered mountains and drifting mist, ominous calm.`,
  },
  {
    name: "crisis",
    prompt: `${STYLE} A vast army with countless banners and spears marching across a misty plain toward a distant walled city, seen from far away, ominous and overwhelming.`,
  },
  {
    name: "decision",
    prompt: `${STYLE} A lone robed strategist standing atop an empty city wall at dusk, hands clasped behind his back, contemplating, vast misty sky, much empty space.`,
  },
  {
    name: "zhuge",
    prompt: `${STYLE} Calm seated scholar in robes and a tall guan headdress playing a guqin atop a city tower, thin incense smoke rising, serene, misty city behind.`,
  },
  {
    name: "retreat",
    prompt: `${STYLE} A great army on horseback turning away and withdrawing from an open city gate, kicking up dust, banners receding, a mood of doubt and retreat.`,
  },
  {
    name: "outro",
    prompt: `${STYLE} Serene vast misty mountain landscape with one small distant walled city, calm and empty, lots of negative space, peaceful resolution.`,
  },
];

mkdirSync("public/images", { recursive: true });

for (const img of IMAGES) {
  const outPath = `public/images/${img.name}.jpg`;
  if (existsSync(outPath)) {
    console.log(`skip ${img.name} (exists)`);
    continue;
  }
  process.stdout.write(`Generating ${img.name}... `);
  const response = await fetch(
    `${BASE}/v1/image_generation?GroupId=${GROUP_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: img.prompt,
        aspect_ratio: img.aspect ?? "16:9",
        n: 1,
        prompt_optimizer: true,
        response_format: "base64",
      }),
    },
  );

  const json = await response.json();
  if (json?.base_resp?.status_code !== 0) {
    console.error(`\nFailed: ${JSON.stringify(json?.base_resp ?? json)}`);
    process.exit(1);
  }

  const b64 = json?.data?.image_base64?.[0];
  const url = json?.data?.image_urls?.[0];
  let bytes: Buffer;
  if (b64) {
    bytes = Buffer.from(b64, "base64");
  } else if (url) {
    const r = await fetch(url);
    bytes = Buffer.from(await r.arrayBuffer());
  } else {
    console.error(`\nNo image in response: ${JSON.stringify(json?.data)}`);
    process.exit(1);
  }

  const out = `public/images/${img.name}.jpg`;
  writeFileSync(out, bytes);
  console.log(`saved ${out} (${(bytes.length / 1024).toFixed(0)} KB)`);
}

console.log("\nDone.");
