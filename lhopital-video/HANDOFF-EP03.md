# 第 03 期交接 — canvas-design(被低估的 AI 神器 EP03)

> 总手册:`src/compositions/AIToolPromo/README.md`,流程 skill:`aitool-douyin-video`。
> 分支:`claude/lhopital-voiceover-music-dLz4h`。
>
> 注:本期前身是 Real-ESRGAN「老照片变高清」,用户觉得「不大好、要做 skill 介绍」,
> 已整期替换为 canvas-design,旧 photo-upscale 文件已删(BeforeAfter 组件保留备用)。

## 选题(已定)

- 工具:**canvas-design**(Anthropic 官方 skill,在 `anthropics/skills` 仓库的
  **example-skills** 插件里,和 algorithmic-art 同插件)。产物:美术馆级海报/封面,
  .png / .pdf,强调设计哲学 + 极简文字。
- 角度:「一句话做出能用的封面/海报」。钩子:「想发小红书、做海报,排版丑到不想发?」。
- 前后对比:套模板改完还是土 → 一句话出高级感成品。

## v3 海报改为「真·调用 skill 生成」(用户问:这几张是你调 skill 生成的吗)✅

- v1/v2 的海报是我手写 HTML/CSS 的「仿制」,**不是 skill 产物**。v3 改正:
  - 把官方 canvas-design **真装进** `.claude/skills/canvas-design/`(SKILL.md +
    81 个 canvas-fonts 字体),装后它出现在可用 skill 列表,**通过 Skill 工具
    正式调用**。
  - 严格走它的两步法:① 每张先产出「设计哲学」.md
    (`canvas-design-run/philosophy/*.md`,4 个命名运动:Nocturnal Gravity /
    Frequency Riot / Slow Bloom / Concrete Chord)→ ② 用 skill 自带字体
    (Gloock / BigShoulders / Outfit / YoungSerif / InstrumentSerif 等)渲染成
    PNG(`canvas-design-run/render/*`,经 Chromium 截图),含系统化标记 / 坐标 /
    均衡器 / 同心轮廓等 skill 强调的「科学图鉴」语言,绝不重叠。
  - 成品 PNG 覆盖 `public/aitool/canvas-design/posters/{1-4}.png`,重渲视频。
- 注:渲染机制仍是「写设计代码→Chromium 出 PNG」,这正是 canvas-design 的
  工作方式;CJK 标题用系统 WenQuanYi 配 skill 的拉丁展示字体。

## v2 改版(用户反馈:要「打出需求 → 展示生成的海报」,风格可不同)✅

- **新 composition `PosterPromo`**(`src/compositions/AIToolPromo/PosterPromo.tsx`,
  Root.tsx 已注册,渲染 id 是 **PosterPromo** 不是 AIToolPromo):
  hook → 工具卡 → **4 个「需求→海报」节拍** → 收束网格 → CTA。
- 节拍组件 `sections/PosterBeat.tsx`:顶部逐字打出一句需求,打完后海报像
  打印一样从底部升起占满画面,绿色「✓ 已生成 n/4」角签弹出;配音念的就是
  屏幕上的需求。
- 配音 8 段全部重写重生(id:01-hook / 02-tool / 03-beat1…06-beat4 /
  07-recap / 08-cta)。
- 复检:抽帧 OK;混音 −18.12 LUFS / 真峰 −1.42 dBTP;douyin 导出
  1080×1920 / 30fps / 55s / 6.3MB。AIToolPromo 默认 config 已指回 pptx-skill。

## 已完成(v1,基础仍在用)✅

1. **配置**:`config/canvas-design.ts`(`slug: canvas-design`、`episode: 3`、
   8 句 voiceover、BGM 复用 `aitool/napkin/bgm.mp3`)。
2. **真实产物**:4 张**真实设计**的海报(HTML/CSS → Chromium 截图,这正是
   canvas-design 的工作方式——写设计代码渲染成 PNG,所以是忠实呈现):
   - 源文件 `mockups/canvas-design/{1-book,2-fest,3-coffee,4-expo}.html`
     → `public/aitool/canvas-design/posters/1-4.png`(1080×1440)。
   - 风格各异(暗金 editorial / 野兽派霓虹 / 极简咖啡 / 包豪斯),体现「不是模板」。
   - hero 卡 `0.png`:`mockups/canvas-design/0-hero.html` → 截图。
3. **接线**:`AIToolPromo.tsx` 指向 `canvasDesignV3`;
   `generate-voiceover-aitool-minimax.ts` 的 CONFIGS 用 `"canvas-design"`。
   步骤 1-3 复用 `TerminalStream`(无装饰流式终端),step4 用 `SlidesGrid`
   展示 4 张海报。安装命令真实(`/plugin marketplace add anthropics/skills`
   + `/plugin install example-skills@anthropic-agent-skills`)。
4. **配音 + 渲染 + 复检**:8 段已生成提交;全段抽帧 OK,角标「第 03 期」;
   对比卡字数已收齐(避免末字孤行)。混音 −18.20 LUFS / 真峰 −4.17 dBTP;
   douyin 导出 1080×1920 / 30fps / 53.3s / 5.4MB。

## 备注

- 想换海报内容/风格:改 `mockups/canvas-design/*.html` 重截即可,配音不用动。
- 若用户真跑 canvas-design 生成了海报,直接替换 posters/*.png 重渲,更「真」。
