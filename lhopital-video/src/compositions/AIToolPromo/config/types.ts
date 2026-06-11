// Shared types for the AIToolPromo composition. Every tool ships one config
// object of this shape (see config/napkin.ts) — no tool-specific strings live
// in the components.
export type Highlight = { x: number; y: number; w: number; h: number };

export type ToolPoint = {
  title: string;
  // Screenshot shown for this point (key of `screenshots`).
  shot: ScreenshotKey;
  // CSS object-position for the cover crop (e.g. "center", "center top").
  focus?: string;
  // Pan a tall screenshot (e.g. a full page) downward over the section.
  scroll?: boolean;
  // Slow push-in toward the highlight over the section.
  zoom?: boolean;
  // Optional highlight box, in 0..1 fractions of the screenshot.
  highlight?: Highlight;
  // Optional badge number override (defaults to point index + 1).
  badge?: number;
};

export type ScreenshotKey =
  | "homepage"
  | "entry"
  | "input"
  | "result"
  | "styles"
  | "export"
  | "usecase";

export type VoiceLine = { id: string; tts: string };

export type AIToolConfig = {
  script: {
    hook: string;
    toolName: string;
    value: string;
    points: ToolPoint[];
    before: string;
    after: string;
    cta: string;
  };
  // Narration, one clip per section (in play order). `tts` is the read-aloud
  // text; clips are generated to public/aitool/<slug>/voiceover/<id>.mp3.
  voiceover: VoiceLine[];
  // slug => folder under public/aitool/<slug>/ for this tool's assets.
  slug: string;
  // Screenshot filenames, resolved under public/.
  screenshots: Record<ScreenshotKey, string>;
  // Whether the real screenshots exist yet; false renders labeled placeholders.
  screenshotsReady: boolean;
  musicUrl: string;
};

// ---- v3: GIF-driven 4-step tutorial --------------------------------------

// One line of a streamed terminal step. "cmd" lines type out character by
// character; the rest fade in line by line. `pause` = extra frames to hold
// before the next line starts.
export type TermLine = {
  text: string;
  kind: "cmd" | "out" | "ok" | "muted";
  pause?: number;
};

export type MediaStep = {
  title: string;
  subtitle?: string;
  // Asset path under public/ (e.g. "aitool/napkin/2.gif"). .gif loops.
  // Unused when `terminal` or `slides` is set.
  media: string;
  // Intrinsic aspect ratio (width / height) of the asset.
  aspect: number;
  // Optional highlight box, in 0..1 fractions of the media.
  highlight?: Highlight;
  // Render a streaming terminal instead of the media asset.
  terminal?: TermLine[];
  // Render a staggered grid of slide images (paths under public/) instead.
  slides?: string[];
};

export type AIToolConfigV3 = {
  slug: string;
  script: {
    hook: string;
    toolName: string;
    value: string;
    before: string;
    after: string;
    cta: string;
  };
  // Hero shown in the tool-name section.
  heroMedia: string;
  heroAspect: number;
  steps: MediaStep[];
  voiceover: VoiceLine[];
  musicUrl: string;
  mediaReady: boolean;
  // Persistent series corner badge.
  seriesTag: string;
  episode: number;
};
