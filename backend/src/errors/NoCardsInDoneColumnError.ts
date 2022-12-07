export class NoCardsInDoneColumnError extends Error {
  constructor(typeName: string) {
    super(`Unsupported type: ${typeName}.`);
  }
}
