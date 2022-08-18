export class SprintStatisticsError extends Error {
  constructor(typeName: string) {
    super(`unsupported type: ${typeName}.`);
  }
}
