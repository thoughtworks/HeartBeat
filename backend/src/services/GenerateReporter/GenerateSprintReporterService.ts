import {
  GenerateReportRequest,
  RequestKanbanSetting,
} from "../../contract/GenerateReporter/GenerateReporterRequestBody";
import { StoryPointsAndCycleTimeRequest } from "../../contract/kanban/KanbanStoryPointParameterVerify";
import { JiraCardResponse } from "../../contract/kanban/KanbanStoryPointResponse";
import { JiraBlockReasonEnum } from "../../models/kanban/JiraBlockReasonEnum";
import { Cards } from "../../models/kanban/RequestKanbanResults";
import { Sprint } from "../../models/kanban/Sprint";
import {
  BlockedAndDevelopingPercentagePair,
  SprintCycleTime,
  SprintCycleTimeCount,
  SprintStatistics,
  StandardDeviationAndAveragePair,
} from "../../models/kanban/SprintStatistics";
import { Jira } from "../kanban/Jira/Jira";
import { Kanban, KanbanEnum, KanbanFactory } from "../kanban/Kanban";

const KanbanKeyIdentifierMap: { [key: string]: "projectKey" | "teamName" } = {
  [KanbanEnum.CLASSIC_JIRA]: "projectKey",
  [KanbanEnum.JIRA]: "projectKey",
  [KanbanEnum.LINEAR]: "teamName",
};
export class GenerateSprintReporterService {
  private cards?: Cards;
  private sprints?: Sprint[];
  private sprintBlockPercentageMap?: Map<
    string,
    BlockedAndDevelopingPercentagePair
  >;
  private sprintStandardDeviationMap?: Map<
    string,
    StandardDeviationAndAveragePair
  >;
  private sprintCompletedCardsNumberMap?: Map<string, number>;
  private sprintBlockReasonPercentageMap?: Map<string, number>;

  constructor(cards?: Cards) {
    this.cards = cards;
  }

  async fetchSprintInfoFromKanban(
    request: GenerateReportRequest
  ): Promise<SprintStatistics> {
    const kanbanSetting: RequestKanbanSetting = request.kanbanSetting;
    const kanban: Kanban = KanbanFactory.getKanbanInstantiateObject(
      kanbanSetting.type,
      kanbanSetting.token,
      kanbanSetting.site
    );
    const model: StoryPointsAndCycleTimeRequest =
      new StoryPointsAndCycleTimeRequest(
        kanbanSetting.token,
        kanbanSetting.type,
        kanbanSetting.site,
        kanbanSetting[KanbanKeyIdentifierMap[kanbanSetting.type]],
        kanbanSetting.boardId,
        kanbanSetting.doneColumn,
        request.startTime,
        request.endTime,
        kanbanSetting.targetFields,
        kanbanSetting.treatFlagCardAsBlock
      );

    const matchedCards = this.cards?.matchedCards;
    const sprintCardsMap = this.mapCardsBySprintName(matchedCards!);

    if (kanban instanceof Jira) {
      this.sprints = await kanban.getAllSprintsByBoardId(model);
      const activeAndClosedSprints = this.getActiveAndClosedSprints(
        this.sprints
      );

      const unorderedSprintBlockPercentageMap: Map<
        string,
        BlockedAndDevelopingPercentagePair
      > = this.calculateBlockedAndDevelopingPercentage(sprintCardsMap);
      this.sprintBlockPercentageMap = this.sortBySprintStartDate(
        unorderedSprintBlockPercentageMap,
        activeAndClosedSprints
      );

      const unorderedSprintStandardDeviationMap: Map<
        string,
        StandardDeviationAndAveragePair
      > = this.calculateStandardDeviation(sprintCardsMap);
      this.sprintStandardDeviationMap = this.sortBySprintStartDate(
        unorderedSprintStandardDeviationMap,
        activeAndClosedSprints
      );

      const unorderedSprintCompletedCardsNumberMap: Map<string, number> =
        this.calculateCompletedCardsNumber(sprintCardsMap);
      this.sprintCompletedCardsNumberMap = this.sortBySprintStartDate(
        unorderedSprintCompletedCardsNumberMap,
        activeAndClosedSprints
      );

      this.sprintBlockReasonPercentageMap = this.calculateBlockReasonPercentage(
        activeAndClosedSprints,
        sprintCardsMap
      );
      return this.generateJiraSprintStatistics(
        this.sprintCompletedCardsNumberMap,
        this.sprintBlockPercentageMap,
        this.sprintStandardDeviationMap,
        this.sprintBlockReasonPercentageMap
      );
    }
    return new SprintStatistics();
  }

  private initBlockedTimeMap(): Map<string, number> {
    const blockedTimeMap = new Map<string, number>();
    for (let reason in JiraBlockReasonEnum) {
      reason = Object.entries(JiraBlockReasonEnum).find(
        ([key, val]) => key === reason
      )?.[1]!;
      blockedTimeMap.set(reason, 0);
    }
    return blockedTimeMap;
  }

  private getLatestSprintName(
    sprintCardsMap: Map<string, JiraCardResponse[]>,
    sprints: Sprint[]
  ): string {
    let latestSprintName: string = "";
    const sortedSprints = sprints.sort(
      (sprint1, sprint2) =>
        Date.parse(sprint1.startDate) - Date.parse(sprint2.startDate)
    );
    for (let i: number = sortedSprints.length - 1; i >= 0; i--) {
      if (sprintCardsMap.has(sortedSprints[i].name)) {
        latestSprintName = sortedSprints[i].name;
        break;
      }
    }
    return latestSprintName;
  }

  calculateBlockReasonPercentage(
    sprints: Sprint[],
    sprintCardsMap: Map<string, JiraCardResponse[]>
  ): Map<string, number> {
    let totalCycleTime = 0;
    const blockedTimeForEveryReasonMap: Map<string, number> =
      this.initBlockedTimeMap();
    const latestSprintName = this.getLatestSprintName(sprintCardsMap, sprints);
    const latestSprintCards = sprintCardsMap.get(latestSprintName)!;

    if (!latestSprintCards || latestSprintCards.length == 0) {
      return blockedTimeForEveryReasonMap;
    }

    for (const card of latestSprintCards) {
      totalCycleTime += card.getTotalOrZero();
      let blockReason = card.baseInfo.fields.label || "";

      if (!blockedTimeForEveryReasonMap.has(blockReason)) {
        blockReason = JiraBlockReasonEnum.OTHERS;
      }

      const currentBlockTime =
        (blockedTimeForEveryReasonMap.get(blockReason) || 0) +
        card.cardCycleTime!.steps.blocked;

      blockedTimeForEveryReasonMap.set(blockReason, currentBlockTime);
    }
    if (totalCycleTime) {
      blockedTimeForEveryReasonMap.forEach((value, key) => {
        blockedTimeForEveryReasonMap.set(
          key,
          parseFloat((value / totalCycleTime).toFixed(2))
        );
      });
    }

    return blockedTimeForEveryReasonMap;
  }

  mapCardsBySprintName(
    matchedCards: JiraCardResponse[]
  ): Map<string, JiraCardResponse[]> {
    const sprintCardsMap = new Map<string, JiraCardResponse[]>();

    for (const card of matchedCards) {
      const sprint = card.baseInfo.fields.sprint;
      if (sprint) {
        if (!sprintCardsMap.has(sprint)) {
          sprintCardsMap.set(sprint, []);
        }

        sprintCardsMap.get(sprint)!.push(card);
      }
    }

    return sprintCardsMap;
  }

  private calculateCardsBlockedPercentage(
    matchedCards: JiraCardResponse[]
  ): number {
    let totalCycleTime = 0;
    let totalBlockedTime = 0;

    for (const card of matchedCards) {
      totalCycleTime += card.getTotalOrZero();
      totalBlockedTime += card.cardCycleTime!.steps.blocked;
    }

    const blockedPercentage =
      totalCycleTime === 0
        ? 0
        : parseFloat((totalBlockedTime / totalCycleTime).toFixed(2));
    return blockedPercentage;
  }

  calculateBlockedAndDevelopingPercentage(
    sprintCardsMap: Map<string, JiraCardResponse[]>
  ): Map<string, BlockedAndDevelopingPercentagePair> {
    const sprintBlockedPercentageMap = new Map<
      string,
      BlockedAndDevelopingPercentagePair
    >();
    sprintCardsMap.forEach((cards: JiraCardResponse[], sprint: string) => {
      const blockedPercentage = this.calculateCardsBlockedPercentage(cards);
      sprintBlockedPercentageMap.set(sprint, {
        blockedPercentage,
        developingPercentage: 1 - blockedPercentage,
      });
    });
    return sprintBlockedPercentageMap;
  }

  private sortBySprintStartDate<T>(
    unorderedMap: Map<string, T>,
    sprints: Sprint[]
  ): Map<string, T> {
    const sprintMap: Map<string, number> = new Map<string, number>();
    sprints.forEach((sprint) => {
      if (sprint.startDate)
        sprintMap.set(sprint.name, Date.parse(sprint.startDate));
    });
    return new Map(
      [...unorderedMap].sort((entity1, entity2) => {
        const dateA = sprintMap.get(entity1[0]);
        const dateB = sprintMap.get(entity2[0]);
        return dateA && dateB ? dateA - dateB : 1;
      })
    );
  }

  private getActiveAndClosedSprints(sprints: Sprint[]) {
    return sprints.filter((sprint) => sprint.startDate);
  }

  private calculateCardsCycleTimes(
    matchedCards: JiraCardResponse[]
  ): SprintCycleTime {
    let totalCycleTime = 0;
    const cycleTimes = [];

    for (const card of matchedCards) {
      const totalTime = card.getTotalOrZero();
      totalCycleTime += totalTime;
      cycleTimes.push(totalTime);
    }

    return { totalCycleTime, cycleTimes };
  }

  private getCardsCycleTimesBySprintName(
    sprintCardsMap: Map<string, JiraCardResponse[]>
  ): Map<string, SprintCycleTimeCount> {
    const sprintCycleTimeMap: Map<string, SprintCycleTimeCount> = new Map<
      string,
      SprintCycleTimeCount
    >();

    sprintCardsMap.forEach((cards: JiraCardResponse[], sprintName: string) => {
      const { totalCycleTime, cycleTimes } =
        this.calculateCardsCycleTimes(cards);
      sprintCycleTimeMap.set(sprintName, {
        count: cards.length,
        totalCycleTime: totalCycleTime,
        cycleTimes: cycleTimes,
      });
    });

    return sprintCycleTimeMap;
  }

  calculateStandardDeviation(
    sprintCardsMap: Map<string, JiraCardResponse[]>
  ): Map<string, StandardDeviationAndAveragePair> {
    const sprintStandardDeviationMap: Map<
      string,
      StandardDeviationAndAveragePair
    > = new Map<string, StandardDeviationAndAveragePair>();

    const sprintStandardDeviationAndAverageMap: Map<
      string,
      SprintCycleTimeCount
    > = this.getCardsCycleTimesBySprintName(sprintCardsMap);

    sprintStandardDeviationAndAverageMap.forEach(
      (sprintCycleTime, sprintName) => {
        let average = 0;
        let standardDeviation = 0;

        if (sprintCycleTime.count != 0) {
          average = parseFloat(
            (sprintCycleTime.totalCycleTime / sprintCycleTime.count).toFixed(2)
          );
          standardDeviation = parseFloat(
            Math.sqrt(
              sprintCycleTime.cycleTimes.reduce(
                (accumulator: number, currentValue: number) =>
                  Math.pow(currentValue - average, 2) + accumulator,
                0
              ) / sprintCycleTime.count
            ).toFixed(2)
          );
        }

        sprintStandardDeviationMap.set(sprintName, {
          standardDeviation,
          average,
        });
      }
    );

    return sprintStandardDeviationMap;
  }

  calculateCompletedCardsNumber(
    sprintCardsMap: Map<string, JiraCardResponse[]>
  ): Map<string, number> {
    const sprintCompletedCardsNumberMap = new Map<string, number>();

    sprintCardsMap.forEach((cards, sprint) => {
      sprintCompletedCardsNumberMap.set(sprint, cards.length);
    });

    return sprintCompletedCardsNumberMap;
  }

  generateJiraSprintStatistics(
    sprintCompletedCardsNumberMap: Map<string, number>,
    sprintBlockPercentageMap: Map<string, BlockedAndDevelopingPercentagePair>,
    sprintStandardDeviationMap: Map<string, StandardDeviationAndAveragePair>,
    sprintBlockReasonPercentageMap: Map<string, number>
  ): SprintStatistics {
    const completedCardsNumber: Array<{
      sprintName: string;
      value: number;
    }> = [];
    const blockedAndDevelopingPercentage: Array<{
      sprintName: string;
      value: { blockedPercentage: number; developingPercentage: number };
    }> = [];
    const standardDeviation: Array<{
      sprintName: string;
      value: { standardDeviation: number; average: number };
    }> = [];
    sprintCompletedCardsNumberMap?.forEach((value, key) => {
      completedCardsNumber.push({ sprintName: key, value });
    });
    sprintBlockPercentageMap?.forEach((value, key) => {
      blockedAndDevelopingPercentage.push({
        sprintName: key,
        value: {
          blockedPercentage: value.blockedPercentage,
          developingPercentage: value.developingPercentage,
        },
      });
    });
    sprintStandardDeviationMap?.forEach((value, key) => {
      standardDeviation.push({
        sprintName: key,
        value: {
          standardDeviation: value.standardDeviation,
          average: value.average,
        },
      });
    });
    const latestSprintBlockReason: {
      totalBlockedPercentage: number;
      blockReasonPercentage: Array<{ reasonName: string; percentage: number }>;
    } = {
      totalBlockedPercentage: blockedAndDevelopingPercentage.length
        ? blockedAndDevelopingPercentage.slice(-1)[0].value.blockedPercentage
        : 0,
      blockReasonPercentage: [],
    };
    sprintBlockReasonPercentageMap?.forEach((value, key) => {
      latestSprintBlockReason.blockReasonPercentage.push({
        reasonName: key,
        percentage: value,
      });
    });
    return new SprintStatistics(
      completedCardsNumber,
      standardDeviation,
      blockedAndDevelopingPercentage,
      latestSprintBlockReason
    );
  }
}
