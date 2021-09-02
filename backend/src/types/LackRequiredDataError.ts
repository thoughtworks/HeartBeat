export class LackRequiredDataError extends Error {
    constructor() {
        super("Lack Required Data");
    }
}