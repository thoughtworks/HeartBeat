/// <reference types="vite/client" />

declare module '*.svg' {
  const content: any
  export const ReactComponent: any
  export default content
}
