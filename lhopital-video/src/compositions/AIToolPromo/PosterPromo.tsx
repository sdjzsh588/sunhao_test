import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { getAudioDuration } from "../../voiceover/get-audio-duration";
import { COLORS, FONT, FPS, H, W } from "./styles";
import { canvasDesignV3 } from "./config/canvas-design";
import { fadeIn, sectionOpacity } from "../../utils/animations";
import { HookCard } from "./sections/HookCard";
import { ToolIntroV3 } from "./sections/StepSection";
import { PosterBeat } from "./sections/PosterBeat";
import { TerminalStream } from "./sections/TerminalStream";
import { SlidesGrid } from "./sections/SlidesGrid";
import { CallToAction } from "./sections/CallToAction";
import { SeriesBadge } from "./sections/SeriesBadge";

// EP03 format: hook → tool card → usage (install + how) → 4 × (brief types →
// poster prints up) → recap grid → CTA. Order matches the config's voiceover[].
const SECTION_FLOOR = [120, 150, 240, 210, 210, 210, 210, 180, 120];
const HEAD_PAD = 8;
const TAIL_PAD = [18, 30, 34, 40, 40, 40, 40, 30, 22];

// Real install + invocation of the canvas-design skill — how, not just effect.
const USAGE_LINES = [
  { text: "/plugin marketplace add anthropics/skills", kind: "cmd" as const },
  { text: "✓ 已添加官方技能市场", kind: "ok" as const, pause: 12 },
  {
    text: "/plugin install example-skills@anthropic-agent-skills",
    kind: "cmd" as const,
  },
  { text: "✓ 已装好 canvas-design", kind: "ok" as const, pause: 16 },
  { text: "然后——直接说你要什么海报就行", kind: "muted" as const },
];

const UsageCard: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "70px 60px",
        gap: 40,
        opacity: sectionOpacity(frame, dur),
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0, 12) }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: COLORS.text }}>
          怎么用？两步
        </div>
        <div style={{ fontSize: 36, color: COLORS.textMuted, marginTop: 12 }}>
          装好 · 然后张口就来
        </div>
      </div>
      <TerminalStream lines={USAGE_LINES} />
    </AbsoluteFill>
  );
};

type Cfg = typeof canvasDesignV3;

export type Props = {
  config: Cfg;
  sceneDurations: number[];
  voiceoverFiles: (string | null)[];
  bgmFile: string | null;
};

export const defaultProps: Props = {
  config: canvasDesignV3,
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

// Recap: all four posters side by side — "none of these is a template".
const Recap: React.FC<{ config: Cfg; dur: number }> = ({ config, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 70,
        gap: 50,
        opacity: sectionOpacity(frame, dur),
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0, 12) }}>
        <div style={{ fontSize: 62, fontWeight: 900, color: COLORS.text }}>
          四张图 · 四种风格
        </div>
        <div style={{ fontSize: 38, color: COLORS.textMuted, marginTop: 12 }}>
          没有一张套模板
        </div>
      </div>
      <SlidesGrid
        slides={config.beats.map((b) => b.poster)}
        aspect={1080 / 1440}
        width={920}
      />
    </AbsoluteFill>
  );
};

export const PosterPromo: React.FC<Props> = ({
  config,
  sceneDurations,
  voiceoverFiles,
  bgmFile,
}) => {
  const { script, beats } = config;

  const sections: React.ReactNode[] = [
    <HookCard text={script.hook} dur={sceneDurations[0]} />,
    <ToolIntroV3 config={config} dur={sceneDurations[1]} />,
    <UsageCard dur={sceneDurations[2]} />,
    ...beats.map((beat, i) => (
      <PosterBeat
        prompt={beat.prompt}
        poster={beat.poster}
        index={i}
        dur={sceneDurations[3 + i]}
      />
    )),
    <Recap config={config} dur={sceneDurations[7]} />,
    <CallToAction text={script.cta} dur={sceneDurations[8]} />,
  ];

  return (
    <AbsoluteFill style={{ background: "#0a0a0a" }}>
      <Series>
        {sections.map((el, i) => (
          <Series.Sequence key={i} durationInFrames={sceneDurations[i]}>
            {el}
            {voiceoverFiles[i] ? (
              <Sequence from={HEAD_PAD}>
                <Audio src={staticFile(voiceoverFiles[i] as string)} volume={3.6} />
              </Sequence>
            ) : null}
          </Series.Sequence>
        ))}
      </Series>
      <SeriesBadge tag={config.seriesTag} episode={config.episode} />
      {bgmFile ? <Audio src={staticFile(bgmFile)} loop volume={0.27} /> : null}
    </AbsoluteFill>
  );
};
