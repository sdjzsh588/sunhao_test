import type { AIToolConfigV3 } from "./types";

// One prompt→poster beat of the PosterPromo composition.
export type PosterBeatSpec = { prompt: string; poster: string };

// Episode 3 — canvas-design (Anthropic skill, example-skills plugin of
// anthropics/skills). Format differs from EP01/02 by design (user feedback):
// the whole video is "type the brief → the finished poster prints up",
// four times, then a recap grid. Posters are real designs rendered the same
// way the skill works (design code → PNG); sources in mockups/canvas-design/.
export const canvasDesignV3: AIToolConfigV3 & { beats: PosterBeatSpec[] } = {
  slug: "canvas-design",
  script: {
    hook: "想发小红书、做海报\n排版丑到不想发？",
    toolName: "canvas-design",
    value: "说一句话，直接出成品海报",
    before: "套模板\n改完还是土",
    after: "一句话\n出高级成品",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  heroMedia: "aitool/canvas-design/0.png",
  heroAspect: 1800 / 480,
  beats: [
    {
      prompt: "做一张深夜读书会封面，深色烫金，高级感",
      poster: "aitool/canvas-design/posters/1.png",
    },
    {
      prompt: "音乐节海报，荧光撞色，街头感拉满",
      poster: "aitool/canvas-design/posters/2.png",
    },
    {
      prompt: "手冲咖啡店海报，奶油色，极简治愈",
      poster: "aitool/canvas-design/posters/3.png",
    },
    {
      prompt: "现代设计展海报，包豪斯，几何配色",
      poster: "aitool/canvas-design/posters/4.png",
    },
  ],
  // steps unused by PosterPromo (kept for type compatibility).
  steps: [],
  voiceover: [
    { id: "01-hook", tts: "想发小红书、做海报，排版丑到自己都不想发？" },
    {
      id: "02-tool",
      tts: "这个神器叫 canvas design，Claude 官方技能。你说一句话，它直接给你出成品海报。",
    },
    {
      id: "03-usage",
      tts: "用法超简单：在 Claude 里加上官方技能市场，一条命令装好 canvas design；然后你只管说要什么海报，剩下交给它。现场试四张。",
    },
    {
      id: "04-beat1",
      tts: "第一张：做一张深夜读书会封面，深色烫金，要高级感。",
    },
    {
      id: "05-beat2",
      tts: "第二张：音乐节海报，荧光撞色，街头感拉满。",
    },
    {
      id: "06-beat3",
      tts: "第三张，换个温柔的：手冲咖啡店海报，奶油色，极简治愈。",
    },
    {
      id: "07-beat4",
      tts: "第四张：现代设计展，包豪斯风格，几何配色。",
    },
    {
      id: "08-recap",
      tts: "四张图，四种风格，没有一张套模板。版式、配色、字体，全是它自己定的。",
    },
    { id: "09-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/napkin/bgm.mp3",
  mediaReady: true,
  seriesTag: "被低估的 AI 神器",
  episode: 3,
};
