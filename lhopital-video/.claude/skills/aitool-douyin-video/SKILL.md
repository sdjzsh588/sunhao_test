---
name: aitool-douyin-video
description: Method/pipeline for making the「被低估的 AI 神器」Douyin series — a 9:16 data-driven AI-tool promo (Remotion AIToolPromo) with MiniMax narration + BGM. Use when creating/editing a new episode of this series, or when wiring narration/BGM/audio-mix/GIF assets/render for it. Covers the invariant pipeline; the per-tool creative structure is up to you.
metadata:
  tags: douyin, remotion, aitool, minimax, voiceover, bgm, vertical-video
---

## When to use

Making or editing an episode of the **被低估的 AI 神器** vertical (9:16) AI-tool
promo series. This skill is the **invariant pipeline** (audio, mixing, assets,
render, conventions). The presentation/structure for a given tool is a creative
call — the existing `AIToolPromo` (config-driven, hook → logo → 4 steps →
compare → CTA) is the default base; adapt sections as needed.

Full reference: `lhopital-video/src/compositions/AIToolPromo/README.md`.
**Per-episode formats, reusable sections, the font fix, and asset recipes:**
`references/episodes-and-styles.md` (read it before building a new episode).

## Episodes & compositions (one tool ≠ one composition)

Each tool gets the **format that best sells it** — a separate registered
composition, not always `AIToolPromo`. Render by **composition id**:

| EP | Tool | Composition id |
| -- | ---- | -------------- |
| 02 | pptx skill | `AIToolPromo` (config = pptx) |
| 03 | canvas-design | `PosterPromo` |
| 04 | rembg 抠图 | `CutoutPromo` (before/after wipe + batch wall) |
| 05 | 简历优化 | `ResumePromo` |

For a **new** episode, prefer adding its own composition + default config over
overloading `AIToolPromo`. Compose from `sections/` (`HookCard`, `TerminalStream`,
`BeforeAfter`, `CutoutBeat`, `BatchBeat`, `PosterBeat`, `Recap`, `SeriesBadge`,
`CallToAction`) — see the reference for each.

## ⚠️ Fonts must be loaded or text jitters

If the user says **"文字一直在动"**: `FONT` names `"Noto Sans SC"` but the image
lacks it, so each render worker falls back differently → per-frame jitter. Fixed
repo-wide via `public/fonts/NotoSansCJKsc-*.otf` + `src/load-fonts.ts`
(`FontFace` + `delayRender`, imported in `Root.tsx`). Always render `--crf 16`;
render embedded document PNGs at ~2× on-screen width for crisp CJK. Verify with a
frame-diff (≈0.000) — see the reference.

## Choosing the tool

Gate every pick with 「手机 / 微信 / 现成 App 能不能干?」 If yes → pick another
tool **or** reframe around what apps can't (batch / free / no-watermark / local /
unlimited). Demo assets must be **real tool output** (you may pick the
best-showing sample). Details + honesty principle in the reference.

## Prerequisites

- Work in **`lhopital-video/`** (Composition id `AIToolPromo`). Deps installed
  (`npm ci` if not).
- MiniMax host is **`api.minimaxi.com`** (NOT `api.minimax.io` → returns
  `2049 invalid api key` for every call). Needs env `MINIMAX_API_KEY` +
  `MINIMAX_GROUP_ID`, and the environment must allow `api.minimaxi.com`.
- Render needs the system Chromium (sandbox can't download one):
  `--browser-executable="$(find /opt/pw-browsers -name headless_shell | head -1)" --ignore-certificate-errors`.

## Make a new episode

1. Copy `config/napkin-v3.ts` → `config/<slug>.ts`; edit `slug`, `script`
   (`hook` via the pain-point formula, `toolName`, `value`, `before/after`,
   `cta`), `heroMedia`+`heroAspect` (the tool logo), `steps[]`
   (`title/subtitle/media/aspect`), `voiceover[]` (8 lines), `seriesTag`
   (keep), `episode` (**+1**), `musicUrl` (reuse the same bgm for series
   consistency).
2. Put assets in `public/aitool/<slug>/`. **Transcode any GIF to MP4** (below).
3. Generate narration (below).
4. Point `AIToolPromo.tsx` (`import` + `defaultProps.config`) and the
   `CONFIGS` map in `generate-voiceover-aitool-minimax.ts` at the new config
   (or register a new Composition — preferred for new episodes).
5. Render + faststart (below). Spot-check frames, tune, deliver.

Hook formula (series-consistent, pain-point): **「[做某事时]，[最烦的痛点]?」**
— the last line is the punch (auto-accented neon green in `HookCard`).

## Narration (MiniMax TTS)

Text lives in the config's `voiceover[]` (`tts` = read-aloud; spell letters with
spaces, e.g. `P P T`, so they're read letter-by-letter).

```bash
node --experimental-strip-types generate-voiceover-aitool-minimax.ts <slug>
# -> public/aitool/<slug>/voiceover/<id>.mp3  (8 clips: hook, tool, step1-4, compare, cta)
```

Model `speech-2.8-hd`, 44.1kHz/256k, speed ~1.08. ⚠️ The script **regenerates
all 8 clips** even for a one-line change, and MiniMax output isn't
byte-deterministic — commit every changed mp3 so the repo matches the render.

## Background music

Reuse `public/aitool/napkin/bgm.mp3` across episodes for a consistent series
sound (just point `musicUrl` at it). To make a new bed: edit the `PROMPT` in
`generate-music-minimax.ts` (writes `public/bgm.mp3`), then trim/move:
`npx remotion ffmpeg -i public/bgm.mp3 -t 40 -c copy public/aitool/<slug>/bgm.mp3 -y`.
(Per-episode BGM example: `generate-music-rembg.ts`.)

## Audio mix — tune by dB, not raw volume

Voice and music have very different native loudness (measured: narration
~−31.8 LUFS, BGM −15.5 LUFS — music is ~16 dB hotter), so raw `volume` numbers
mislead. Current settings in `AIToolPromo.tsx` give a good result:

- narration `<Audio ... volume={3.6} />` (+11 dB)
- BGM `<Audio ... loop volume={0.27} />` (+12 dB)
- → final mix **−18 LUFS, true peak −1.9 dBTP (no clip), voice ~6 dB over BGM**.

Measure (no `volumedetect` in the bundled ffmpeg — use `loudnorm`):
```bash
npx remotion ffmpeg -i <file> -af loudnorm=print_format=json -f null - 2>&1 | grep -E "input_i|input_tp"
# whole render: extract audio first, then measure
npx remotion ffmpeg -i out/x.mp4 -map 0:a -c:a pcm_s16le /tmp/mix.wav -y
npx remotion ffmpeg -i /tmp/mix.wav -af loudnorm=print_format=json -f null - 2>&1 | grep -E "input_i|input_tp"
```
`gain_dB = 20*log10(volume)`. Voice more present → lower BGM volume (8 dB gap ≈
BGM ~0.21). Louder overall → scale both, keep true peak < −1 dBTP.

## GIF → MP4 (required)

Large GIFs decode every frame into RAM and **OOM the render**. Transcode to a
small MP4 and play via `<Video>` (`Media.tsx`: `.mp4`→Video, else Img):
```bash
npx remotion ffmpeg -i public/aitool/<slug>/X.gif \
  -vf "scale=1080:-2,format=yuv420p" -c:v libx264 -crf 24 -pix_fmt yuv420p -movflags +faststart -an \
  public/aitool/<slug>/X.mp4 -y
```

## Render + export

```bash
npx remotion render <CompositionId> out/<name>.mp4 --crf 16 \
  --browser-executable="$(find /opt/pw-browsers -name headless_shell | head -1)" \
  --ignore-certificate-errors
npx remotion ffmpeg -i out/<name>.mp4 -c copy -movflags +faststart out/<name>-douyin.mp4 -y
```
`--crf 16` keeps CJK text sharp. Target: 1080×1920, 30fps, <10MB, duration ≈
narration (driven by `calculateMetadata`; adjust `SECTION_FLOOR` to change
pacing). The font fix (above) is global — re-rendering any episode picks it up.

## Conventions / pitfalls

- Style: dark `#0a0a0a` + neon green `#00ff88` (`styles.ts`).
- Series badge (`SeriesBadge.tsx`): `seriesTag` + `episode` — next episode just
  bumps `episode`.
- MiniMax key/GroupId are environment secrets (not in the repo) — confirm
  they're set in a new environment.
- `.claude/skills` (repo root) is a **symlink** to `lhopital-video/.claude/skills`
  — one directory, not two copies. Edit the real path; never `rm -rf` through
  the symlink.
- `out/` is git-ignored (renders are reproducible); commit source + `public/`
  assets. Don't push >~40MB in one go (git server rejects); watch raw GIF/mp4
  sizes.
