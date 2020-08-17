import "mocha";
import { expect } from "chai";
import {
  LeadTime,
  PipelineLeadTime,
} from "../../../src/models/codebase/LeadTime";
import { calculateAvgLeadTime } from "../../../src/services/common/LeadTimeForChanges";
import {
  AvgLeadTimeForChanges,
  LeadTimeForChangesOfPipeline,
} from "../../../src/contract/GenerateReporter/GenerateReporterResponse";

describe("calculate avg lead time", () => {
  const leadTimeList: LeadTime[] = [
    new LeadTime("id-1", 1100, 1200, 0, 1000),
    new LeadTime("id-2", 3100, 5100, 1000, 3000),
    new LeadTime("id-3", 11000, 21000, 8000, 10000),
  ];

  const anotherLeadTimeList: LeadTime[] = [
    new LeadTime("id-1", 1300, 1800, 800, 1000),
    new LeadTime("id-2", 4500, 6000, 2200, 4200),
    new LeadTime("id-3", 110000, 210000, 20000, 100000),
  ];

  const pipelinesLeadTime: PipelineLeadTime[] = [
    new PipelineLeadTime("pipeline-1", "step1", leadTimeList),
    new PipelineLeadTime("pipeline-2", "step2", anotherLeadTimeList),
  ];

  it("should return lead time of two pipelines", () => {
    const leadTime = calculateAvgLeadTime(pipelinesLeadTime);
    const leadTimeForChangesOfPipeline1 = new LeadTimeForChangesOfPipeline(
      "pipeline-1",
      "step1",
      1666.666666667,
      4033.333333334
    );
    const leadTimeForChangesOfPipeline2 = new LeadTimeForChangesOfPipeline(
      "pipeline-2",
      "step2",
      27400,
      34000
    );

    const expectedLeadTimeForChangesOfPipelines: LeadTimeForChangesOfPipeline[] = [
      leadTimeForChangesOfPipeline1,
      leadTimeForChangesOfPipeline2,
    ];
    const expectedAvgLeadTimeForChange: AvgLeadTimeForChanges = new AvgLeadTimeForChanges(
      14533.3333334,
      19016.666667
    );
    expect(leadTime.key).deep.equals(expectedLeadTimeForChangesOfPipelines);
    expect(leadTime.value).deep.equals(expectedAvgLeadTimeForChange);
  });

  it("should return 0 given empty array", () => {
    const leadTime = calculateAvgLeadTime([]);
    const avgLeadTimeForChanges = new AvgLeadTimeForChanges(0, 0);
    expect(leadTime.key.length).equals(0);
    expect(leadTime.value).deep.equals(avgLeadTimeForChanges);
  });

  it("should return 0 when we have not deploy", () => {
    const leadTime = calculateAvgLeadTime([
      {
        pipelineName: "name",
        pipelineStep: "step",
        leadTimes: [],
      },
    ]);
    const avgLeadTimeForChanges = new AvgLeadTimeForChanges(0, 0);
    expect(leadTime.key.length).equals(0);
    expect(leadTime.value).deep.equals(avgLeadTimeForChanges);
  });
});
