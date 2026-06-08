# AIToolPromo — 抖音「被低估的 AI 神器」系列模板(交接手册)

30s–50s 竖屏(1080×1920, 30fps)、数据驱动的 AI 工具推荐视频。第一期是
**Napkin**(`config/napkin-v3.ts`)。这份文档讲清楚**怎么做下一期**,以及配音、
BGM、音量、素材、渲染等所有方法,供新会话直接照做。

> 项目根目录:`lhopital-video/`(所有命令都在这里跑)。Composition id:`AIToolPromo`。
> 环境:MiniMax 走 **`api.minimaxi.com`**(不是 .io!),需要 `MINIMAX_API_KEY` +
> `MINIMAX_GROUP_ID`;渲染用系统 Chromium(沙箱里不能联网下 Chromium)。

---

## 0. 当前结构(v3)

```
src/compositions/AIToolPromo/
├── AIToolPromo.tsx          # 顶层:拼 8 段 + BGM + 系列角标;calculateMetadata 反算时长
├── config/
│   ├── types.ts             # AIToolConfigV3 等类型
│   └── napkin-v3.ts         # ★ 当前用的配置(单一数据源)。做新工具就复制它
├── sections/
│   ├── HookCard.tsx         # 钩子大字(末行霓虹绿重音)
│   ├── StepSection.tsx      # 单步(徽章+标题+副标题+媒体)、ToolIntroV3(logo 段)
│   ├── Media.tsx            # MediaFrame:jpg 用 <Img>、mp4 用 <Video> 循环
│   ├── Comparison.tsx       # 前后对比(红→绿)
│   ├── CallToAction.tsx     # 关注 CTA
│   └── SeriesBadge.tsx      # 左上角系列角标
└── styles.ts                # 配色/字号(深色 #0a0a0a + 霓虹绿 #00ff88)
generate-voiceover-aitool-minimax.ts   # 生成 8 段配音
generate-image-minimax.ts              # 文生图(image-01)
generate-music-minimax.ts              # 生成 BGM(写到 public/bgm.mp3)
public/aitool/napkin/                   # 素材:0.jpg(logo) 1.jpg 2/3/4.mp4 bgm.mp3 voiceover/*.mp3
```

叙事 8 段(顺序):**钩子 → 工具名(logo) → 第1步 → 第2步 → 第3步 → 第4步 → 前后对比 → 关注**。

---

## 1. 做下一期(v0 / Cursor / …)的完整流程

1. **复制配置**:`config/napkin-v3.ts` → `config/<工具>.ts`,改:
   - `slug`(决定素材目录 `public/aitool/<slug>/`)
   - `script.hook`(套钩子公式见下)、`toolName`、`value`、`before/after`、`cta`
   - `heroMedia`(logo,放工具名段)+ `heroAspect`(宽/高)
   - `steps[]`:每步 `title / subtitle / media / aspect`(aspect = 素材宽/高)
   - `voiceover[]`:8 句 `tts`(顺序 = hook, tool, step1-4, compare, cta)
   - `seriesTag`(系列名,保持不变)、`episode`(**期号 +1**)
   - `musicUrl`(可复用同一条 bgm,见第 4 节)
2. **放素材**到 `public/aitool/<slug>/`(logo、各步骤的截图/录屏)。
3. **GIF 必须转 MP4**(见第 5 节)——直接用大 GIF 会把渲染撑爆内存。
4. **生成配音**(见第 3 节)。
5. **指向新配置**:把 `AIToolPromo.tsx` 顶部的 `import { napkinV3 }` 和
   `defaultProps.config` 换成新配置(或加一个新 Composition)。同样改
   `generate-voiceover-aitool-minimax.ts` 里的 `CONFIGS`。
6. **渲染 + 导出**(第 6 节),抽帧检查,微调,交付。

### 钩子公式(系列统一套路:痛点代入)
> **「[做某事时],[最烦的痛点]?」** 末行是 punch,会被标成霓虹绿。
> 例:Napkin =「文章写完了 / 配图还要做半天?」

---

## 2. 时长 / 节奏(`AIToolPromo.tsx`)

- **不写死帧数**:`calculateMetadata` 读每段配音时长,按 `max(配音帧+pad, 地板)` 求和。
- `SECTION_FLOOR`(帧,8 段)= `[120,150,150,225,225,225,150,120]`
  - 钩子 4s、工具名 5s、4 个步骤各 7.5s、对比 5s、CTA 4s(配音更长则自动加长)。
  - 想**整片更短**:调小步骤地板(如 225→180);想**某段停留更久**:调大对应地板。
- `TAIL_PAD`(配音讲完后的停留帧)= `[18,34,36,40,40,40,26,22]`。
- 当前成片约 **50s**。

---

## 3. 配音(MiniMax TTS)

- 文案在**配置文件的 `voiceover[]`**(单一数据源)。`tts` 是朗读版:
  - 字母按字母念 → 写成 `P P T`、`P N G`(中间加空格)。
- 生成命令(host 已默认 `api.minimaxi.com`,模型 `speech-2.8-hd`,44.1k/256k,语速 1.08):
  ```bash
  node --experimental-strip-types generate-voiceover-aitool-minimax.ts <slug>
  ```
  输出到 `public/aitool/<slug>/voiceover/<id>.mp3`(8 个文件)。
- ⚠️ 这个脚本**一次重生全部 8 段**,即使只改了一句。MiniMax TTS 每次字节不同,
  改完记得把变动的 mp3 一起 commit(否则仓库和成片对不上)。

---

## 4. 背景音乐(BGM)

- 当前 BGM:`public/aitool/napkin/bgm.mp3`(MiniMax `music-2.6` 生成的电子节奏曲,
  裁到 ~40s,循环播放)。**系列建议复用同一条 bgm** 保持听感一致——新一期直接
  把 `musicUrl` 指向它即可,不用重生。
- 要**换/生成新 BGM**:用 `generate-music-minimax.ts`(改里面的 `PROMPT`,
  `is_instrumental:true`,写到 `public/bgm.mp3`),再裁剪/搬到目标目录:
  ```bash
  node --experimental-strip-types generate-music-minimax.ts
  npx remotion ffmpeg -i public/bgm.mp3 -t 40 -c copy public/aitool/<slug>/bgm.mp3 -y
  ```

---

## 5. 音量混音(按 dB 调,关键)

人声和音乐**原始响度差很多**(实测:人声 ~−31.8 LUFS,BGM −15.5 LUFS,BGM 天生响
16 dB),所以**不能只看 volume 数字**。当前设置在 `AIToolPromo.tsx`:

- 人声 `<Audio ... volume={3.6} />`(+11 dB)
- BGM `<Audio ... loop volume={0.27} />`(+12 dB)

成片实测:**整体 −18 LUFS、真峰 −1.9 dBTP(不爆音)、人声比 BGM 高 ~6 dB**。

**怎么测 / 怎么改:**
```bash
# 测某个音频的整体响度(LUFS)和真峰(dBTP)
npx remotion ffmpeg -i <文件> -af loudnorm=print_format=json -f null - 2>&1 | grep -E "input_i|input_tp"
# 测成片(先抽出音轨再测,直接测 mp4 有时无输出)
npx remotion ffmpeg -i out/xxx.mp4 -map 0:a -c:a pcm_s16le /tmp/mix.wav -y
npx remotion ffmpeg -i /tmp/mix.wav -af loudnorm=print_format=json -f null - 2>&1 | grep -E "input_i|input_tp"
```
- 增益换算:`gain_dB = 20*log10(volume)`,`volume = 10^(gain_dB/20)`。
- 想**人声更突出**:把 BGM volume 调小(差值拉到 8 dB ≈ BGM ~0.21);
  想**整体更响**:同比放大两个 volume,但盯住真峰 < −1 dBTP 别爆。
- ⚠️ `volumedetect` 在内置 ffmpeg 没有,用 `loudnorm` 测。

---

## 6. 渲染 + 导出抖音

```bash
# 渲染(必须用系统 Chromium + 忽略证书,沙箱限制)
npx remotion render AIToolPromo out/<name>.mp4 \
  --browser-executable="$(find /opt/pw-browsers -name headless_shell | head -1)" \
  --ignore-certificate-errors
# 加 faststart,手机/抖音可边下边播
npx remotion ffmpeg -i out/<name>.mp4 -c copy -movflags +faststart out/<name>-douyin.mp4 -y
```
验收:9:16 / 1080×1920 / 30fps / < 10MB / 时长≈配音。可抽帧检查:
`npx remotion still AIToolPromo /tmp/f.png --frame=N --scale=0.5 --browser-executable=... --ignore-certificate-errors`

---

## 7. 素材处理:GIF → MP4(必做)

大 GIF(本项目 2648px 宽)会被 `@remotion/gif` 逐帧解码进内存 → **渲染 OOM 崩溃**。
统一转成小 MP4 用 `<Video>` 播(内存安全、更小更清晰,动效一致):
```bash
npx remotion ffmpeg -i public/aitool/<slug>/X.gif \
  -vf "scale=1080:-2,format=yuv420p" -c:v libx264 -crf 24 -pix_fmt yuv420p -movflags +faststart -an \
  public/aitool/<slug>/X.mp4 -y
```
然后 config 里 `media` 指向 `.mp4`(`Media.tsx` 里 `.mp4`→`<Video>`、其它→`<Img>`)。

---

## 8. 系列角标(`SeriesBadge.tsx`)

左上角药丸「⚡ 系列名 · 第 NN 期」,全程显示。由配置的 `seriesTag` + `episode` 驱动,
**下一期只改 `episode`**。位置在左上(避开抖音右侧按钮和底部文案区)。

---

## 9. 文生图(可选,做插画/封面用)

```bash
node --experimental-strip-types generate-image-minimax.ts   # image-01, base64, 存 public/images/
```

---

## 10. 相关 skill / 约定

- **`remotion-best-practices`** skill:做视频/动画的规范(动画必须 useCurrentFrame/
  interpolate/spring,禁 CSS 动画与 tailwind 动画类)。
- **`minimax-voiceover-music`** skill:MiniMax 配音/配乐的完整步骤与坑(含 host =
  `api.minimaxi.com`、2049 多半是域名错等)。
- 仓库根 `CLAUDE.md` 有 skill 路由约定;本系列素材音视频都走 MiniMax。

---

## 11. 已知坑速查

1. MiniMax 用 **`api.minimaxi.com`**;`api.minimax.io` 会一律 `2049 invalid api key`。
2. 大 GIF 直接渲染 **OOM** → 先转 MP4。
3. 改一句配音也会**重生全部 8 段**,记得 commit 变动的 mp3。
4. **音量只看 volume 数字会判断错**,人声/音乐原始响度差 16 dB,要用 loudnorm 实测。
5. push 单次别超 ~40MB(git 服务器会拒),大文件(原始大 GIF/mp4)注意体积。
6. 渲染必须带 `--browser-executable=...headless_shell --ignore-certificate-errors`。
