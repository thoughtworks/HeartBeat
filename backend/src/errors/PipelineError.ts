export class PipelineError extends Error {
  constructor(typeName: string) {
    super(`unsupported type: ${typeName}.`);
  }
}
