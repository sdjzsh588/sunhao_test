import type { AIToolConfig } from "./types";

// Napkin (napkin.ai) — text → infographic. First tool in the series; this file
// is the template every other tool copies (config/v0.ts, config/cursor.ts, ...).
export const napkinConfig: AIToolConfig = {
  slug: "napkin",
  script: {
    hook: "99% 的人不知道\n写完文章能一键出图",
    toolName: "Napkin",
    value: "把文字秒变专业信息图",
    points: [
      {
        title: "粘一段文字\nAI 自动出信息图",
        shot: "result",
        focus: "center top",
      },
      {
        title: "几十种风格\n一键切换",
        shot: "styles",
        focus: "right top",
      },
      {
        title: "导出 PNG\n公众号 / PPT / 小红书直接用",
        shot: "export",
        focus: "center top",
      },
    ],
    before: "30 分钟\n做一张配图",
    after: "30 秒\n搞定",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  voiceover: [
    { id: "01-hook", tts: "99% 的人都不知道，写完文章，居然能一键出图。" },
    { id: "02-tool", tts: "这个工具叫 Napkin，能把你的文字，秒变专业信息图。" },
    { id: "03-point1", tts: "第一，粘一段文字，AI 自动帮你生成信息图。" },
    { id: "04-point2", tts: "第二，几十种风格，一键切换。" },
    { id: "05-point3", tts: "第三，导出 P N G，公众号、P P T、小红书直接就能用。" },
    { id: "06-compare", tts: "以前做一张配图要半小时，现在三十秒搞定。" },
    { id: "07-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  screenshots: {
    homepage: "aitool/napkin/napkin-1-homepage.png",
    entry: "aitool/napkin/napkin-1.5-entry.png",
    input: "aitool/napkin/napkin-2-input.png",
    result: "aitool/napkin/napkin-4-result.png",
    styles: "aitool/napkin/napkin-5-styles.png",
    export: "aitool/napkin/napkin-6-export.png",
    usecase: "aitool/napkin/napkin-7-usecase.png",
  },
  // Real PNGs are present under public/aitool/napkin/.
  screenshotsReady: true,
  musicUrl: "aitool/napkin/bgm.mp3",
};
