export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  BOARD_TOKEN: /^[a-zA-Z0-9\-=_]{1,500}$/,
  BUILDKITE_TOKEN: /^(bkua)?_?([a-zA-Z0-9]{40})$/,
  GITHUB_TOKEN: /^(ghp|gho|ghu|ghs|ghr)+_+([a-zA-Z0-9]{36})$/,
  BOARD_ID: /^[0-9]+$/,
};
