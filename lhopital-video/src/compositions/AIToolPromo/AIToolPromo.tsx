import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Sequence,
  Series,
  staticFile,
} from "remotion";
import { Audio } from "@remotion/media";
import { getAudioDuration } from "../../voiceover/get-audio-duration";
import { FPS, H, W } from "./styles";
import { napkinV3 } from "./config/napkin-v3";
import type { AIToolConfigV3 } from "./config/types";
import { HookCard } from "./sections/HookCard";
import { StepSection, ToolIntroV3 } from "./sections/StepSection";
import { Comparison } from "./sections/Comparison";
import { CallToAction } from "./sections/CallToAction";

// Section order: hook, tool name, step1-4, compare, cta.
// Minimum lengths (frames); sections grow to fit their narration clip. The 3
// video steps (indices 3-5) are held ~2.5s longer so the clip plays out.
const SECTION_FLOOR = [150, 150, 150, 225, 225, 225, 150, 120];
const HEAD_PAD = 8;
// Hold after narration ends — a bit longer on the step sections so the GIF can
// play a full action before cutting.
const TAIL_PAD = [18, 34, 36, 40, 40, 40, 26, 22];

export type Props = {
  config: AIToolConfigV3;
  sceneDurations: number[];
  voiceoverFiles: (string | null)[];
  bgmFile: string | null;
};

export const defaultProps: Props = {
  config: napkinV3,
  sceneDurations: SECTION_FLOOR,
  voiceoverFiles: [],
  bgmFile: null,
};

export const calculateMetadata: CalculateMetadataFunction<Props> = async ({
  props,
}) => {
  const { config } = props;
  const files = config.voiceover.map(
    (l) => `aitool/${config.slug}/voiceover/${l.id}.mp3`,
  );
  const durations = await Promise.all(
    files.map((f) => getAudioDuration(staticFile(f))),
  );

  const sceneDurations = SECTION_FLOOR.map((floor, i) => {
    const d = durations[i];
    return d
      ? Math.max(Math.ceil(d * FPS) + HEAD_PAD + TAIL_PAD[i], floor)
      : floor;
  });

  const bgm = await getAudioDuration(staticFile(config.musicUrl));

  return {
    durationInFrames: sceneDurations.reduce((a, b) => a + b, 0),
    fps: FPS,
    width: W,
    height: H,
    props: {
      ...props,
      sceneDurations,
      voiceoverFiles: durations.map((d, i) => (d ? files[i] : null)),
      bgmFile: bgm ? config.musicUrl : null,
    },
  };
};

export const AIToolPromo: React.FC<Props> = ({
  config,
  sceneDurations,
  voiceoverFiles,
  bgmFile,
}) => {
  const { script, steps, mediaReady } = config;

  const sections: React.ReactNode[] = [
    <HookCard text={script.hook} dur={sceneDurations[0]} />,
    <ToolIntroV3 config={config} dur={sceneDurations[1]} />,
    ...steps.map((step, i) => (
      <StepSection step={step} index={i} dur={sceneDurations[2 + i]} ready={mediaReady} />
    )),
    <Comparison before={script.before} after={script.after} dur={sceneDurations[6]} />,
    <CallToAction text={script.cta} dur={sceneDurations[7]} />,
  ];

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <Series>
        {sections.map((el, i) => (
          <Series.Sequence key={i} durationInFrames={sceneDurations[i]}>
            {el}
            {voiceoverFiles[i] ? (
              <Sequence from={HEAD_PAD}>
                <Audio src={staticFile(voiceoverFiles[i] as string)} />
              </Sequence>
            ) : null}
          </Series.Sequence>
        ))}
      </Series>
      {bgmFile ? <Audio src={staticFile(bgmFile)} loop volume={0.15} /> : null}
    </AbsoluteFill>
  );
};
