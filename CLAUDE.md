# Repository conventions

This repo contains a Remotion video project in **`lhopital-video/`** (videos
written in React, with MiniMax-generated narration + background music).

## Skill routing — ALWAYS follow this

When a request involves the video project, route to these skills:

| Task | Skill |
| ---- | ----- |
| Create/edit a **video**, composition, scene, animation, or timing | **`remotion-best-practices`** |
| Generate/regenerate **narration (配音) or background music (配乐)** with MiniMax and re-render | **`minimax-voiceover-music`** |

So "制作视频和对应的音频 / make a video and its audio" → use **both**:
`remotion-best-practices` for the composition, `minimax-voiceover-music` for the
narration + music + re-render.

The skill definitions live in `lhopital-video/.claude/skills/` (and are mirrored
at `.claude/skills/` in the repo root). If for any reason a skill is not listed
as available, read its `SKILL.md` directly and follow the documented steps.

## Project entry point

Most work happens in `lhopital-video/`. See `lhopital-video/CLAUDE.md`,
`lhopital-video/AUDIO.md`, and `lhopital-video/HANDOFF.md` for project details.
