import "mocha";
import { expect } from "chai";
import logger from "../../src/utils/loggerUtils";

describe("loggerUtils", () => {
    it("should be DEBUG level when default", () => {
        expect("DEBUG").equal(logger.level.toString())
    });
})