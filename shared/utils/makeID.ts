export const makeID = (value?: string): string | undefined =>
  value?.replace(/[^a-zA-Z0-9_-]+/g, "-") || undefined;

export default makeID;
