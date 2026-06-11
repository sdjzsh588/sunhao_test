import type { AIToolConfigV3 } from "./types";

export type CutoutBeatSpec = {
  label: string;
  before: string;
  after: string;
  beforeTag: string;
  afterTag: string;
};

// Episode 4 — rembg (open-source one-command background removal, 23.3k★).
// Angle (per feedback): phone apps can cut out ONE photo — the reason to
// install rembg is BATCH + free/no-watermark + runs locally. Format: hook →
// tool card → usage → 2 single-shot before/afters → the batch wall (real
// `rembg p`, 9 images in 11s on CPU) → recap (免费/无水印/本地) → CTA.
// All cutouts are REAL rembg output (u2net); sources are AI-generated.
export const rembgV4: AIToolConfigV3 & {
  beats: CutoutBeatSpec[];
  batch: { cmd: string; items: { src: string; cut: string }[] };
} = {
  slug: "rembg",
  script: {
    hook: "抠一张图，手机就行\n抠一百张呢？",
    toolName: "rembg",
    value: "一条命令，整个文件夹全抠完",
    before: "App 一张张点\n高清还要会员",
    after: "一条命令批量抠\n免费无水印",
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
  ],
  batch: {
    cmd: "rembg p 商品图/ 抠好/",
    items: [
      "portrait",
      "product",
      "pet",
      "bag",
      "dog",
      "mug",
      "plant",
      "lamp",
      "watch",
    ].map((n) => ({
      src: `aitool/rembg/batch-src/${n}.jpg`,
      cut: `aitool/rembg/batch-cut/${n}.png`,
    })),
  },
  steps: [],
  voiceover: [
    { id: "01-hook", tts: "抠一张图，手机长按就行。那要抠一百张呢？" },
    {
      id: "02-tool",
      tts: "这个神器叫 rembg，开源免费。它真正的本事，是一条命令把整个文件夹全抠完。",
    },
    {
      id: "03-usage",
      tts: "不懂技术也能装，就三步：第一步，去 python 点 org 官网下载 Python，一路点下一步装上；第二步，打开命令行——Windows 按 Win 键加 R，输入 c m d 回车，苹果电脑直接搜索终端；第三步，把屏幕上这行命令原样粘贴进去，回车，等它装完。装好之后，抠图就这一行：本地运行，照片不上传，也不用开会员。",
    },
    {
      id: "04-beat1",
      tts: "单张当然没问题：证件照换底色，连发丝都保住。",
    },
    {
      id: "05-beat2",
      tts: "电商商品图，背景一抹，白底主图就有了。",
    },
    {
      id: "06-batch",
      tts: "重点来了：换成 rembg p，一条命令，九张图十一秒全抠完。一百张？也是一条命令的事。这就是手机 App 干不了的。",
    },
    {
      id: "07-recap",
      tts: "免费、无水印、本地运行、批量随便跑——这就是装它的理由。",
    },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/rembg/bgm.mp3",
  mediaReady: true,
  seriesTag: "被低估的 AI 神器",
  episode: 4,
};
