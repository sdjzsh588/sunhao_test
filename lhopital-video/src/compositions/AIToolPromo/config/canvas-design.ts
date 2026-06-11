import type { AIToolConfigV3 } from "./types";

// Episode 3 — canvas-design (Anthropic skill, in the example-skills plugin of
// anthropics/skills). Makes museum-quality posters/covers as .png/.pdf from a
// one-line brief. Steps 1-3 are chrome-less streaming terminals; step 4 shows
// real designed posters (HTML/CSS → Chromium, the same way the skill renders
// design code to PNG). Sources in mockups/canvas-design/.
export const canvasDesignV3: AIToolConfigV3 = {
  slug: "canvas-design",
  script: {
    hook: "想发小红书、做海报\n排版丑到不想发？",
    toolName: "canvas-design",
    value: "一句话做出能用的封面海报",
    before: "套模板\n改完还是土",
    after: "一句话\n出高级成品",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  heroMedia: "aitool/canvas-design/0.png",
  heroAspect: 1800 / 480,
  steps: [
    {
      title: "装上 skill",
      subtitle: "Claude 官方 · 免费",
      media: "",
      aspect: 1,
      terminal: [
        { text: "/plugin marketplace add anthropics/skills", kind: "cmd" },
        { text: "✓ 已添加插件市场 anthropic-agent-skills", kind: "ok", pause: 16 },
        { text: "/plugin install example-skills@anthropic-agent-skills", kind: "cmd" },
        { text: "✓ 已安装 · 含 canvas-design / algorithmic-art", kind: "ok" },
      ],
    },
    {
      title: "说出你要的",
      subtitle: "一句话讲清风格",
      media: "",
      aspect: 1,
      terminal: [
        {
          text: "做一张读书分享的小红书封面，深色烫金，高级感",
          kind: "cmd",
          pause: 22,
        },
        { text: "主题 / 氛围 / 用途，讲清楚就行", kind: "muted" },
      ],
    },
    {
      title: "它自己搞设计",
      subtitle: "版式、配色、字体全自动",
      media: "",
      aspect: 1,
      terminal: [
        { text: "确立设计哲学 · 编辑式留白", kind: "out", pause: 18 },
        { text: "排版 · 配色 · 字体层级 · 视觉重心", kind: "out", pause: 18 },
        { text: "渲染导出 PNG / PDF · 可直接印刷", kind: "out", pause: 22 },
        { text: "✓ 已生成 海报.png（1080×1440）", kind: "ok" },
      ],
    },
    {
      title: "打开就能发",
      subtitle: "换个需求，风格随你变",
      media: "",
      aspect: 1080 / 1440,
      slides: [1, 2, 3, 4].map((n) => `aitool/canvas-design/posters/${n}.png`),
    },
  ],
  voiceover: [
    { id: "01-hook", tts: "想发小红书、做海报，排版丑到自己都不想发？" },
    {
      id: "02-tool",
      tts: "这个神器叫 canvas design，Claude 官方技能，一句话做出能用的封面海报。",
    },
    {
      id: "03-step1",
      tts: "第一步，装上这个官方技能，免费，一条命令搞定。",
    },
    {
      id: "04-step2",
      tts: "第二步，一句话说清你要什么，主题、氛围、用途，讲明白就行。",
    },
    {
      id: "05-step3",
      tts: "第三步，它自己定设计哲学，版式、配色、字体全部自动，直接导出能印刷的图。",
    },
    {
      id: "06-step4",
      tts: "打开就能发，换个需求，封面、海报、展览图，风格随你变。",
    },
    { id: "07-compare", tts: "以前套模板改半天还是土，现在一句话，出高级感成品。" },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/napkin/bgm.mp3",
  mediaReady: true,
  seriesTag: "被低估的 AI 神器",
  episode: 3,
};
