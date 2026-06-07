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
