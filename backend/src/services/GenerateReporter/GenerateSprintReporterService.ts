import {
  GenerateReportRequest,
  RequestKanbanSetting,
} from "../../contract/GenerateReporter/GenerateReporterRequestBody";
import { StoryPointsAndCycleTimeRequest } from "../../contract/kanban/KanbanStoryPointParameterVerify";
import { JiraCardResponse } from "../../contract/kanban/KanbanStoryPointResponse";
import { JiraBlockReasonEnum } from "../../models/kanban/JiraBlockReasonEnum";
import { Cards } from "../../models/kanban/RequestKanbanResults";
import { Sprint } from "../../models/kanban/Sprint";
import { SprintStatistics } from "../../models/kanban/SprintStatistics";
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
  private sprintBlockPercentageMap?: Map<string, any>;
  private sprintStandardDeviationMap?: Map<string, any>;
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
    const model: StoryPointsAndCycleTimeRequest = new StoryPointsAndCycleTimeRequest(
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
    const mapSprintCards = this.mapCardsBySprintName(matchedCards!);

    if (kanban instanceof Jira) {
      this.sprints = await kanban.getAllSprintsByBoardId(model);
      const activeAndClosedSprints = this.getActiveAndClosedSprints(
        this.sprints
      );

      const unorderedMapSprintBlockPercentage: Map<
        string,
        any
      > = this.calculateBlockedAndDevelopingPercentage(mapSprintCards);
      this.sprintBlockPercentageMap = this.sortBySprintStartDate(
        unorderedMapSprintBlockPercentage,
        activeAndClosedSprints
      );

      const unorderedMapSprintStandardDeviation: Map<
        string,
        any
      > = this.calculateStandardDeviation(mapSprintCards);
      this.sprintStandardDeviationMap = this.sortBySprintStartDate(
        unorderedMapSprintStandardDeviation,
        activeAndClosedSprints
      );

      const unorderSprintCompletedCardsNumberMap: Map<
        string,
        number
      > = this.calculateCompletedCardsNumber(mapSprintCards);
      this.sprintCompletedCardsNumberMap = this.sortBySprintStartDate(
        unorderSprintCompletedCardsNumberMap,
        activeAndClosedSprints
      );

      this.sprintBlockReasonPercentageMap = this.calculateBlockReasonPercentage(
        activeAndClosedSprints,
        mapSprintCards
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

  private initTotalBlockTimeForEveryReasonMap(): Map<string, number> {
    const totalBlockTimeForEveryReasonMap = new Map<string, number>();
    for (let reason in JiraBlockReasonEnum) {
      reason = Object.entries(JiraBlockReasonEnum).find(
        ([key, val]) => key === reason
      )?.[1]!;
      totalBlockTimeForEveryReasonMap.set(reason, 0);
    }
    return totalBlockTimeForEveryReasonMap;
  }

  private getLatestSprintName(
    mapSprintCards: Map<string, JiraCardResponse[]>,
    sprints: Sprint[]
  ): string {
    let latestSprintName: string = "";
    const sortedSprints = sprints.sort(
      (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
    );
    for (let i: number = sortedSprints.length - 1; i >= 0; i--) {
      if (mapSprintCards.has(sortedSprints[i].name)) {
        latestSprintName = sortedSprints[i].name;
        break;
      }
    }
    return latestSprintName;
  }

  calculateBlockReasonPercentage(
    sprints: Sprint[],
    mapSprintCards: Map<string, JiraCardResponse[]>
  ): Map<string, number> {
    let totalCycleTime = 0;
    const blockTimeForEveryReasonMap: Map<
      string,
      number
    > = this.initTotalBlockTimeForEveryReasonMap();
    const latestSprintName = this.getLatestSprintName(mapSprintCards, sprints);
    const latestSprintCards = mapSprintCards.get(latestSprintName)!;

    if (!latestSprintCards || latestSprintCards.length == 0) {
      return blockTimeForEveryReasonMap;
    }

    for (const card of latestSprintCards) {
      totalCycleTime += card.getTotalOrZero();
      let blockReason = card.baseInfo.fields.label || "";

      if (!blockTimeForEveryReasonMap.has(blockReason)) {
        blockReason = JiraBlockReasonEnum.OTHERS;
      }

      const currentBlockTime =
        (blockTimeForEveryReasonMap.get(blockReason) || 0) +
        card.cardCycleTime!.steps.blocked;

      blockTimeForEveryReasonMap.set(blockReason, currentBlockTime);
    }
    if (totalCycleTime) {
      blockTimeForEveryReasonMap.forEach((value, key) => {
        blockTimeForEveryReasonMap.set(
          key,
          parseFloat((value / totalCycleTime).toFixed(2))
        );
      });
    }

    return blockTimeForEveryReasonMap;
  }

  mapCardsBySprintName(
    matchedCards: JiraCardResponse[]
  ): Map<string, JiraCardResponse[]> {
    const mapSprintCards = new Map<string, JiraCardResponse[]>();

    for (const card of matchedCards) {
      const sprint = card.baseInfo.fields.sprint;
      if (sprint) {
        if (!mapSprintCards.has(sprint)) {
          mapSprintCards.set(sprint, []);
        }

        mapSprintCards.get(sprint)!.push(card);
      }
    }

    return mapSprintCards;
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
    mapSprintCards: Map<string, JiraCardResponse[]>
  ): Map<string, any> {
    const mapSprintBlockedPercentage = new Map<string, any>();
    mapSprintCards.forEach((cards: JiraCardResponse[], sprint: string) => {
      const blockedPercentage = this.calculateCardsBlockedPercentage(cards);
      mapSprintBlockedPercentage.set(sprint, {
        blockedPercentage,
        developingPercentage: 1 - blockedPercentage,
      });
    });
    return mapSprintBlockedPercentage;
  }

  private sortBySprintStartDate(
    unorderedMap: Map<string, any>,
    sprints: Sprint[]
  ): Map<string, any> {
    const sprintMap: Map<string, number> = new Map<string, number>();
    sprints.forEach((sprint) => {
      if (sprint.startDate)
        sprintMap.set(sprint.name, Date.parse(sprint.startDate));
    });
    return new Map(
      [...unorderedMap].sort((a, b) => {
        const dateA = sprintMap.get(a[0]);
        const dateB = sprintMap.get(b[0]);
        return dateA && dateB ? dateA - dateB : 1;
      })
    );
  }

  private getActiveAndClosedSprints(sprints: Sprint[]) {
    return sprints.filter((sprint) => sprint.startDate);
  }

  private calculateCardsCycleTimes(matchedCards: JiraCardResponse[]): any {
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
    mapSprintCards: Map<string, JiraCardResponse[]>
  ): Map<string, any> {
    const mapSprintObj: Map<string, any> = new Map<string, any>();

    mapSprintCards.forEach((cards: JiraCardResponse[], sprintName: string) => {
      const { totalCycleTime, cycleTimes } = this.calculateCardsCycleTimes(
        cards
      );
      mapSprintObj.set(sprintName, {
        count: cards.length,
        totalCycleTime: totalCycleTime,
        cycleTimes: cycleTimes,
      });
    });

    return mapSprintObj;
  }

  calculateStandardDeviation(
    mapSprintCards: Map<string, JiraCardResponse[]>
  ): Map<string, any> {
    const mapSprintStandardDeviation: Map<string, any> = new Map<string, any>();

    const mapSprintObj: Map<string, any> = this.getCardsCycleTimesBySprintName(
      mapSprintCards
    );

    mapSprintObj.forEach((sprintObj, sprintName) => {
      let average = 0;
      let standardDeviation = 0;

      if (sprintObj.count != 0) {
        average = parseFloat(
          (sprintObj.totalCycleTime / sprintObj.count).toFixed(2)
        );
        standardDeviation = parseFloat(
          Math.sqrt(
            sprintObj.cycleTimes.reduce(
              (accu: number, curr: number) =>
                Math.pow(curr - average, 2) + accu,
              0
            ) / sprintObj.count
          ).toFixed(2)
        );
      }

      mapSprintStandardDeviation.set(sprintName, {
        standardDeviation,
        average,
      });
    });

    return mapSprintStandardDeviation;
  }

  calculateCompletedCardsNumber(
    mapSprintCards: Map<string, JiraCardResponse[]>
  ): Map<string, number> {
    const mapSprintCompletedCardsNumber = new Map<string, number>();

    mapSprintCards.forEach((cards, sprint) => {
      mapSprintCompletedCardsNumber.set(sprint, cards.length);
    });

    return mapSprintCompletedCardsNumber;
  }

  generateJiraSprintStatistics(
    sprintCompletedCardsNumberMap: Map<string, number>,
    sprintBlockPercentageMap: Map<string, any>,
    sprintStandardDeviationMap: Map<string, any>,
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
