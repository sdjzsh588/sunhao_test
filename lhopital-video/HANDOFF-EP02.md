# 第 02 期交接 — PPTX Skill（被低估的 AI 神器 EP02）

> 新会话从这里接手。总手册:`src/compositions/AIToolPromo/README.md`,
> 流程 skill:`aitool-douyin-video`。分支:`claude/lhopital-voiceover-music-dLz4h`。

## 选题(已定)

- 工具:**Claude 官方 pptx skill**(anthropics/skills 仓库 149k★,
  `document-skills` 插件,真实安装命令
  `/plugin install document-skills@anthropic-agent-skills`)。
- 角度:「一句话让 AI 做出整份 PPT」。钩子:「明天就要交PPT / 还在一页页手搓?」。
- 前后对比:3 小时排版到崩溃 → 3 分钟整份搞定。

## 已完成 ✅

1. **配置**:`src/compositions/AIToolPromo/config/pptx-skill.ts`
   (`slug: "pptx-skill"`、`episode: 2`、8 句 `voiceover[]` 文案已写好、
   BGM 复用 `aitool/napkin/bgm.mp3`)。
2. **素材(全自制,无需用户上传)**:`public/aitool/pptx-skill/0-4.png`。
   - 做法:HTML 模拟稿(`mockups/pptx-skill/*.html`)→ 系统 Chromium 截图:
     ```bash
     CHROME=$(find /opt/pw-browsers -name headless_shell | head -1)
     $CHROME --headless --no-sandbox --disable-gpu --hide-scrollbars \
       --screenshot=public/aitool/pptx-skill/N.png --window-size=2400,1500 \
       file://$PWD/mockups/pptx-skill/<N-name>.html
     ```
     (hero 0.png 用 `--window-size=1800,480`;**必须 `--no-sandbox`**,容器是 root。)
   - 0=logo 卡(aspect 1800/480) 1=安装命令 2=丢材料 3=生成过程 4=成品 PPT 网格
     (步骤 aspect 都是 2400/1500)。改画面就改 HTML 重截,中文字体是文泉驿正黑。
   - 5 张已抽查过:构图、中文渲染、配色(#0a0a0a + #00ff88 + Claude 橙 #d97757)OK。
3. **接线**:`AIToolPromo.tsx` 已指向 `pptxSkillV3`;
   `generate-voiceover-aitool-minimax.ts` 的 `CONFIGS` 已加 `"pptx-skill"`。

## 待办 ✅(2026-06-10 全部完成)

1. ✅ 密钥已配好(`api.minimaxi.com`)。
2. ✅ 8 段配音已生成并提交(`public/aitool/pptx-skill/voiceover/01-08*.mp3`)。
3. ✅ 渲染 + 抽帧检查通过:hook/hero/step1-4/对比/CTA 全部正常,
   角标全程「第 02 期」,黑帧仅为段落转场。
4. ✅ 音量实测:混音 −18.25 LUFS、真峰 −3.92 dBTP,人声比 BGM 高 ~6-7dB,
   volume 3.6/0.27 未动。
5. ✅ `out/pptx-skill-douyin.mp4`:1080×1920、30fps、51.8s、4.9MB。
   (out/ 在 gitignore,本地重渲一遍即可复现。)
6. ✅ 已 commit + push。**EP02 制作完成,可交付。**

## v2 改版(2026-06-11,按用户反馈)✅

- **步骤 1-3 改为流式终端动画**(`sections/TerminalStream.tsx`):命令逐字
  打出、输出逐行流入,无窗口装饰(用户明确不要 Claude Code 窗口壳)。
  step1 用真实的两条命令(`/plugin marketplace add anthropics/skills` +
  `/plugin install ...`,直接 install 会报 Marketplace not found)。
- **步骤 4 用真实成品**:用户真跑了 skill,生成的
  `2026Q2季度业务总结.pptx`(8 页)已入库;LibreOffice(需
  `apt install libreoffice-impress`,容器默认没有)转 PDF → pymupdf 抽页 →
  `public/aitool/pptx-skill/slides/1-8.png`,`sections/SlidesGrid.tsx`
  逐张弹入。喂给 skill 的源文档在 `samples/季度总结.md`。
- 旧的 1-4.png 模拟图已删,仅 0.png(片头 logo 卡)仍是自制设计稿。
- 03-step1 文案改为「两条命令」,8 段配音全部重生并提交。
- 复检:全段抽帧 OK;混音 −18.16 LUFS / 真峰 −2.30 dBTP;
  douyin 导出 1080×1920 / 30fps / 52.7s / 5.9MB。

## 备注

- 片头 hero 卡(0.png)是设计稿;其余画面为流式终端组件 + 真实 PPT 截图。
- 如需动效,可把某一步的 HTML 加 CSS 动画后用 Chromium 连续截帧合成 mp4,
  但上期 step1 也是静态 jpg,静态可接受;StepSection 本身有入场动画。
- 文案如改动,`voiceover[]` 是单一数据源,改完要**重生全部 8 段**并提交 mp3。
