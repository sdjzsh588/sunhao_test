# Session handoff

Context for continuing this project in a new session (e.g. after enabling
network access so the TTS / music APIs can be reached).

## Project
- Repo: `sdjzsh588/sunhao_test`
- Branch: `claude/laughing-allen-BhjiF` (all work lives here)
- Project dir: `lhopital-video/` (Remotion — videos written in React)
- Audio runbook: `lhopital-video/AUDIO.md`

## Videos (two Remotion compositions)
1. **`LHopital`** — L'Hôpital's rule explainer, ~55s. Already has Piper Mandarin
   narration + synthesized background music.
2. **`Vieta`** — Vieta's theorem (middle-school), 70s. Currently no audio.

Scene source: `src/scenes/` (L'Hôpital) and `src/vieta/` (Vieta). Shared math
components in `src/components.tsx`.

## Audio pipeline (important)
The composition auto-detects audio files, so swapping sources needs **no code
changes**:
- Narration: prefers `public/voiceover/lhopital/<id>.mp3`, falls back to `.wav`
- Music: prefers `public/bgm.mp3`, falls back to synthesized `public/bgm.wav`
- When narration exists, scene durations are sized to the audio.

Generator scripts (run with `node --experimental-strip-types <file>`):

| Purpose | Script | Needs |
| --- | --- | --- |
| ElevenLabs narration | `generate-voiceover.ts` | host `api.elevenlabs.io` + `ELEVENLABS_API_KEY` |
| ElevenLabs music | `generate-music.ts` | same |
| MiniMax narration | `generate-voiceover-minimax.ts` | host `api.minimax.io` + `MINIMAX_API_KEY` + `MINIMAX_GROUP_ID` |
| MiniMax music | `generate-music-minimax.ts` | same |
| Offline Piper narration | `scripts/make-voiceover-piper.ts` | none (model download, see file header) |
| Offline espeak narration | `scripts/make-voiceover-espeak.ts` | none (`apt-get install espeak-ng`) |
| Offline synth music | `scripts/make-bgm.mjs` | none |

## To enable the APIs (do this in the Claude Code web app)
1. Edit the environment's **Network access**: choose **Custom** (check "Also
   include default list of common package managers") and add the host you need,
   or choose **Full**.
   - ElevenLabs → `api.elevenlabs.io`
   - MiniMax → `api.minimax.io`
2. Add secrets / env vars:
   - ElevenLabs: `ELEVENLABS_API_KEY` (optional `ELEVENLABS_VOICE_ID` for a
     Mandarin voice)
   - MiniMax: `MINIMAX_API_KEY` + `MINIMAX_GROUP_ID` (optional `MINIMAX_VOICE_ID`)
3. Start a fresh session and ask to generate audio + re-render.

## Rendering in this sandbox (gotchas)
- Chromium can't be auto-downloaded and font/asset hosts are TLS-intercepted, so
  always render with a system browser and ignore cert errors:
  ```bash
  npx remotion render LHopital out/lhopital.mp4 \
    --browser-executable="$(find / -name headless_shell 2>/dev/null | head -1)" \
    --ignore-certificate-errors
  ```
- The container is a fresh clone each session: committed `.wav` narration and
  `bgm.wav` persist, but the Piper model (`models/`, gitignored) and any
  apt/pip installs do **not**. Not needed when using an API.
- Run `.ts` scripts with `node --experimental-strip-types` (this Node rejects
  `--strip-types`).

## Open items
- **Vieta has no narration script yet.** To add voiceover, write 6 Chinese lines
  mirroring `src/voiceover/script.ts`, then point the generators at them.
- Confirm the exact Mandarin voice id for whichever provider is chosen.

## Quick start for the next session
> "Network is open for MiniMax/ElevenLabs and the keys are set. On branch
> `claude/laughing-allen-BhjiF`, generate real narration + AI music for
> LHopital and re-render."
