import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Sequence,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Background } from "./components";
import { Title } from "./scenes/Title";
import { Problem } from "./scenes/Problem";
import { Rule } from "./scenes/Rule";
import { Conditions } from "./scenes/Conditions";
import { Example } from "./scenes/Example";
import { Outro } from "./scenes/Outro";
import { VOICEOVER, VOICEOVER_EXTS, voiceoverPath } from "./voiceover/script";
import { getAudioDuration } from "./voiceover/get-audio-duration";

export const FPS = 30;
export const TRANSITION = 18; // crossfade / slide length between scenes

// Minimum scene lengths (frames). When narration is present, each scene grows
// to fit its audio; these floors just guarantee the on-screen animations have
// room to finish. The no-voiceover fallback uses these as-is.
const MIN_SCENE = [180, 450, 510, 420, 690, 270];
const MIN_SCENE_VO = [90, 170, 180, 160, 360, 130];

const HEAD_PAD = 12; // lead-in before a scene's narration starts
const TAIL_PAD = 24; // breathing room after narration ends

const SCENES = [Title, Problem, Rule, Conditions, Example, Outro];
const PRESENTATIONS = [
  fade(),
  slide({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  fade(),
];

export type Props = {
  sceneDurations: number[];
  voiceoverFiles: string[] | null;
};

export const defaultProps: Props = {
  sceneDurations: MIN_SCENE,
  voiceoverFiles: null,
};

const totalFromScenes = (scenes: number[]) =>
  scenes.reduce((a, b) => a + b, 0) - TRANSITION * (scenes.length - 1);

// Find the first existing audio file for a scene (wav from espeak, mp3 from
// ElevenLabs) and return its path + duration, or null if none is present.
const resolveLine = async (id: string) => {
  for (const ext of VOICEOVER_EXTS) {
    const file = voiceoverPath(id, ext);
    const dur = await getAudioDuration(staticFile(file));
    if (dur) return { file, dur };
  }
  return null;
};

// Size each scene to its narration (when available); otherwise fall back to the
// fixed minimums so the video still renders without any audio files.
export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const resolved = await Promise.all(VOICEOVER.map((l) => resolveLine(l.id)));
  const hasVoiceover = resolved.every((r) => r !== null);

  const sceneDurations = hasVoiceover
    ? resolved.map((r, i) =>
        Math.max(Math.ceil(r!.dur * FPS) + HEAD_PAD + TAIL_PAD, MIN_SCENE_VO[i]),
      )
    : MIN_SCENE;

  return {
    durationInFrames: totalFromScenes(sceneDurations),
    props: {
      sceneDurations,
      voiceoverFiles: hasVoiceover ? resolved.map((r) => r!.file) : null,
    },
  };
};

const timing = linearTiming({ durationInFrames: TRANSITION });

// Background music: fade in, sit low under narration, fade out at the end.
const bgmVolume = (total: number, hasVoiceover: boolean) => (f: number) => {
  const base = hasVoiceover ? 0.09 : 0.2;
  const fadeIn = 30;
  const fadeOut = 45;
  let v = base;
  if (f < fadeIn) v *= f / fadeIn;
  if (f > total - fadeOut) v *= Math.max(0, (total - f) / fadeOut);
  return v;
};

export const MyComposition: React.FC<Props> = ({
  sceneDurations,
  voiceoverFiles,
}) => {
  const total = totalFromScenes(sceneDurations);

  const children: React.ReactNode[] = [];
  SCENES.forEach((SceneComp, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneDurations[i]}>
        <SceneComp />
        {voiceoverFiles ? (
          <Sequence from={HEAD_PAD}>
            <Audio src={staticFile(voiceoverFiles[i])} />
          </Sequence>
        ) : null}
      </TransitionSeries.Sequence>,
    );
    if (i < SCENES.length - 1) {
      children.push(
        <TransitionSeries.Transition
          key={`t${i}`}
          presentation={PRESENTATIONS[i]}
          timing={timing}
        />,
      );
    }
  });

  return (
    <AbsoluteFill>
      <Background />
      <TransitionSeries>{children}</TransitionSeries>
      <Audio
        src={staticFile("bgm.wav")}
        loop
        loopVolumeCurveBehavior="extend"
        volume={bgmVolume(total, voiceoverFiles !== null)}
      />
    </AbsoluteFill>
  );
};
