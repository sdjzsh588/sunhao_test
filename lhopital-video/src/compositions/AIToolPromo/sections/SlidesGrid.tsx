import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../styles";
import { popScale } from "../../../utils/animations";

// The real generated deck, shown as a 2-column grid of slide thumbnails that
// pop in one after another — "the whole deck, for real".
export const SlidesGrid: React.FC<{
  slides: string[];
  aspect: number;
  width?: number;
}> = ({ slides, aspect, width = 960 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gap = 18;
  const cellW = (width - gap) / 2;
  const cellH = Math.round(cellW / aspect);

  return (
    <div
      style={{
        width,
        display: "flex",
        flexWrap: "wrap",
        gap,
        justifyContent: "center",
      }}
    >
      {slides.map((src, i) => {
        const scale = popScale(frame, fps, 10 + i * 5, {
          damping: 11,
          stiffness: 130,
        });
        return (
          <div
            key={src}
            style={{
              width: cellW,
              height: cellH,
              borderRadius: 14,
              overflow: "hidden",
              border: "1px solid #2c2c2c",
              boxShadow: `0 0 30px ${COLORS.highlight}, 0 16px 40px rgba(0,0,0,0.55)`,
              transform: `scale(${scale})`,
            }}
          >
            <Img
              src={staticFile(src)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        );
      })}
    </div>
  );
};
