# AIToolPromo — 抖音 AI 工具短视频模板

30s 竖屏 (1080×1920, 30fps)、数据驱动的工具推广视频。第一个工具是 **Napkin**；
所有内容走 `config/<tool>.ts`，组件里没有任何工具相关硬编码字符串。

## 渲染

```bash
npx remotion render AIToolPromo out/<tool>.mp4 \
  --browser-executable="$(find /opt/pw-browsers -name headless_shell | head -1)" \
  --ignore-certificate-errors
```

时长由配音自动决定（`calculateMetadata` 读取每段 narration 时长，按段落地板取
`max(floor, 音频帧数+pad)`，再求和），**不写死帧数**。

## 做下一个工具（复用流程）

1. 复制 `config/napkin.ts` → `config/<tool>.ts`，改 `slug / script / voiceover /
   screenshots / musicUrl`。
2. 把该工具的 7 张截图放到 `public/aitool/<slug>/`，文件名与 config 的
   `screenshots` 对应，并把 `screenshotsReady` 设为 `true`
   （未就绪时渲染带标签的占位框，方便先对节奏）。
3. 生成配音：`node --experimental-strip-types generate-voiceover-aitool-minimax.ts <slug>`
   （MiniMax `speech-2.8-hd`，host `api.minimaxi.com`）。生成配乐同 music 脚本，
   放到 `public/aitool/<slug>/bgm.mp3`。
4. 在 `AIToolPromo.tsx` 的 `CONFIGS`（生成脚本）/ `Root.tsx` 里把默认 config
   指向新工具，或加一个新的 Composition。
5. 渲染。首次渲染后按需微调每个 `points[].highlight` 的 `{x,y,w,h}`（0–1 比例）。

## 段落结构

钩子卡 → 工具名 → 点1/2/3（截图+高亮）→ 前后对比 → 关注 CTA。
视觉规范（深色 + 霓虹绿）在 `styles.ts`，动画工具在 `src/utils/animations.ts`。
