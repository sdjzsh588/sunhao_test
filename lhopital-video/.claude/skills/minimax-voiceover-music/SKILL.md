---
name: minimax-voiceover-music
description: Generate Mandarin narration (TTS) and instrumental background music with the MiniMax API for a Remotion video, then re-render. Use when asked to add/regenerate voiceover or BGM (especially "用 minimax" / 配音 / 配乐 / 重新渲染) for the lhopital-video project.
metadata:
  tags: minimax, tts, music, voiceover, bgm, remotion, audio
---

## When to use

Use this when generating or regenerating **narration** and/or **background
music** for the Remotion project in `lhopital-video/` with the MiniMax API, and
re-rendering the video. The composition auto-detects audio files, so swapping
audio needs **no React/code changes** — generate the files, then render.

> For editing the **video/composition** itself (scenes, animations, timing),
> use the `remotion-best-practices` skill. This skill only covers the
> MiniMax audio generation + re-render loop.

## Prerequisites (check first)

1. **Network**: the environment must allow host `api.minimax.io`
   (web app → environment → Network access → Custom/Full). China host
   alternative: set `MINIMAX_BASE=https://api.minimaxi.chat`.
2. **Secrets** (env vars): `MINIMAX_API_KEY` **and** `MINIMAX_GROUP_ID`
   (MiniMax needs both — a Bearer key *and* a GroupId). Optional:
   `MINIMAX_VOICE_ID` (defaults to a Mandarin female voice).
3. Quick check:
   ```bash
   [ -n "$MINIMAX_API_KEY" ] && [ -n "$MINIMAX_GROUP_ID" ] && echo OK
   ```
4. Install deps once: `cd lhopital-video && npm ci` (or `npm install`).
5. Run all `.ts` scripts with **`node --experimental-strip-types <file>`**
   (this Node rejects `--strip-types`).

## Models — use the best

- **TTS**: `speech-2.8-hd` — current flagship, highest quality (set via
  `MINIMAX_TTS_MODEL`, default in `generate-voiceover-minimax.ts`). Endpoint
  `POST /v1/t2a_v2?GroupId=...`. Audio: 44.1 kHz / 256 kbps mp3.
- **Music**: `music-2.6` (the paid, full-quality model — **not**
  `music-2.6-free`). Endpoint `POST /v1/music_generation?GroupId=...`.

## Steps

```bash
cd lhopital-video

# 1. Narration -> public/voiceover/lhopital/<id>.mp3 (one per scene)
node --experimental-strip-types generate-voiceover-minimax.ts

# 2. Instrumental BGM -> public/bgm.mp3
node --experimental-strip-types generate-music-minimax.ts

# 3. Re-render (system browser; chromium can't auto-download here, and asset
#    hosts are TLS-intercepted, so ignore cert errors)
npx remotion render LHopital out/lhopital.mp4 \
  --browser-executable="$(find /opt/pw-browsers -name headless_shell 2>/dev/null | head -1)" \
  --ignore-certificate-errors
```

Edit narration text in `src/voiceover/script.ts` (the `tts` field is the
read-aloud version; spell out symbols/numbers for clean pronunciation).

## Critical gotchas (these bit us — don't repeat them)

- **Music instrumental flag is `is_instrumental`, NOT `instrumental`.**
  MiniMax silently ignores the wrong key and then rejects the request with
  `2013 invalid params, lyrics is required`. With `is_instrumental: true` the
  `lyrics` field is omitted and you get a vocal-free bed. Do **not** work around
  the lyrics error by passing empty `[Intro]/[Verse]` tags — that yields a
  lower-quality, structured result.
- **Narration mp3 must outrank the committed wav.** `src/voiceover/script.ts`
  exports `VOICEOVER_EXTS` — it must be `["mp3", "wav"]`. If `wav` is first,
  `resolveLine()` keeps using the old offline Piper `.wav` and the new MiniMax
  voice never reaches the render (the video sounds unchanged).
- **`2049 "invalid api key"` is often rate-limiting, not a bad key.** A burst of
  calls can trip it for everything (even TTS) for several minutes. Retry with
  backoff (~30s) rather than assuming the key is wrong. The key here is a plain
  125-char token, not a JWT, so it does not "expire" mid-session.
- **File byte-size is NOT proof the audio changed.** Output is ~constant-bitrate
  AAC, so size ≈ bitrate × duration. Changing the music or BGM volume barely
  moves the byte count when the duration is unchanged; only a duration change
  (e.g. new narration → scenes resize) moves it. To verify an audio swap, listen
  or compare against a muted render — don't rely on `ls -la`.

## Tuning

- **BGM volume**: `bgmVolume()` in `src/Composition.tsx`. Base under narration is
  `0.1` (10%) — lower to ~0.07 if still too loud, raise toward 0.15 if too quiet.
- **Voice**: set `MINIMAX_VOICE_ID` (see your MiniMax console → Voices), e.g.
  `export MINIMAX_VOICE_ID="Chinese (Mandarin)_Warm_Bestie"`.
- **Music style**: edit the `PROMPT` in `generate-music-minimax.ts`.

## Response decoding

Both APIs return audio as a **hex-encoded string** in JSON (`data.audio`); the
scripts decode it with `Buffer.from(json.data.audio, "hex")`. The music script
sends `output_format: "hex"` explicitly. Check `base_resp.status_code === 0`
before decoding.
