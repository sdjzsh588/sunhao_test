# 第 05 期交接 — ResumeSkills 简历技能（被低估的 AI 神器 EP05）

> 总手册:`src/compositions/AIToolPromo/README.md`。渲染 id:**ResumePromo**。

## 选题过程

- 用户两次「换选题」:Whisper 语音转字（本环境网络白名单挡 HuggingFace，
  只能跑 int8 量化版，中文吞字，真实素材不好看，放弃）→ FFmpeg（用户不要）。
- 用户点明「不一定是 Claude 官方的技能」→ 调研社区技能生态:
  superpowers（22.5万★，但纯开发者向，不适合大众）→ 选定
  **ResumeSkills**（github.com/Paramchoudhary/ResumeSkills，745★，
  20 个求职技能:bullet-writer / ats-optimizer / quantifier / cover-letter /
  interview-prep / salary-negotiation…）。

## 已完成 ✅

1. **真实素材**:clone 技能仓库，按 resume-bullet-writer（X-Y-Z 公式）、
   resume-quantifier、resume-ats-optimizer（单栏/标准字体/无表格）的规则，
   用 `make-resume-demo.py` 产出改前/改后两份真实 .docx →
   LibreOffice（需 `apt install libreoffice-writer`，已装）转 PDF →
   pypdfium2 转 PNG（`public/aitool/resume/files/{before,after}.png`）。
2. **hero 卡**:`mockups/resume/0-hero.html` → `public/aitool/resume/0.png`。
3. **BGM**:`generate-music-resume.ts`（温暖励志钢琴+轻节奏）→
   `public/aitool/resume/bgm.mp3`。注意:sed 复制 rembg 脚本时 prompt 没换掉，
   已手动改正重生成。
4. **新组件**:
   - `sections/BulletRewrite.tsx`:弱句红线划掉变灰 → 量化强句带高亮数字滑入（3 组）。
   - `ResumePromo.tsx`:hook → 工具卡 → 用法（说人话触发）→ bullet 改写 →
     整页对比（复用 CutoutBeat，新增 kicker/aspect/width props）→
     技能墙（2×4 chips + 共20个）→ 收束胶囊 + 成品图 → CTA。
   - Root.tsx 已注册;配音生成器 CONFIGS 加 `resume`。
5. **配音** 8 段（与 EP04 同声线）。
6. **复检**:抽帧 OK;混音 −17.15 LUFS / 真峰 −2.67 dBTP;
   1080×1920 / 30fps / 68.6s / 6.3MB（out/resume-douyin.mp4）。

## 环境备注

- HuggingFace / Azure CDN 不在网络白名单;GitHub releases / PyPI 可用。
- LibreOffice 原镜像缺 writer 组件，已 `apt-get install libreoffice-writer`。
- 系列进度:EP01 Napkin / EP02 pptx / EP03 canvas-design / EP04 rembg /
  EP05 ResumeSkills。
