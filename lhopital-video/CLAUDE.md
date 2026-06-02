# lhopital-video — conventions

Remotion project (videos written in React). Audio runbook: `AUDIO.md`.
Session handoff: `HANDOFF.md`.

## Video creation — always use the `remotion-best-practices` skill

When creating or editing any video/composition/scene in this project, use the
**`remotion-best-practices`** skill (`.claude/skills/remotion-best-practices/`)
for the domain knowledge. In particular:

- Animate with `useCurrentFrame()` + `interpolate()` / `spring()`. **CSS
  transitions/animations and Tailwind `animate-` classes are FORBIDDEN** — they
  do not render correctly.
- Put assets in `public/` and reference them with `staticFile()`.
- Use `<Audio>`/`<Video>`/`<Img>` from Remotion / `@remotion/media`.
- Set duration/dimensions in `src/Root.tsx`, or dynamically via
  `calculateMetadata`.

## Narration + background music — use the `minimax-voiceover-music` skill

For generating Mandarin narration and instrumental BGM (MiniMax) and
re-rendering, use the **`minimax-voiceover-music`** skill
(`.claude/skills/minimax-voiceover-music/`).
