# 第 04 期交接 — rembg 一键抠图(被低估的 AI 神器 EP04)

> 总手册:`src/compositions/AIToolPromo/README.md`。分支:`claude/lhopital-voiceover-music-dLz4h`。
> 渲染 id:**CutoutPromo**(不是 AIToolPromo)。

## 选题

- 工具:**rembg**(开源一键去背景,GitHub 23.3k★,基于 u2net)。
- 角度:「一行命令,背景抠得干干净净」。钩子:「抠个图,还在 PS 里描半天?」。
- 三个用处:证件照换底色 / 电商商品白底图 / 一键换背景。

## 已完成 ✅

1. **真实素材(真跑 rembg)**:
   - 3 张源图 AI 生成(无真人隐私):`generate-rembg-sources.ts` →
     `public/aitool/rembg/src/{portrait,product,pet}.jpg`(人/鞋/猫,背景够杂)。
   - 真跑 rembg:`run-rembg.py`(u2net,首次自动下载 176MB 模型)→ 抠成透明
     `cut/*.png`,再合成到新底色 `out/{portrait(蓝底),product(白底),pet(橙底)}.jpg`。
   - hero 卡 `0.png`:`mockups/rembg/0-hero.html` → 截图。
2. **新 BGM**(换了曲风):`generate-music-rembg.ts`(明快极简电子)→
   `public/aitool/rembg/bgm.mp3`。视频里 volume 0.3。
3. **新 composition `CutoutPromo`**(`src/compositions/AIToolPromo/CutoutPromo.tsx`,
   Root.tsx 已注册):hook → 工具卡 → 用法(`pip install rembg` + `rembg i 原图 输出`
   终端流)→ 3 个抠图前后对比 → 收束三连图 → CTA。
   - 节拍组件 `sections/CutoutBeat.tsx`,复用 `BeforeAfter`。
   - **修了 `BeforeAfter` 的揭示方向**:原先是 after→before(停在原图,错),
     已改为 before→after(原图擦出抠好结果,停在结果);并加了
     `beforeTag/afterTag/pixelated` props(默认 糊/高清/pixelated=true)。
4. **接线**:`generate-voiceover-aitool-minimax.ts` CONFIGS 加 `rembg`;
   8 段配音已生成。
5. **复检**:抽帧 OK(角标第 04 期、用法终端、三个前后对比停在抠好结果、收束三连图);
   混音 −17.59 LUFS / 真峰 −2.87 dBTP;douyin 导出 1080×1920 / 30fps / 54.8s / 5.8MB。

## 备注

- 换素材:换 `src/*.jpg` 重跑 `run-rembg.py` → 覆盖 `out/*.jpg` 重渲,配音不用动。
- 系列进度:EP01 Napkin / EP02 pptx / EP03 canvas-design / EP04 rembg。
