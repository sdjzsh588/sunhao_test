import { continueRender, delayRender, staticFile } from "remotion";

// Deterministic CJK font loading. The compositions set fontFamily
// "Noto Sans SC", but no such font existed in the render image — each headless
// worker fell back on its own timing, so text metrics (and line wraps)
// flickered between frames. Self-host the OTFs and block rendering until
// they're registered.
const load = (file: string, weight: string) => {
  const face = new FontFace(
    "Noto Sans SC",
    `url(${staticFile(`fonts/${file}`)}) format('opentype')`,
    { weight },
  );
  return face.load().then((f) => document.fonts.add(f));
};

if (typeof document !== "undefined") {
  const handle = delayRender("loading Noto Sans SC");
  Promise.all([
    load("NotoSansCJKsc-Regular.otf", "100 500"),
    load("NotoSansCJKsc-Bold.otf", "600 900"),
  ])
    .then(() => continueRender(handle))
    .catch((err) => {
      // Don't hang the render if the font fails — fall back to system fonts.
      console.error("Font load failed", err);
      continueRender(handle);
    });
}
