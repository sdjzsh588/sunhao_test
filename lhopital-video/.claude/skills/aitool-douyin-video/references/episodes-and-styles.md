# Episodes, compositions & creative styles

Companion to `SKILL.md`. The SKILL covers the **invariant pipeline** (audio,
mix, render). This file captures the **per-episode formats**, the reusable
section components, the asset recipes, and the hard-won gotchas so a new
session can reuse them instead of rediscovering.

---

## Composition map (one tool ≠ one composition)

Each episode picks the **format that best sells its tool**. They are separate
registered compositions in `src/Root.tsx`, all 1080×1920 / 30fps, all sharing
`styles.ts` (dark `#0a0a0a` + neon `#00ff88`) and `SeriesBadge`.

| EP | Tool | Composition id | Format / why |
| -- | ---- | -------------- | ------------ |
| 01 | Napkin | (legacy 13-section, **not registered** in current arch) | older format; can't re-render without a dedicated composition |
| 02 | pptx skill | `AIToolPromo` | hook → logo → 4 steps (GIF/img) → compare → CTA |
| 03 | canvas-design | `PosterPromo` | typed-prompt → poster "prints up" beats (`PosterBeat`) |
| 04 | rembg 一键抠图 | `CutoutPromo` | before/after wipe beats + **batch wall** (the differentiator) |
| 05 | 简历优化 ResumeSkills | `ResumePromo` | bullet rewrite cards + full-page before/after |

Render a given episode by its **composition id** (not always `AIToolPromo`):
```bash
npx remotion render <CompositionId> out/<slug>.mp4 --crf 16 \
  --browser-executable="$(find /opt/pw-browsers -name headless_shell | head -1)" \
  --ignore-certificate-errors
```
`AIToolPromo` selects its tool via `defaultProps.config` (pptx) — napkin was a
config swap. The newer episodes each have their own composition + default config
(cleaner; do this for new episodes rather than overloading `AIToolPromo`).

---

## Reusable section components (`sections/`)

Compose an episode from these. All animate with `useCurrentFrame` +
`interpolate`/`spring` (never CSS transitions — they don't render).

- **`HookCard`** — full-screen hook; last line auto-accented neon. Pain-point
  formula 「[做某事时]，[最烦的痛点]?」
- **`ToolIntroV3` / `StepSection`** — logo hero card + tagline; step rows.
- **`TerminalStream`** — types terminal lines with kinds `cmd` / `ok` / `muted`
  and per-line `pause`. Used for the **install walkthrough** (see below).
- **`BeforeAfter`** — wipe reveal. Props: `before`, `after`, `aspect`, `width`,
  `beforeTag`/`afterTag` (default 糊/高清), `pixelated` (default true; set
  **false** for full-res photos). **Direction is before→after, settling on
  after** (was inverted once — keep after as the climax).
- **`CutoutBeat`** — label/kicker + a `BeforeAfter`. Props incl. `kicker`,
  `aspect`, `width`. Used for rembg single-image use-cases.
- **`BatchBeat`** — 3×3 wall: originals first, then a green scan-line wave wipes
  each tile to its real cutout over a transparency checkerboard, counter ticking
  `n/9`. The "apps can't do this" moment.
- **`PosterBeat`** — types a prompt, poster rises/prints in.
- **`Recap`** (per-composition, inline) — closing reasons as neon pill chips
  (免费 / 无水印 / 本地 / 批量) + thumbnail row.
- **`CallToAction`**, **`SeriesBadge`** (tag + `episode`, bump per episode).

### Install walkthrough (for non-technical viewers)

EP04 pattern with `TerminalStream` — spell it out, viewers don't know what
Python is or where to type:
1. 装 Python：python.org 下载，一路点下一步
2. 打开命令行：Windows `Win+R` 输 `cmd`｜Mac 搜「终端」
3. 把命令粘贴进去回车：`pip install ...`
Then answer "它怎么知道文件在哪?" → **先打命令+空格，把文件拖进窗口**（路径自动
填上，Win/Mac 通用）— beginners always hit "找不到文件" otherwise.

---

## ⚠️ Deterministic fonts — text MUST NOT jitter

**Symptom the user will report:** "文字一直在动 / 排版一直在抖."
**Root cause:** `styles.ts` `FONT` names `"Noto Sans SC"`, but the render image
has no such font. Each headless worker fell back on its own timing → text
metrics + line-wraps flickered frame-to-frame.

**Fix (already in repo, applies to ALL episodes):**
- Self-host `public/fonts/NotoSansCJKsc-Regular.otf` + `-Bold.otf`.
- `src/load-fonts.ts` loads them via `FontFace` and **blocks render** with
  `delayRender`/`continueRender`. Imported once in `Root.tsx`
  (`import "./load-fonts";`).
- Terminal `MONO` stack ends in `"Noto Sans SC"` too → now stable.

**Verify** (frame-diff a text-dense, animation-settled moment ≈ 0.000):
```bash
for t in 30.0 30.0667 30.1333; do npx remotion ffmpeg -ss $t -i out/x.mp4 \
  -frames:v 1 -q:v 2 /tmp/f_$t.jpg -y 2>/dev/null; done
python3 -c "from PIL import Image;import numpy as np,glob;f=sorted(glob.glob('/tmp/f_*.jpg'));a,b,c=[np.array(Image.open(x).convert('L'),int) for x in f];print(abs(a-b).mean(),abs(b-c).mean())"
```

**Sharpness:** render with `--crf 16`. For embedded document/image assets (e.g.
resume pages), render the PNG at ~**2× its on-screen width** so the downscale is
crisp — blurry CJK strokes come from under-rendered source PNGs, not the codec.

---

## Choosing a tool (the gate that saved EP04)

Before committing a tool, ask: **「手机 / 微信 / 现成 App 能不能干这件事?」**
- If a phone app already does it well → either pick a different tool, **or
  reframe the episode around what apps can't do**: batch / free / no-watermark /
  runs-local / unlimited. (EP04 rembg pivoted from "能抠图" to "抠一张手机就行，
  抠一百张呢?" → batch wall.)
- Favor genuinely **underrated** tools (fits the series name). A more famous
  tool isn't automatically better TV.

## Honesty principle (series backbone)

Demo assets must be **real tool output**, not faked. But you may **choose the
sample that shows the tool at its best** (any demo does):
- rembg: real `rembg i` / `rembg p` runs on AI-generated source images.
- resume: real `.docx` before/after, rendered to PNG.
- ASR (explored, not shipped): pick everyday-language audio — Whisper drops
  jargon/quick-spoken words ("提测""批量导出").

---

## Asset recipes (this session)

**Demo source images (MiniMax image-01):** `generate-rembg-sources.ts` pattern —
`POST /v1/image_generation`, `model: image-01`, `aspect_ratio: "3:4"`,
`response_format: "base64"`. Generate subjects with busy backgrounds so a cutout
reads as impressive.

**rembg real run:** `pip install "rembg[cli]"` (the `[cli]` extra is needed for
`rembg p`). `run-rembg.py`: `rembg.remove` per image → transparent PNG →
composite onto new bg (ID-blue / e-commerce white). `rembg p src_dir out_dir`
for batch (downloads u2net ~176MB on first run; GitHub-hosted, allowed).

**Resume before/after (`make-resume-demo.py`):** build real `.docx` with
`python-docx` (font `WenQuanYi Zen Hei` — a CJK font present in the image;
add accent rules via `w:pBdr`), then
`soffice --headless --convert-to pdf` → render with `pypdfium2` at `scale≈2.9`
→ crop to the content area (`top ~72%` of A4 to drop whitespace). "Before" is
deliberately plain; "after" follows the ResumeSkills rules (single column,
standard fonts, no tables — ATS-safe) and is fully typeset.

**Per-episode BGM (optional):** `generate-music-rembg.ts` = copy of
`generate-music-minimax.ts` with a different `PROMPT` and output path
`public/aitool/<slug>/bgm.mp3`. Newer episodes mixed BGM `volume 0.3` → final
≈ **−17 LUFS / TP < −1 dBTP** (fine; in douyin's comfortable range).

---

## Environment gotchas

- **Network allowlist:** GitHub release downloads work; **HuggingFace Hub and
  Azure CDN are blocked**. This is why a Whisper episode is hard — only int8
  ONNX (via sherpa-onnx GitHub release) is reachable, and int8 drops Chinese
  characters. SenseVoice (also GitHub-hosted, sherpa-onnx) transcribes Chinese
  cleanly + fast if that path is ever revived.
- **`.claude/skills` (repo root) is a SYMLINK** to `lhopital-video/.claude/skills`
  — they are ONE directory. Edit the real path; never `rm -rf` through the
  symlink (it deletes the real files). No manual mirroring needed.
- **`out/` is git-ignored** — committing source + assets is enough; renders are
  reproducible. Source-of-truth for a re-render is the config + voiceover mp3s +
  bgm in `public/`.
- Keep pushes < ~40MB; watch raw GIF/mp4/model sizes.
