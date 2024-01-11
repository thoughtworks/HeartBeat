/// <reference types="vite/client" />

declare module '*.svg' {
  const content: unknown;
  export const ReactComponent: unknown;
  export default content;
}
