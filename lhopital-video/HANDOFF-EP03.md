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

## 已完成 ✅

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
