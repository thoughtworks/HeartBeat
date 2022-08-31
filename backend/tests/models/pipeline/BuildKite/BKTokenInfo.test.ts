import { expect } from "chai";
import { BKTokenInfo } from "../../../../src/models/pipeline/Buildkite/BKTokenInfo";

describe("BKTokenInfo", () => {
  it("should create an instance when given arguments", () => {
    const scopes: string[] = ["test-scope"];
    const bkTokenInfo = new BKTokenInfo(scopes);

    expect(bkTokenInfo).deep.equal({
      scopes,
    });
  });
});
