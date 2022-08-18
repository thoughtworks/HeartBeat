export class SprintStatistics {
  public sprintCompletedCardsCounts: Array<SprintCompletedCardsCount>;
  public standardDeviation: Array<StandardDeviation>;
  public blockedAndDevelopingPercentage: Array<BlockedAndDevelopingPercentage>;
  public sprintBlockReason: Array<BlockedReason>;
  public cycleTimeAndBlockedTime: Array<SprintCycleTimeAndBlockedTime>;
  constructor(
    sprintComletedCardsCounts?: Array<SprintCompletedCardsCount>,
    standardDeviation?: Array<StandardDeviation>,
    blockedAndDevelopingPercentage?: Array<BlockedAndDevelopingPercentage>,
    sprintBlockReason?: Array<BlockedReason>,
    cycleTimeAndBlockedTime?: Array<SprintCycleTimeAndBlockedTime>
  ) {
    this.sprintCompletedCardsCounts = sprintComletedCardsCounts || [];
    this.standardDeviation = standardDeviation || [];
    this.blockedAndDevelopingPercentage = blockedAndDevelopingPercentage || [];
    this.sprintBlockReason = sprintBlockReason || [];
    this.cycleTimeAndBlockedTime = cycleTimeAndBlockedTime || [];
  }
}

export type SprintCycleTimeAndBlockedTime = {
  sprintName: string;
  cycleTime: number;
  blockedTime: number;
};
export type SprintCompletedCardsCount = {
  sprintName: string;
  value: number;
};

export type StandardDeviationAndAveragePair = {
  standardDeviation: number;
  average: number;
};

export type StandardDeviation = {
  sprintName: string;
  value: StandardDeviationAndAveragePair;
};

export type BlockedAndDevelopingPercentagePair = {
  blockedPercentage: number;
  developingPercentage: number;
};

export type BlockedAndDevelopingPercentage = {
  sprintName: string;
  value: BlockedAndDevelopingPercentagePair;
};

export type BlockDetails = {
  reasonName: string;
  percentage: number;
  time: number;
};

export type BlockedReason = {
  sprintName: string;
  totalBlockedPercentage: number;
  blockDetails: BlockDetails[];
};

export type SprintCycleTime = {
  totalCycleTime: number;
  cycleTimes: number[];
};

export type SprintCycleTimeCount = {
  count: number;
  totalCycleTime: number;
  cycleTimes: number[];
};
