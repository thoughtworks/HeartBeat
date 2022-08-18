export class NoCardsInDoneColumnError extends Error {
  constructor(typeName: string) {
    super(`unsupported type: ${typeName}.`);
  }
}
