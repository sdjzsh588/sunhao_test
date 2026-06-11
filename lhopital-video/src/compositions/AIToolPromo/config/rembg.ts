import type { AIToolConfigV3 } from "./types";

export type CutoutBeatSpec = {
  label: string;
  before: string;
  after: string;
  beforeTag: string;
  afterTag: string;
};

// Episode 4 — rembg (open-source one-command background removal, 23.3k★).
// Format: hook → tool card → usage (install + one command) → 3 before/after
// cutout reveals → recap grid → CTA. The cutouts are REAL rembg output
// (u2net): src/*.jpg → cut to transparent → composited on a new bg (out/*.jpg).
// See run-rembg.py. People/pet are AI-generated (no real individual).
export const rembgV4: AIToolConfigV3 & { beats: CutoutBeatSpec[] } = {
  slug: "rembg",
  script: {
    hook: "抠个图\n还在 PS 里描半天？",
    toolName: "rembg",
    value: "一行命令，背景抠得干干净净",
    before: "手动描边\n半小时起步",
    after: "一行命令\n几秒抠好",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  heroMedia: "aitool/rembg/0.png",
  heroAspect: 1800 / 480,
  beats: [
    {
      label: "证件照换底色",
      before: "aitool/rembg/src/portrait.jpg",
      after: "aitool/rembg/out/portrait.jpg",
      beforeTag: "原图",
      afterTag: "蓝底",
    },
    {
      label: "电商商品主图",
      before: "aitool/rembg/src/product.jpg",
      after: "aitool/rembg/out/product.jpg",
      beforeTag: "原图",
      afterTag: "白底",
    },
    {
      label: "一键换背景",
      before: "aitool/rembg/src/pet.jpg",
      after: "aitool/rembg/out/pet.jpg",
      beforeTag: "原图",
      afterTag: "抠好",
    },
  ],
  steps: [],
  voiceover: [
    { id: "01-hook", tts: "抠个图，还在 PS 里描边描半天？" },
    {
      id: "02-tool",
      tts: "这个神器叫 rembg，开源免费，一行命令，把背景抠得干干净净。",
    },
    {
      id: "03-usage",
      tts: "用法巨简单：装好之后，一句 rembg i 原图 输出图，就完事了，连头发丝都给你保住。",
    },
    {
      id: "04-beat1",
      tts: "第一个用处，证件照换底色：蓝底、红底、白底，随你换。",
    },
    {
      id: "05-beat2",
      tts: "第二个，电商商品图：背景一抹，干净的白底主图就有了。",
    },
    {
      id: "06-beat3",
      tts: "第三个，一键换背景：做表情包、海报素材，都行。",
    },
    {
      id: "07-recap",
      tts: "人、物、宠物，再乱的背景，几秒钟抠干净。",
    },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/rembg/bgm.mp3",
  mediaReady: true,
  seriesTag: "被低估的 AI 神器",
  episode: 4,
};
