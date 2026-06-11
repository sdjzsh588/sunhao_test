# 第 03 期交接 — 老照片变高清(被低估的 AI 神器 EP03)

> 总手册:`src/compositions/AIToolPromo/README.md`,流程 skill:`aitool-douyin-video`。
> 分支:`claude/lhopital-voiceover-music-dLz4h`。

## 选题(已定)

- 工具:**Real-ESRGAN**(腾讯 ARC,GitHub 35.7k★,开源图像超分辨率;
  **Upscayl** 是它的免费图形界面)。
- 角度:「一键让老照片重回高清」。钩子:「翻出小时候的老照片,糊到看不清脸?」。
- 前后对比:糊成马赛克 → 4 倍高清、发丝毕现。

## 已完成 ✅

1. **配置**:`config/photo-upscale.ts`(`slug: photo-upscale`、`episode: 3`、
   8 句 voiceover、BGM 复用 `aitool/napkin/bgm.mp3`)。
2. **真实素材**(前后对比是**真跑 Real-ESRGAN** 出来的,不是演的):
   - 演示人物是 **AI 生成**(无真人隐私):MiniMax image-01 生成 `source.jpg`
     (脚本 `mockups/photo-upscale/generate-photo-source.ts`,已删 source 本体)。
   - 降质 + 真跑放大:`mockups/photo-upscale/realesrgan-run.py`
     (spandrel 加载官方 `RealESRGAN_x4plus.pth` 权重,CPU 推理)→
     `before.jpg`(216×288 降质件)、`after.png`(864×1152,x4 输出)。
   - hero 卡 `0.png`:HTML(`mockups/photo-upscale/0-hero.html`)→ Chromium 截图。
3. **新组件**:`sections/BeforeAfter.tsx`(前后揭示:分隔线左→右擦出高清);
   `MediaStep` 加 `beforeAfter` 字段,`StepSection` 接好。
4. **接线**:`AIToolPromo.tsx` 指向 `photoUpscaleV3`;
   `generate-voiceover-aitool-minimax.ts` 的 CONFIGS 加 `"photo-upscale"`。
5. **配音 + 渲染 + 复检**:8 段已生成提交;全段抽帧 OK(hook/step1 终端/
   step2 老照片/step3 终端/step4 揭示/对比/CTA),角标「第 03 期」。
   混音 −18.04 LUFS / 真峰 −3.62 dBTP;douyin 导出 1080×1920 / 30fps /
   56.1s / 5.8MB。

## 复现放大(若要换照片)

```bash
pip3 install --break-system-packages torch torchvision --index-url https://download.pytorch.org/whl/cpu
pip3 install --break-system-packages spandrel pillow numpy
curl -sL -o RealESRGAN_x4plus.pth \
  https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth
# 改 realesrgan-run.py 里的 SRC 指向你的照片,跑出 before/after
```

## 备注

- 步骤 1/3 是无装饰流式终端(EP02 建的 `TerminalStream`);step2 是糊照片,
  step4 是真实前后揭示。除 hero 卡外画面均为真实产物。
- 用户想用**自己的**老照片:把图发来,跑 realesrgan-run.py 换掉
  before/after 重渲即可(配音不用动)。
