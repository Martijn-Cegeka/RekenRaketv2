// Named constants per Architecture Spine convention (no magic numbers).
export const BOX_COUNT = 5;
export const RETRY_CAP = 3;

// Box-transition rules: stubs only, not implemented/called until Story 1.3/1.4.
export function nextBoxOnCorrect(box) {
  return box;
}

export function nextBoxOnIncorrect(box) {
  return box;
}
