import type { AIToolConfigV3 } from "./types";

// Napkin v3 — 4-step tutorial driven by Napkin's official "how it works" assets
// (1.jpg + 2/3/4.gif). 45s, 7 beats: hook, tool name, 4 steps, compare+CTA.
export const napkinV3: AIToolConfigV3 = {
  slug: "napkin",
  script: {
    hook: "99% 的人不知道\n写完文章可以一键出图",
    toolName: "Napkin",
    value: "把文字秒变专业信息图",
    before: "30 分钟\n做一张配图",
    after: "30 秒\n搞定",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  heroMedia: "aitool/napkin/0.jpg",
  heroAspect: 897 / 240,
  steps: [
    {
      title: "粘一段文字",
      subtitle: "从任何地方导入",
      media: "aitool/napkin/1.jpg",
      aspect: 2714 / 1702,
    },
    {
      title: "点 ⚡ 一键生成",
      subtitle: "AI 自动出图",
      media: "aitool/napkin/2.mp4",
      aspect: 2648 / 1706,
    },
    {
      title: "切换风格",
      subtitle: "字体、布局随你改",
      media: "aitool/napkin/3.mp4",
      aspect: 2648 / 1290,
    },
    {
      title: "多格式导出",
      subtitle: "PNG / SVG / PDF / PPT",
      media: "aitool/napkin/4.mp4",
      aspect: 2648 / 1290,
    },
  ],
  voiceover: [
    { id: "01-hook", tts: "99% 的人都不知道，写完文章，居然可以一键出图。" },
    { id: "02-tool", tts: "这个工具叫 Napkin，能把你的文字，秒变专业信息图。" },
    { id: "03-step1", tts: "第一步，粘一段文字，从任何地方都能导入。" },
    { id: "04-step2", tts: "第二步，点一下闪电，AI 自动帮你出图。" },
    { id: "05-step3", tts: "第三步，切换风格，字体和布局随你改。" },
    { id: "06-step4", tts: "第四步，导出 P N G、S V G、P D F、P P T，都能用。" },
    { id: "07-compare", tts: "以前做一张配图要半小时，现在三十秒搞定。" },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/napkin/bgm.mp3",
  mediaReady: true,
};
