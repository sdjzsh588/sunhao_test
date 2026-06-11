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
import { resumeV5 } from "./config/resume";
import { fadeIn, sectionOpacity, slideIn } from "../../utils/animations";
import { HookCard } from "./sections/HookCard";
import { ToolIntroV3 } from "./sections/StepSection";
import { BulletRewrite } from "./sections/BulletRewrite";
import { CutoutBeat } from "./sections/CutoutBeat";
import { TerminalStream } from "./sections/TerminalStream";
import { CallToAction } from "./sections/CallToAction";
import { SeriesBadge } from "./sections/SeriesBadge";

// EP05 format: hook → tool → usage (plain-language trigger) → bullet rewrite →
// full-page before/after → skills wall → recap → CTA. Matches voiceover order.
const SECTION_FLOOR = [120, 150, 240, 300, 240, 210, 180, 120];
const HEAD_PAD = 8;
const TAIL_PAD = [18, 30, 34, 36, 30, 30, 30, 22];

const USAGE_LINES = [
  {
    text: "第①步 GitHub 搜 ResumeSkills，下载技能包",
    kind: "muted" as const,
    pause: 22,
  },
  {
    text: "第②步 丢给 Claude（设置 → 技能 → 添加）",
    kind: "muted" as const,
    pause: 22,
  },
  { text: "第③步 说人话：", kind: "muted" as const, pause: 10 },
  {
    text: "帮我优化简历，目标岗位：高级新媒体运营",
    kind: "cmd" as const,
    pause: 16,
  },
  { text: "✓ resume-bullet-writer 技能已自动激活", kind: "ok" as const },
];

type Cfg = typeof resumeV5;

export type Props = {
  config: Cfg;
  sceneDurations: number[];
  voiceoverFiles: (string | null)[];
  bgmFile: string | null;
};

export const defaultProps: Props = {
  config: resumeV5,
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
          怎么用？说人话
        </div>
        <div style={{ fontSize: 36, color: COLORS.textMuted, marginTop: 12 }}>
          不用记命令 · 技能自动激活
        </div>
      </div>
      <TerminalStream lines={USAGE_LINES} />
    </AbsoluteFill>
  );
};

const SkillsWall: React.FC<{ wall: string[]; dur: number }> = ({
  wall,
  dur,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        gap: 52,
        opacity: sectionOpacity(frame, dur),
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0, 12) }}>
        <div style={{ fontSize: 32, color: COLORS.accent, fontWeight: 800, letterSpacing: 2 }}>
          不止改简历
        </div>
        <div style={{ fontSize: 62, fontWeight: 900, color: COLORS.text, marginTop: 8 }}>
          求职全流程，一套全包
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 24,
          width: 880,
        }}
      >
        {wall.map((s, i) => (
          <div
            key={i}
            style={{
              fontSize: 46,
              fontWeight: 800,
              color: COLORS.text,
              background: "#15191e",
              border: `1px solid #2a3138`,
              borderLeft: `8px solid ${COLORS.accent}`,
              borderRadius: 18,
              padding: "26px 34px",
              transform: `translateY(${slideIn(frame, 8 + i * 4, 16, 50)}px)`,
              opacity: fadeIn(frame, 8 + i * 4, 12),
            }}
          >
            {s}
          </div>
        ))}
      </div>
      <div
        style={{
          fontSize: 36,
          color: COLORS.textMuted,
          opacity: fadeIn(frame, 8 + wall.length * 4 + 8, 12),
        }}
      >
        …共 20 个技能 · 开源免费
      </div>
    </AbsoluteFill>
  );
};

const Recap: React.FC<{ config: Cfg; dur: number }> = ({ config, dur }) => {
  const frame = useCurrentFrame();
  const REASONS = ["免费开源", "说人话就能用", "简历脱胎换骨"];
  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
        gap: 54,
        opacity: sectionOpacity(frame, dur),
        fontFamily: FONT,
      }}
    >
      <div style={{ textAlign: "center", opacity: fadeIn(frame, 0, 12) }}>
        <div style={{ fontSize: 62, fontWeight: 900, color: COLORS.text }}>
          求职季，值得装
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 26,
          justifyContent: "center",
          maxWidth: 900,
        }}
      >
        {REASONS.map((r, i) => (
          <div
            key={i}
            style={{
              fontSize: 50,
              fontWeight: 900,
              color: "#000",
              background: COLORS.accent,
              borderRadius: 999,
              padding: "20px 50px",
              transform: `translateY(${slideIn(frame, 6 + i * 5, 18, 60)}px)`,
              opacity: fadeIn(frame, 6 + i * 5, 14),
              boxShadow: `0 0 40px ${COLORS.highlight}`,
            }}
          >
            {r}
          </div>
        ))}
      </div>
      <Img
        src={staticFile(config.page.after)}
        style={{
          width: 430,
          borderRadius: 16,
          border: `2px solid ${COLORS.accent}`,
          transform: `translateY(${slideIn(frame, 22, 18, 60)}px)`,
          opacity: fadeIn(frame, 22, 14),
          boxShadow: `0 18px 50px rgba(0,0,0,0.5)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const ResumePromo: React.FC<Props> = ({
  config,
  sceneDurations,
  voiceoverFiles,
  bgmFile,
}) => {
  const { script } = config;

  const sections: React.ReactNode[] = [
    <HookCard text={script.hook} dur={sceneDurations[0]} />,
    <ToolIntroV3 config={config} dur={sceneDurations[1]} />,
    <UsageCard dur={sceneDurations[2]} />,
    <BulletRewrite bullets={config.bullets} dur={sceneDurations[3]} />,
    <CutoutBeat
      label="原版 → 优化后"
      kicker="整页对比"
      before={config.page.before}
      after={config.page.after}
      beforeTag="原版"
      afterTag="优化后"
      aspect={config.page.aspect}
      width={880}
      index={1}
      dur={sceneDurations[4]}
    />,
    <SkillsWall wall={config.wall} dur={sceneDurations[5]} />,
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
