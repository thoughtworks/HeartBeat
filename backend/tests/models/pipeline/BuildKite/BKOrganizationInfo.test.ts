import { expect } from "chai";
import { BKOrganizationInfo } from "../../../../src/models/pipeline/Buildkite/BKOrganizationInfo";

describe("BKOrganizationInfo", () => {
  it("should create an instance when given arguments", () => {
    const name = "test-name";
    const slug = "test-slg";
    const bkOrganizationInfo = new BKOrganizationInfo(name, slug);
    expect(bkOrganizationInfo).deep.equal({
      name: "test-name",
      slug: "test-slg",
    });
  });
});
