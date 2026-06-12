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
import {
  SPCrisis,
  SPDecision,
  SPEmptyCity,
  SPOutro,
  SPRetreat,
  SPTitle,
} from "./yeshi/scenesPro";
import { KONGCHENG_VOICEOVER, kongchengVoiceoverPath } from "./yeshi/script";
import { VOICEOVER_EXTS } from "./voiceover/script";
import { getAudioDuration } from "./voiceover/get-audio-duration";

export const FPS = 30;
const TRANSITION = 24;

const SCENES = [SPTitle, SPCrisis, SPDecision, SPEmptyCity, SPRetreat, SPOutro];

// Floors (frames). Scenes grow to fit narration but never drop below these.
const SCENE_FLOOR = [300, 360, 360, 360, 420, 390];

const HEAD_PAD = 16;
const TAIL_PAD = 28;

const PRESENTATIONS = [fade(), fade(), fade(), fade(), fade()];

const BGM_CANDIDATES = ["bgm-guqin.mp3", "bgm.mp3", "bgm.wav"];

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

const resolveLine = async (id: string) => {
  for (const ext of VOICEOVER_EXTS) {
    const file = kongchengVoiceoverPath(id, ext);
    const dur = await getAudioDuration(staticFile(file));
    if (dur) return { file, dur };
  }
  return null;
};

export const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const resolved = await Promise.all(
    KONGCHENG_VOICEOVER.map((l) => resolveLine(l.id)),
  );
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

const bgmVolume = (total: number, hasVoiceover: boolean) => (f: number) => {
  const base = hasVoiceover ? 0.12 : 0.5;
  const fadeIn = 36;
  const fadeOut = 50;
  let v = base;
  if (f < fadeIn) v *= f / fadeIn;
  if (f > total - fadeOut) v *= Math.max(0, (total - f) / fadeOut);
  return v;
};

export const KongchengProComposition: React.FC<Props> = ({
  sceneDurations,
  voiceoverFiles,
  bgmFile,
}) => {
  const total = totalFromScenes(sceneDurations);

  const children: React.ReactNode[] = [];
  SCENES.forEach((SceneComp, i) => {
    children.push(
      <TransitionSeries.Sequence key={`s${i}`} durationInFrames={sceneDurations[i]}>
        <SceneComp dur={sceneDurations[i]} />
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
