import {
  GenerateReportRequest,
  RequestKanbanSetting,
} from "../../contract/GenerateReporter/GenerateReporterRequestBody";
import { StoryPointsAndCycleTimeRequest } from "../../contract/kanban/KanbanStoryPointParameterVerify";
import { JiraCardResponse } from "../../contract/kanban/KanbanStoryPointResponse";
import { JiraBlockReasonEnum } from "../../models/kanban/JiraBlockReasonEnum";
import { Cards } from "../../models/kanban/RequestKanbanResults";
import { Sprint } from "../../models/kanban/Sprint";
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
  private mapSprintBlockPercentage?: Map<string, number>;
  private mapSprintStandardDeviation?: Map<string, number>;
  private mapSprintBlockReasonPercentage?: Map<string, number>;

  async fetchSprintInfoFromKanban(
    request: GenerateReportRequest
  ): Promise<void> {
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
    this.cards = await kanban.getStoryPointsAndCycleTime(
      model,
      kanbanSetting.boardColumns,
      kanbanSetting.users
    );

    const matchedCards = this.cards.matchedCards;
    const mapSprintCards = this.mapCardsBySprintName(matchedCards);

    if (kanban instanceof Jira) {
      this.sprints = await kanban.getAllSprintsByBoardId(model);
      const activeAndClosedSprints = this.getActiveAndClosedSprints(
        this.sprints
      );

      const unorderedMapSprintBlockPercentage: Map<string, number> =
        this.calculateBlockedAndDevelopingPercentage(mapSprintCards);
      this.mapSprintBlockPercentage = this.sortBySprintStartDate(
        unorderedMapSprintBlockPercentage,
        activeAndClosedSprints
      );

      const unorderedMapSprintStandardDeviation: Map<string, number> =
        this.calculateStandardDeviation(mapSprintCards);
      this.mapSprintStandardDeviation = this.sortBySprintStartDate(
        unorderedMapSprintStandardDeviation,
        activeAndClosedSprints
      );

      this.mapSprintBlockReasonPercentage = this.calculateBlockReasonPercentage(
        activeAndClosedSprints,
        mapSprintCards
      );
    }
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

  private getLatestSprintName(sprints: Sprint[]): string {
    const sortedSprints = sprints.sort(
      (a, b) => Date.parse(a.startDate) - Date.parse(b.startDate)
    );
    return sortedSprints.length > 0
      ? sortedSprints[sortedSprints.length - 1].name
      : "";
  }

  calculateBlockReasonPercentage(
    sprints: Sprint[],
    mapSprintCards: Map<string, JiraCardResponse[]>
  ): Map<string, number> {
    let totalCycleTime = 0;
    const blockTimeForEveryReasonMap: Map<string, number> =
      this.initTotalBlockTimeForEveryReasonMap();
    const latestSprintName = this.getLatestSprintName(sprints);
    const latestSprintCards = mapSprintCards.get(latestSprintName)!;

    if (latestSprintCards.length === 0) {
      return blockTimeForEveryReasonMap;
    }
    for (const card of latestSprintCards) {
      totalCycleTime += card.getTotalOrZero();
    }

    for (const card of latestSprintCards) {
      let blockReason = card.baseInfo.fields.label || "";

      if (!blockTimeForEveryReasonMap.has(blockReason)) {
        blockReason = JiraBlockReasonEnum.OTHERS;
      }

      const blockTimeForEveryReason =
        (blockTimeForEveryReasonMap.get(blockReason) || 0) +
        card.cardCycleTime!.steps.blocked;

      const blockedReasonPercentage = parseFloat(
        (blockTimeForEveryReason / totalCycleTime).toFixed(2)
      );

      blockTimeForEveryReasonMap.set(blockReason, blockedReasonPercentage);
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
      const { totalCycleTime, cycleTimes } =
        this.calculateCardsCycleTimes(cards);
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

    const mapSprintObj: Map<string, any> =
      this.getCardsCycleTimesBySprintName(mapSprintCards);

    mapSprintObj.forEach((sprintObj, sprintName) => {
      let avgerage = 0;
      let standardDeviation = 0;

      if (sprintObj.count != 0) {
        avgerage = parseFloat(
          (sprintObj.totalCycleTime / sprintObj.count).toFixed(2)
        );
        standardDeviation = parseFloat(
          Math.sqrt(
            sprintObj.cycleTimes.reduce(
              (accu: number, curr: number) =>
                Math.pow(curr - avgerage, 2) + accu,
              0
            ) / sprintObj.count
          ).toFixed(2)
        );
      }

      mapSprintStandardDeviation.set(sprintName, {
        standardDeviation,
        avgerage,
      });
    });

    return mapSprintStandardDeviation;
  }
}
