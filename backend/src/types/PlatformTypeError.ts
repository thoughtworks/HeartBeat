export class PlatformTypeError extends Error {
  constructor(typeName: string) {
    super(`unsupported type: ${typeName}.`);
  }
}
