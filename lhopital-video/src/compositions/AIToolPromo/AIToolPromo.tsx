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
import { napkinConfig } from "./config/napkin";
import type { AIToolConfig } from "./config/types";
import { HookCard } from "./sections/HookCard";
import { ToolIntro } from "./sections/ToolIntro";
import { KeyPoint } from "./sections/KeyPoint";
import { Comparison } from "./sections/Comparison";
import { CallToAction } from "./sections/CallToAction";

// Per-section minimum lengths (frames) — the 30s storyboard's pacing. Sections
// grow to fit their narration clip but never drop below these floors.
const SECTION_FLOOR = [90, 150, 150, 150, 150, 150, 66];
const HEAD_PAD = 6; // lead-in before a section's narration starts
const TAIL_PAD = 12; // beat after narration ends

export type Props = {
  config: AIToolConfig;
  sceneDurations: number[];
  voiceoverFiles: (string | null)[];
  bgmFile: string | null;
};

export const defaultProps: Props = {
  config: napkinConfig,
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
    return d ? Math.max(Math.ceil(d * FPS) + HEAD_PAD + TAIL_PAD, floor) : floor;
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
  const { script } = config;
  const [hook, tool, p1, p2, p3, compare, cta] = sceneDurations;

  // (section element, frames) in play order.
  const sections: [React.ReactNode, number][] = [
    [<HookCard text={script.hook} dur={hook} />, hook],
    [<ToolIntro config={config} dur={tool} />, tool],
    [<KeyPoint point={script.points[0]} index={0} config={config} dur={p1} />, p1],
    [<KeyPoint point={script.points[1]} index={1} config={config} dur={p2} />, p2],
    [<KeyPoint point={script.points[2]} index={2} config={config} dur={p3} />, p3],
    [<Comparison config={config} dur={compare} />, compare],
    [<CallToAction text={script.cta} dur={cta} />, cta],
  ];

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <Series>
        {sections.map(([el, frames], i) => (
          <Series.Sequence key={i} durationInFrames={frames}>
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
