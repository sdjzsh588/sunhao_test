import type { AIToolConfigV3 } from "./types";

// Episode 2 — Anthropic's official pptx skill (anthropics/skills, document-skills
// plugin). Assets are HTML mockups screenshotted via headless Chromium; sources
// live in mockups/pptx-skill/.
export const pptxSkillV3: AIToolConfigV3 = {
  slug: "pptx-skill",
  script: {
    hook: "明天就要交PPT\n还在一页页手搓？",
    toolName: "PPTX Skill",
    value: "一句话让 AI 做出整份 PPT",
    before: "3 小时\n排版到崩溃",
    after: "3 分钟\n整份搞定",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  heroMedia: "aitool/pptx-skill/0.png",
  heroAspect: 1800 / 480,
  steps: [
    {
      title: "装上官方 Skill",
      subtitle: "一条命令搞定",
      media: "aitool/pptx-skill/1.png",
      aspect: 2400 / 1500,
    },
    {
      title: "把材料丢给它",
      subtitle: "Word / Markdown 都行",
      media: "aitool/pptx-skill/2.png",
      aspect: 2400 / 1500,
    },
    {
      title: "说一句：做成 PPT",
      subtitle: "排版、配色、图表全自动",
      media: "aitool/pptx-skill/3.png",
      aspect: 2400 / 1500,
    },
    {
      title: "打开就能用",
      subtitle: "PowerPoint 里随便改",
      media: "aitool/pptx-skill/4.png",
      aspect: 2400 / 1500,
    },
  ],
  voiceover: [
    { id: "01-hook", tts: "明天就要交 P P T，还在一页一页手搓？" },
    {
      id: "02-tool",
      tts: "这个神器叫 P P T X Skill，Claude 官方出品，让 AI 一句话，做出整份 P P T。",
    },
    {
      id: "03-step1",
      tts: "第一步，在 Claude Code 里输入这条命令，把官方文档技能装上。",
    },
    {
      id: "04-step2",
      tts: "第二步，把你的材料丢给它，Word、Markdown，甚至一段大纲都行。",
    },
    {
      id: "05-step3",
      tts: "第三步，说一句，做成 P P T。大纲、排版、配色、图表，它全部自动搞定。",
    },
    {
      id: "06-step4",
      tts: "第四步，打开生成的文件，就是标准 P P T 格式，PowerPoint 里随便改。",
    },
    { id: "07-compare", tts: "以前排版三小时，现在三分钟，整份生成。" },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/napkin/bgm.mp3",
  mediaReady: true,
  seriesTag: "被低估的 AI 神器",
  episode: 2,
};
