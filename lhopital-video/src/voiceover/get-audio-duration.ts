import { ALL_FORMATS, Input, UrlSource } from "mediabunny";

// Returns the duration of an audio file in seconds, or null if it cannot be
// read (e.g. the file has not been generated yet).
export const getAudioDuration = async (src: string): Promise<number | null> => {
  try {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new UrlSource(src, { getRetryDelay: () => null }),
    });
    const durationInSeconds = await input.computeDuration();
    return durationInSeconds || null;
  } catch {
    return null;
  }
};
