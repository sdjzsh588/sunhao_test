import type { AIToolConfigV3 } from "./types";

// Episode 2 — Anthropic's official pptx skill (anthropics/skills, document-skills
// plugin). Steps 1-3 are chrome-less streaming terminals (TerminalStream); step 4
// shows the REAL deck the user generated with the skill (2026Q2季度业务总结.pptx,
// converted to public/aitool/pptx-skill/slides/*.png via LibreOffice). Only the
// hero logo card (0.png) is still a designed mockup.
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
      subtitle: "两条命令搞定",
      media: "",
      aspect: 2400 / 1500,
      terminal: [
        { text: "/plugin marketplace add anthropics/skills", kind: "cmd" },
        { text: "✓ 已添加插件市场 anthropic-agent-skills", kind: "ok", pause: 18 },
        {
          text: "/plugin install document-skills@anthropic-agent-skills",
          kind: "cmd",
        },
        {
          text: "✓ 已安装 document-skills：pptx · docx · xlsx · pdf",
          kind: "ok",
        },
      ],
    },
    {
      title: "把材料丢给它",
      subtitle: "Word / Markdown 都行",
      media: "",
      aspect: 2400 / 1500,
      terminal: [
        { text: "已添加文件  季度总结.md（8.2 KB）", kind: "muted", pause: 16 },
        {
          text: "把 @季度总结.md 做成 PPT，深色商务风，多用图表",
          kind: "cmd",
          pause: 20,
        },
        { text: "Word / Markdown / 一段大纲，都可以直接丢进来", kind: "muted" },
      ],
    },
    {
      title: "说一句：做成 PPT",
      subtitle: "排版、配色、图表全自动",
      media: "",
      aspect: 2400 / 1500,
      terminal: [
        { text: "读取 季度总结.md · 提炼重点", kind: "out", pause: 20 },
        { text: "Skill：pptx · 设计大纲（8 页）", kind: "out", pause: 20 },
        { text: "自动排版 · 配色 · 图表 · 中文字体", kind: "out", pause: 24 },
        { text: "✓ 已生成 2026Q2季度业务总结.pptx（8 页）", kind: "ok" },
      ],
    },
    {
      title: "打开就能用",
      subtitle: "真实成品 · PowerPoint 里随便改",
      media: "",
      aspect: 1300 / 732,
      slides: [1, 2, 3, 4, 5, 6, 7, 8].map(
        (n) => `aitool/pptx-skill/slides/${n}.png`,
      ),
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
      tts: "第一步，在终端里敲两条命令，把官方的文档技能装上。",
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
