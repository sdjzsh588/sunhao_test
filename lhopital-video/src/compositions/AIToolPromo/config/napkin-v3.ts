import type { AIToolConfigV3 } from "./types";

// Napkin v3 — 4-step tutorial driven by Napkin's official "how it works" assets
// (1.jpg + 2/3/4.gif). 45s, 7 beats: hook, tool name, 4 steps, compare+CTA.
export const napkinV3: AIToolConfigV3 = {
  slug: "napkin",
  script: {
    hook: "文章写完了\n配图还要做半天？",
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
    { id: "01-hook", tts: "文章写完了，配图还要做半天？" },
    { id: "02-tool", tts: "这个工具叫 Napkin，能把你的文字，秒变专业信息图。" },
    { id: "03-step1", tts: "第一步，不用写提示词，直接把你的文字变成图。" },
    { id: "04-step2", tts: "第二步，它会根据内容，生成好几版最贴切的配图，你挑一张最满意的就行。" },
    { id: "05-step3", tts: "第三步，样式不固定，颜色、品牌风格、每个元素，都能随手改成你要的样子。" },
    { id: "06-step4", tts: "第四步，做好的图哪儿都能用，导出 P P T、P N G、P D F、S V G，内容质感立刻拉满。" },
    { id: "07-compare", tts: "以前做一张配图要半小时，现在三十秒搞定。" },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/napkin/bgm.mp3",
  mediaReady: true,
};
