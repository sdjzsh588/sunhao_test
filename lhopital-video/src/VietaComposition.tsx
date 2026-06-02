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
import { VTitle } from "./vieta/Title";
import { VSetup } from "./vieta/Setup";
import { VTheorem } from "./vieta/Theorem";
import { VSpecial } from "./vieta/Special";
import { VExample } from "./vieta/Example";
import { VOutro } from "./vieta/Outro";
import { VIETA_VOICEOVER, vietaVoiceoverPath } from "./vieta/script";
import { VOICEOVER_EXTS } from "./voiceover/script";
import { getAudioDuration } from "./voiceover/get-audio-duration";

export const FPS = 30;
const TRANSITION = 18;

const SCENES = [VTitle, VSetup, VTheorem, VSpecial, VExample, VOutro];

// Hand-tuned scene lengths (frames). The scene animations are timed against
// these, so they double as floors: when narration is present a scene only ever
// grows to fit its audio, never shrinks below the designed length.
const SCENE_FLOOR = [165, 360, 480, 360, 600, 240];

const HEAD_PAD = 12; // lead-in before a scene's narration starts
const TAIL_PAD = 24; // breathing room after narration ends

const PRESENTATIONS = [
  fade(),
  slide({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  slide({ direction: "from-right" }),
  fade(),
];

const BGM_CANDIDATES = ["bgm.mp3", "bgm.wav"];

export type Props = {
  sceneDurations: number[];
  voiceoverFiles: string[] | null;
  bgmFile: string;
};

export const defaultProps: Props = {
  sceneDurations: SCENE_FLOOR,
  voiceoverFiles: null,
  bgmFile: "bgm.wav",
};

const totalFromScenes = (scenes: number[]) =>
  scenes.reduce((a, b) => a + b, 0) - TRANSITION * (scenes.length - 1);

// First existing audio file for a scene (mp3 from the MiniMax/ElevenLabs APIs,
// preferred over any wav), with its duration — or null if none is present.
const resolveLine = async (id: string) => {
  for (const ext of VOICEOVER_EXTS) {
    const file = vietaVoiceoverPath(id, ext);
    const dur = await getAudioDuration(staticFile(file));
    if (dur) return { file, dur };
  }
  return null;
};

// Size each scene to its narration when available (never below the designed
// floor); otherwise use the floors as-is so the video renders without audio.
export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const resolved = await Promise.all(VIETA_VOICEOVER.map((l) => resolveLine(l.id)));
  const hasVoiceover = resolved.every((r) => r !== null);

  let bgmFile = "bgm.wav";
  for (const candidate of BGM_CANDIDATES) {
    if (await getAudioDuration(staticFile(candidate))) {
      bgmFile = candidate;
      break;
    }
  }

  const sceneDurations = hasVoiceover
    ? resolved.map((r, i) =>
        Math.max(Math.ceil(r!.dur * FPS) + HEAD_PAD + TAIL_PAD, SCENE_FLOOR[i]),
      )
    : SCENE_FLOOR;

  return {
    durationInFrames: totalFromScenes(sceneDurations),
    props: {
      sceneDurations,
      voiceoverFiles: hasVoiceover ? resolved.map((r) => r!.file) : null,
      bgmFile,
    },
  };
};

const timing = linearTiming({ durationInFrames: TRANSITION });

// Background music: fade in, sit quietly under narration, fade out at the end.
const bgmVolume = (total: number, hasVoiceover: boolean) => (f: number) => {
  const base = hasVoiceover ? 0.1 : 0.5;
  const fadeIn = 30;
  const fadeOut = 45;
  let v = base;
  if (f < fadeIn) v *= f / fadeIn;
  if (f > total - fadeOut) v *= Math.max(0, (total - f) / fadeOut);
  return v;
};

export const VietaComposition: React.FC<Props> = ({
  sceneDurations,
  voiceoverFiles,
  bgmFile,
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
        src={staticFile(bgmFile)}
        loop
        loopVolumeCurveBehavior="extend"
        volume={bgmVolume(total, voiceoverFiles !== null)}
      />
    </AbsoluteFill>
  );
};
