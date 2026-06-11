import React from "react";
import {
  AbsoluteFill,
  CalculateMetadataFunction,
  Img,
  Sequence,
  Series,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { getAudioDuration } from "../../voiceover/get-audio-duration";
import { COLORS, FONT, FPS, H, W } from "./styles";
import { rembgV4 } from "./config/rembg";
import { fadeIn, sectionOpacity, slideIn } from "../../utils/animations";
import { HookCard } from "./sections/HookCard";
import { ToolIntroV3 } from "./sections/StepSection";
import { CutoutBeat } from "./sections/CutoutBeat";
import { BatchBeat } from "./sections/BatchBeat";
import { TerminalStream } from "./sections/TerminalStream";
import { CallToAction } from "./sections/CallToAction";
import { SeriesBadge } from "./sections/SeriesBadge";

// EP04 format: hook → tool → usage → 2 single before/afters → batch wall
// (the differentiator) → recap chips → CTA. Order matches config.voiceover[].
const SECTION_FLOOR = [120, 150, 240, 240, 240, 270, 180, 120];
const HEAD_PAD = 8;
const TAIL_PAD = [18, 30, 34, 30, 30, 36, 30, 22];

const USAGE_LINES = [
  { text: "pip install rembg", kind: "cmd" as const },
  { text: "✓ 已安装 · 开源免费 · 全平台", kind: "ok" as const, pause: 12 },
  { text: "rembg i 原图.jpg 抠好.png", kind: "cmd" as const },
  { text: "✓ 背景已移除 · 本地运行，照片不上传", kind: "ok" as const, pause: 14 },
  { text: "无水印 · 不限张数 · 不用开会员", kind: "muted" as const },
];

type Cfg = typeof rembgV4;

export type Props = {
  config: Cfg;
  sceneDurations: number[];
  voiceoverFiles: (string | null)[];
  bgmFile: string | null;
};

export const defaultProps: Props = {
  config: rembgV4,
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
          怎么用？一行
        </div>
        <div style={{ fontSize: 36, color: COLORS.textMuted, marginTop: 12 }}>
          装好 · 一句命令搞定
        </div>
      </div>
      <TerminalStream lines={USAGE_LINES} />
    </AbsoluteFill>
  );
};

const REASONS = ["免费", "无水印", "本地运行", "批量随便跑"];

const Recap: React.FC<{ config: Cfg; dur: number }> = ({ config, dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        gap: 56,
        opacity: sectionOpacity(frame, dur),
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0, 12) }}>
        <div style={{ fontSize: 62, fontWeight: 900, color: COLORS.text }}>
          装它的理由
        </div>
        <div style={{ fontSize: 38, color: COLORS.textMuted, marginTop: 12 }}>
          手机 App 给不了的
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 26,
          justifyContent: "center",
          maxWidth: 880,
        }}
      >
        {REASONS.map((r, i) => (
          <div
            key={i}
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "#000",
              background: COLORS.accent,
              borderRadius: 999,
              padding: "20px 52px",
              transform: `translateY(${slideIn(frame, 6 + i * 5, 18, 60)}px)`,
              opacity: fadeIn(frame, 6 + i * 5, 14),
              boxShadow: `0 0 40px ${COLORS.highlight}`,
            }}
          >
            {r}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 18, justifyContent: "center" }}>
        {config.beats.map((b, i) => (
          <Img
            key={i}
            src={staticFile(b.after)}
            style={{
              width: 230,
              borderRadius: 16,
              border: `1px solid #2c2c2c`,
              transform: `translateY(${slideIn(frame, 18 + i * 4, 18, 60)}px)`,
              opacity: fadeIn(frame, 18 + i * 4, 14),
              boxShadow: `0 18px 50px rgba(0,0,0,0.5)`,
            }}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const CutoutPromo: React.FC<Props> = ({
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
      <CutoutBeat
        label={beat.label}
        before={beat.before}
        after={beat.after}
        beforeTag={beat.beforeTag}
        afterTag={beat.afterTag}
        index={i}
        dur={sceneDurations[3 + i]}
      />
    )),
    <BatchBeat
      cmd={config.batch.cmd}
      cutouts={config.batch.cutouts}
      dur={sceneDurations[5]}
    />,
    <Recap config={config} dur={sceneDurations[6]} />,
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
                <Audio src={staticFile(voiceoverFiles[i] as string)} volume={3.6} />
              </Sequence>
            ) : null}
          </Series.Sequence>
        ))}
      </Series>
      <SeriesBadge tag={config.seriesTag} episode={config.episode} />
      {bgmFile ? <Audio src={staticFile(bgmFile)} loop volume={0.3} /> : null}
    </AbsoluteFill>
  );
};
