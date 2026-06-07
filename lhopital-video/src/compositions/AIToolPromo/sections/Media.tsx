import React from "react";
import { Img, staticFile } from "remotion";
import { Video } from "@remotion/media";
import { COLORS, SIZES } from "../styles";
import type { Highlight as HL } from "../config/types";

// A neon-framed media box that shows a JPG (Img) or a looping MP4 (Video) at its
// native aspect ratio (no crop), so highlight coords map 1:1 to the media.
// (MP4 instead of GIF: GIFs of this size decode every frame into RAM and OOM
// the render; MP4 is decoded on demand.)
export const MediaFrame: React.FC<{
  src: string;
  aspect: number;
  width?: number;
  highlight?: HL;
  highlightScale?: number;
  ready?: boolean;
  style?: React.CSSProperties;
}> = ({ src, aspect, width = 980, highlight, highlightScale = 1, ready = true, style }) => {
  const height = Math.round(width / aspect);
  const isVideo = src.toLowerCase().endsWith(".mp4");

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: SIZES.radius,
        overflow: "hidden",
        border: `2px solid ${COLORS.accent}`,
        boxShadow: `0 0 50px ${COLORS.highlight}, 0 26px 70px rgba(0,0,0,0.6)`,
        background: COLORS.bgPanel,
        ...style,
      }}
    >
      {!ready ? null : isVideo ? (
        <Video
          src={staticFile(src)}
          loop
          volume={0}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <Img
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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
