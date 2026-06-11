import type { AIToolConfigV3 } from "./types";

export type BulletPair = { weak: string; strong: string };

// Episode 5 — ResumeSkills (github.com/Paramchoudhary/ResumeSkills), a
// community skill pack: 20 job-hunt skills (bullet writer, ATS optimizer,
// quantifier, cover letter, interview prep, salary negotiation...). Format:
// hook → tool card → usage (install + plain-language trigger) → bullet
// rewrite beat → full-page before/after → skills wall → recap → CTA.
// The before/after resumes are REAL .docx produced by following the skill's
// X-Y-Z/quantify/ATS rules (make-resume-demo.py), rendered via LibreOffice.
export const resumeV5: AIToolConfigV3 & {
  bullets: BulletPair[];
  page: { before: string; after: string; aspect: number };
  wall: string[];
} = {
  slug: "resume",
  script: {
    hook: "投了 100 份简历\n石沉大海？",
    toolName: "ResumeSkills",
    value: "一句话，简历脱胎换骨",
    before: "「负责日常运营」\n空话连篇",
    after: "粉丝 +617%\n数字说话",
    cta: "更多被低估的 AI 神器\n关注我",
  },
  heroMedia: "aitool/resume/0.png",
  heroAspect: 1800 / 480,
  bullets: [
    {
      weak: "负责公司微信公众号的日常运营",
      strong: "粉丝 1.2万 → 8.6万（+617%），打开率为行业 2 倍",
    },
    {
      weak: "协助组织线上活动",
      strong: "12 场活动，单场最高拉新 9,400 人，获客成本 −35%",
    },
    {
      weak: "参与撰写推文和数据整理",
      strong: "推文 200+ 篇，6 篇 10w+，产出效率 +50%",
    },
  ],
  page: {
    before: "aitool/resume/files/before.png",
    after: "aitool/resume/files/after.png",
    aspect: 1347 / 1743,
  },
  wall: [
    "简历优化",
    "过机筛 ATS",
    "量化成果",
    "求职信",
    "面试准备",
    "谈薪策略",
    "转行翻译",
    "领英优化",
  ],
  steps: [],
  voiceover: [
    {
      id: "01-hook",
      tts: "投了一百份简历，石沉大海？很多时候不是你不行，是简历不行。",
    },
    {
      id: "02-tool",
      tts: "GitHub 上有个开源技能包，叫 ResumeSkills：二十个求职技能，免费，专治简历。",
    },
    {
      id: "03-usage",
      tts: "用法简单：把技能装进 Claude，然后说人话就行——比如“帮我优化简历，目标岗位高级运营”，对应的技能自动激活。",
    },
    {
      id: "04-bullets",
      tts: "看效果。“负责公众号日常运营”这种空话，它会追着你要数字，改成：粉丝从一万二涨到八万六，打开率是行业两倍——面试官一眼记住你。",
    },
    {
      id: "05-page",
      tts: "整页看更明显：左边是原来的简历，右边是改完的——核心亮点、量化成果、关键词，全有了。",
    },
    {
      id: "06-wall",
      tts: "而且它不止改简历：求职信、面试准备、谈薪策略、领英优化，二十个技能一套全包。",
    },
    {
      id: "07-recap",
      tts: "免费开源，说句人话就能用，简历脱胎换骨——求职季，值得装一个。",
    },
    { id: "08-cta", tts: "想看更多被低估的 AI 神器，记得点个关注！" },
  ],
  musicUrl: "aitool/resume/bgm.mp3",
  mediaReady: true,
  seriesTag: "被低估的 AI 神器",
  episode: 5,
};
