export class SprintStatistics {
  public completedCardsNumber?: Array<{ sprintName: string; value: number }>;
  public standardDeviation?: Array<{
    sprintName: string;
    value: { standardDeviation: number; average: number };
  }>;
  public blockedAndDevelopingPercentage?: Array<{
    sprintName: string;
    value: { blockedPercentage: number; developingPercentage: number };
  }>;
  public latestSprintBlockReason?: {
    totalBlockedPercentage: number;
    blockReasonPercentage: Array<{ reasonName: string; percentage: number }>;
  };
  constructor(
    completedCardsNumber?: Array<{ sprintName: string; value: number }>,
    standardDeviation?: Array<{
      sprintName: string;
      value: { standardDeviation: number; average: number };
    }>,
    blockedAndDevelopingPercentage?: Array<{
      sprintName: string;
      value: { blockedPercentage: number; developingPercentage: number };
    }>,
    latestSprintBlockReason?: {
      totalBlockedPercentage: number;
      blockReasonPercentage: Array<{ reasonName: string; percentage: number }>;
    }
  ) {
    this.completedCardsNumber = completedCardsNumber;
    this.standardDeviation = standardDeviation;
    this.blockedAndDevelopingPercentage = blockedAndDevelopingPercentage;
    this.latestSprintBlockReason = latestSprintBlockReason;
  }
}
