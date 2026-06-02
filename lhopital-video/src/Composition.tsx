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
import { VOICEOVER, voiceoverFile } from "./voiceover/script";
import { getAudioDuration } from "./voiceover/get-audio-duration";

export const FPS = 30;
export const TRANSITION = 18; // crossfade / slide length between scenes

// Minimum scene lengths (frames) so the on-screen animations always fit,
// even when narration is shorter. Used as-is when no voiceover is present.
const MIN_SCENE = [180, 450, 510, 420, 690, 270];

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
  hasVoiceover: boolean;
};

export const defaultProps: Props = {
  sceneDurations: MIN_SCENE,
  hasVoiceover: false,
};

const totalFromScenes = (scenes: number[]) =>
  scenes.reduce((a, b) => a + b, 0) - TRANSITION * (scenes.length - 1);

// Size each scene to its narration (when available); otherwise fall back to the
// fixed minimums so the video still renders without any audio files.
export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const durations = await Promise.all(
    VOICEOVER.map((line) =>
      getAudioDuration(staticFile(voiceoverFile(line.id))),
    ),
  );

  const hasVoiceover = durations.every((d) => d !== null);

  const sceneDurations = hasVoiceover
    ? durations.map((sec, i) =>
        Math.max(
          Math.ceil((sec as number) * FPS) + HEAD_PAD + TAIL_PAD,
          MIN_SCENE[i],
        ),
      )
    : MIN_SCENE;

  return {
    durationInFrames: totalFromScenes(sceneDurations),
    props: { sceneDurations, hasVoiceover },
  };
};

const timing = linearTiming({ durationInFrames: TRANSITION });

// Background music: fade in, sit low under narration, fade out at the end.
const bgmVolume = (total: number, hasVoiceover: boolean) => (f: number) => {
  const base = hasVoiceover ? 0.1 : 0.2;
  const fadeIn = 30;
  const fadeOut = 45;
  let v = base;
  if (f < fadeIn) v *= f / fadeIn;
  if (f > total - fadeOut) v *= Math.max(0, (total - f) / fadeOut);
  return v;
};

export const MyComposition: React.FC<Props> = ({
  sceneDurations,
  hasVoiceover,
}) => {
  const total = totalFromScenes(sceneDurations);

  const children: React.ReactNode[] = [];
  SCENES.forEach((SceneComp, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneDurations[i]}>
        <SceneComp />
        {hasVoiceover ? (
          <Sequence from={HEAD_PAD}>
            <Audio src={staticFile(voiceoverFile(VOICEOVER[i].id))} />
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
        volume={bgmVolume(total, hasVoiceover)}
      />
    </AbsoluteFill>
  );
};
