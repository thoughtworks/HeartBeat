export class SprintStatistics {
  public completedCardsNumber?: Array<CompletedCardNumber>;
  public standardDeviation?: Array<StandardDeviation>;
  public blockedAndDevelopingPercentage?: Array<BlockedAndDevelopingPercentage>;
  public latestSprintBlockReason?: BlockedReason;
  constructor(
    completedCardsNumber?: Array<CompletedCardNumber>,
    standardDeviation?: Array<StandardDeviation>,
    blockedAndDevelopingPercentage?: Array<BlockedAndDevelopingPercentage>,
    latestSprintBlockReason?: BlockedReason
  ) {
    this.completedCardsNumber = completedCardsNumber;
    this.standardDeviation = standardDeviation;
    this.blockedAndDevelopingPercentage = blockedAndDevelopingPercentage;
    this.latestSprintBlockReason = latestSprintBlockReason;
  }
}

export type CompletedCardNumber = {
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

export type BlockedReasonAndPercenagePair = {
  reasonName: string;
  percentage: number;
};

export type BlockedReason = {
  totalBlockedPercentage: number;
  blockReasonPercentage: BlockedReasonAndPercenagePair[];
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
