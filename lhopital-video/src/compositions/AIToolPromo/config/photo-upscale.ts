import type { AIToolConfigV3 } from "./types";

// Episode 3 — Real-ESRGAN (Tencent ARC, open-source image super-resolution;
// Upscayl is its no-code GUI). Steps 1+3 are chrome-less streaming terminals;
// step 2 shows the degraded "before" photo; step 4 is the real before→after
// reveal. The demo photo is AI-generated (no real person): source.jpg →
// degraded before.jpg → Real-ESRGAN x4 after.png (see /tmp/realesr/run.py).
export const photoUpscaleV3: AIToolConfigV3 = {
  slug: "photo-upscale",
  script: {
    hook: "翻出小时候的老照片\n糊到看不清脸？",
    toolName: "Real-ESRGAN",
    value: "一键让老照片重回高清",
    before: "糊成马赛克\n不敢放大",
    after: "4 倍高清\n发丝毕现",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  heroMedia: "aitool/photo-upscale/0.png",
  heroAspect: 1800 / 480,
  steps: [
    {
      title: "装上工具",
      subtitle: "免费开源 · 下载即用",
      media: "",
      aspect: 1,
      terminal: [
        { text: "从 GitHub 下载 Real-ESRGAN（35.7k★ · 全平台）", kind: "muted", pause: 16 },
        { text: "./realesrgan-ncnn-vulkan -h", kind: "cmd" },
        { text: "✓ 准备就绪 · 照片 / 动漫 / 视频 都能修", kind: "ok", pause: 14 },
        { text: "不想敲命令？图形界面 Upscayl 点开即用", kind: "muted" },
      ],
    },
    {
      title: "丢进老照片",
      subtitle: "手机翻拍、扫描件都行",
      media: "aitool/photo-upscale/before.jpg",
      aspect: 3 / 4,
    },
    {
      title: "一句话放大 4 倍",
      subtitle: "几秒钟，自动修复",
      media: "",
      aspect: 1,
      terminal: [
        {
          text: "./realesrgan-ncnn-vulkan -i 老照片.jpg -o 高清.png -n realesrgan-x4plus",
          kind: "cmd",
          pause: 22,
        },
        { text: "修复中 · 超分辨率重建 · 去噪去压缩痕迹", kind: "out", pause: 22 },
        { text: "✓ 已输出 高清.png（216×288 → 864×1152）", kind: "ok" },
      ],
    },
    {
      title: "见证奇迹",
      subtitle: "糊 → 高清，发丝毕现",
      media: "",
      aspect: 3 / 4,
      beforeAfter: {
        before: "aitool/photo-upscale/before.jpg",
        after: "aitool/photo-upscale/after.png",
      },
    },
  ],
  voiceover: [
    { id: "01-hook", tts: "翻出小时候的老照片，糊到看不清脸？" },
    {
      id: "02-tool",
      tts: "这个神器叫 Real ESRGAN，腾讯开源，一键让老照片重回高清。",
    },
    {
      id: "03-step1",
      tts: "第一步，下载这个免费开源工具，照片、动漫、视频都能修；不想敲命令，用图形界面 Upscayl 也行。",
    },
    {
      id: "04-step2",
      tts: "第二步，把老照片丢进去，手机翻拍的、扫描的，都可以。",
    },
    {
      id: "05-step3",
      tts: "第三步，一句命令，放大四倍，几秒钟自动修复，去噪、去压缩痕迹。",
    },
    {
      id: "06-step4",
      tts: "见证奇迹，原来糊成一团的脸，现在发丝都清清楚楚。",
    },
    { id: "07-compare", tts: "以前糊成马赛克不敢放大，现在四倍高清，发丝毕现。" },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/napkin/bgm.mp3",
  mediaReady: true,
  seriesTag: "被低估的 AI 神器",
  episode: 3,
};
