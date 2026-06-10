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

## 待办 ⬜(按顺序)

1. **确认环境密钥**:`MINIMAX_API_KEY` + `MINIMAX_GROUP_ID`(上次缺失,用户说会配好)。
   host 用默认 `api.minimaxi.com`,别改成 .io。
2. **生成配音**(8 段,输出到 `public/aitool/pptx-skill/voiceover/`):
   ```bash
   cd lhopital-video && npm ci
   node --experimental-strip-types generate-voiceover-aitool-minimax.ts pptx-skill
   ```
3. **渲染 + 抽帧检查**(命令见 README 第 6 节;必须带
   `--browser-executable=...headless_shell --ignore-certificate-errors`)。
   重点检查:hero 卡在工具名段的观感、步骤图文字清晰度、系列角标显示「第 02 期」。
4. **音量复测**(README 第 5 节,loudnorm 实测,目标:人声比 BGM 高 ~6dB、真峰 <−1dBTP;
   人声 volume=3.6 / BGM 0.27 是上期调好的起点,大概率不用动)。
5. **faststart 导出** `out/*-douyin.mp4`,验收 1080×1920/30fps/<10MB。
6. **commit + push**(配音 mp3 一起提交;单次 push <40MB)。

## 备注

- 素材是「高保真重现」(HTML mockup),不是真实录屏——用户已知情。
- 如需动效,可把某一步的 HTML 加 CSS 动画后用 Chromium 连续截帧合成 mp4,
  但上期 step1 也是静态 jpg,静态可接受;StepSection 本身有入场动画。
- 文案如改动,`voiceover[]` 是单一数据源,改完要**重生全部 8 段**并提交 mp3。
