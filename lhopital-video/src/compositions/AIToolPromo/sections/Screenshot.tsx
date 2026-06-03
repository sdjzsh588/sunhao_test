import React from "react";
import { Img, staticFile } from "remotion";
import { COLORS, FONT, SIZES } from "../styles";
import type { Highlight as HL, ScreenshotKey } from "../config/types";
import type { AIToolConfig } from "../config/types";

const LABELS: Record<ScreenshotKey, string> = {
  homepage: "首页 Hero",
  entry: "入口 · 选择添加方式",
  input: "粘贴文字",
  result: "生成的信息图",
  styles: "风格面板 Brand Studio",
  export: "导出菜单",
  usecase: "使用场景",
};

// A framed screenshot. Shows the real PNG when `screenshotsReady`, otherwise a
// labeled placeholder so the layout/timing is fully previewable.
export const ScreenFrame: React.FC<{
  shot: ScreenshotKey;
  config: AIToolConfig;
  highlight?: HL;
  highlightScale?: number;
  style?: React.CSSProperties;
}> = ({ shot, config, highlight, highlightScale = 1, style }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: SIZES.radius,
        overflow: "hidden",
        border: `2px solid #2a2a2a`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        background: COLORS.bgPanel,
        aspectRatio: "16 / 10",
        ...style,
      }}
    >
      {config.screenshotsReady ? (
        <Img
          src={staticFile(config.screenshots[shot])}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
        />
      ) : (
        <Placeholder label={LABELS[shot]} file={config.screenshots[shot]} />
      )}

      {highlight ? (
        <div
          style={{
            position: "absolute",
            left: `${highlight.x * 100}%`,
            top: `${highlight.y * 100}%`,
            width: `${highlight.w * 100}%`,
            height: `${highlight.h * 100}%`,
            border: `4px solid ${COLORS.accent}`,
            borderRadius: 12,
            background: COLORS.highlight,
            boxShadow: `0 0 40px ${COLORS.accent}`,
            pointerEvents: "none",
            transform: `scale(${highlightScale})`,
            transformOrigin: "center",
          }}
        />
      ) : null}
    </div>
  );
};

const Placeholder: React.FC<{ label: string; file: string }> = ({ label, file }) => (
  <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
    {/* faux browser chrome */}
    <div
      style={{
        height: 54,
        background: "#1c1c1c",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 22px",
        borderBottom: "1px solid #2a2a2a",
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 16, height: 16, borderRadius: 8, background: c }} />
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        top: 54,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        backgroundImage:
          "repeating-linear-gradient(45deg, #161616 0px, #161616 18px, #141414 18px, #141414 36px)",
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.text }}>{label}</div>
      <div style={{ fontSize: 22, color: COLORS.textMuted }}>截图占位 · {file.split("/").pop()}</div>
    </div>
  </div>
);
