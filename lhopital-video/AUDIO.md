# Audio: narration + background music

The video resolves its audio automatically — whatever files exist are used, and
the composition is resized to the narration length. You can mix and match.

| Layer | File(s) | Generators (pick one) |
| ----- | ------- | --------------------- |
| Narration | `public/voiceover/lhopital/<id>.{wav,mp3}` | Piper (offline) · ElevenLabs · espeak-ng |
| Music | `public/bgm.mp3` (preferred) or `public/bgm.wav` | ElevenLabs Music · synthesized WAV |

## ElevenLabs (one API for both — recommended)

Narration and music use the **same host and key**:

- host: `api.elevenlabs.io`  (allow this in the environment's Network access)
- key: `ELEVENLABS_API_KEY`

```bash
export ELEVENLABS_API_KEY=sk_...
# optional Chinese voice id from your ElevenLabs account:
# export ELEVENLABS_VOICE_ID=...

node --experimental-strip-types generate-voiceover.ts   # -> public/voiceover/lhopital/*.mp3
node --experimental-strip-types generate-music.ts        # -> public/bgm.mp3

npx remotion render LHopital out/lhopital.mp4
```

mp3 narration overrides the wav files, and `bgm.mp3` overrides `bgm.wav`, so the
render picks up the ElevenLabs audio with no code changes.

## MiniMax (native Mandarin voice + music)

Different host and auth from ElevenLabs: it needs **two** values — an API key
(Bearer) **and** a GroupId. Allow `api.minimax.io` in Network access, then:

```bash
export MINIMAX_API_KEY=...
export MINIMAX_GROUP_ID=...
# optional Mandarin voice id from your MiniMax console:
# export MINIMAX_VOICE_ID="Chinese (Mandarin)_Warm_Bestie"

node --experimental-strip-types generate-voiceover-minimax.ts  # -> *.mp3 narration
node --experimental-strip-types generate-music-minimax.ts       # -> public/bgm.mp3

npx remotion render LHopital out/lhopital.mp4
```

Notes:
- TTS endpoint `POST /v1/t2a_v2`; music endpoint `POST /v1/music_generation`
  with `instrumental: true` (no vocals).
- MiniMax returns audio as a **hex-encoded** string inside JSON; the scripts
  decode it to mp3 for you.
- Music model defaults to `music-2.6-free`. China host alternative:
  `export MINIMAX_BASE=https://api.minimaxi.chat`.

## Offline fallbacks (no network / no API key)

```bash
# Narration: Piper neural TTS (natural). One-time model download is documented
# in scripts/make-voiceover-piper.ts.
node --experimental-strip-types scripts/make-voiceover-piper.ts

# Narration: espeak-ng (robotic, last resort)
node --experimental-strip-types scripts/make-voiceover-espeak.ts

# Music: synthesized lo-fi WAV
node scripts/make-bgm.mjs
```

## Rendering in this sandbox

Chromium isn't downloadable here, and font/asset hosts are TLS-intercepted, so
renders use the system browser and ignore cert errors:

```bash
npx remotion render LHopital out/lhopital.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
  --ignore-certificate-errors
```
