import { Kanban, KanbanEnum } from "../Kanban";
import axios, { AxiosInstance } from "axios";
import { StoryPointsAndCycleTimeRequest } from "../../../contract/kanban/KanbanStoryPointParameterVerify";
import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../contract/kanban/KanbanStoryPointResponse";
import {
  ColumnValue,
  ColumnResponse,
} from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { StatusSelf } from "../../../models/kanban/JiraBoard/StatusSelf";
import {
  HistoryDetail,
  JiraCardHistory,
} from "../../../models/kanban/JiraBoard/JiraCardHistory";
import { CalculateCardCycleTime } from "../CalculateCycleTime";
import { RequestKanbanColumnSetting } from "../../../contract/GenerateReporter/GenerateReporterRequestBody";
import { Cards } from "../../../models/kanban/RequestKanbanResults";
import {
  CardCustomFieldKey,
  FixVersion,
} from "../../../models/kanban/JiraBoard/JiraCard";
import { CardFieldsEnum } from "../../../models/kanban/CardFieldsEnum";
import { CardStepsEnum } from "../../../models/kanban/CardStepsEnum";
import {
  confirmThisCardHasAssignedBySelectedUser,
  getCardTimeForEachStep,
  reformTimeLineForFlaggedCards,
  StatusChangedArrayItem,
} from "../util";
import { Sprint } from "../../../models/kanban/Sprint";
import { JiraBlockReasonEnum } from "../../../models/kanban/JiraBoard/JiraBlockReasonEnum";
import {
  BlockedAndDevelopingPercentage,
  BlockedAndDevelopingPercentagePair,
  BlockedReason,
  BlockDetails,
  SprintCompletedCardsCount,
  SprintCycleTime,
  SprintCycleTimeAndBlockedTime,
  SprintCycleTimeCount,
  SprintStatistics,
  StandardDeviation,
  StandardDeviationAndAveragePair,
} from "../../../models/kanban/SprintStatistics";

export class Jira implements Kanban {
  private readonly queryCount: number = 100;
  private readonly httpClient: AxiosInstance;

  constructor(token: string, site: string) {
    this.httpClient = axios.create({
      baseURL: `https://${site}.atlassian.net/rest/agile/1.0/board`,
    });
    this.httpClient.defaults.headers.common["Authorization"] = token;
  }

  async getAllSprintsByBoardId(
    model: StoryPointsAndCycleTimeRequest
  ): Promise<Sprint[]> {
    const sprintResponse = await this.httpClient.get(
      `/${model.boardId}/sprint`
    );
    const sprintArray = sprintResponse.data.values;
    const sprints = sprintArray.map(
      (sprint: any) =>
        new Sprint(
          sprint.id,
          sprint.state,
          sprint.name,
          sprint.startDate,
          sprint.endDate,
          sprint.completeDate
        )
    );
    return sprints;
  }

  async getColumns(
    model: StoryPointsAndCycleTimeRequest
  ): Promise<ColumnResponse[]> {
    const jiraColumnNames = Array.of<ColumnResponse>();

    //column
    const configurationResponse = await axios.get(
      `https://${model.site}.atlassian.net/rest/agile/1.0/board/${model.boardId}/configuration`,
      {
        headers: { Authorization: `${model.token}` },
      }
    );

    const configuration = configurationResponse.data;

    const columns = configuration.columnConfig.columns;

    for (const column of columns) {
      if (column.statuses.length == 0) {
        continue;
      }

      const columnValue: ColumnValue = new ColumnValue();
      columnValue.name = column.name;

      const jiraColumnResponse = new ColumnResponse();
      for (const status of column.statuses) {
        const statusSelf = await Jira.queryStatus(status.self, model.token);
        jiraColumnResponse.key = statusSelf.statusCategory.key;

        columnValue.statuses.push(statusSelf.untranslatedName.toUpperCase());
      }

      jiraColumnResponse.value = columnValue;
      jiraColumnNames.push(jiraColumnResponse);
    }

    return jiraColumnNames;
  }

  private static async queryStatus(
    url: string,
    token: string
  ): Promise<StatusSelf> {
    const http = axios.create();
    http.defaults.headers.common["Authorization"] = token;
    const result = await http.get(url);
    return result.data;
  }

  async getStoryPointsAndCycleTime(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[] = [],
    users: string[]
  ): Promise<Cards> {
    this.saveCostumedFieldKey(model);

    let storyPointSum = 0;
    const allDoneCards = await this.getAllDoneCards(model);
    const matchedCards = Array.of<JiraCardResponse>();

    await Promise.all(
      allDoneCards.map(async function (DoneCard: any) {
        const { cycleTimeInfos, assigneeSet, originCycleTimeInfos } =
          await Jira.getCycleTimeAndAssigneeSet(
            DoneCard.key,
            model.token,
            model.site,
            model.treatFlagCardAsBlock
          );

        //fix the assignee not in the card history, only in the card field issue.
        if (DoneCard.fields.assignee && DoneCard.fields.assignee.displayName) {
          assigneeSet.add(DoneCard.fields.assignee.displayName);
        }

        if (confirmThisCardHasAssignedBySelectedUser(users, assigneeSet)) {
          const matchedCard = Jira.processCustomFieldsForCard(DoneCard);
          matchedCard.fields.label = matchedCard.fields.labels.join(",");

          const jiraCardResponse = new JiraCardResponse(
            matchedCard,
            cycleTimeInfos,
            originCycleTimeInfos
          );

          jiraCardResponse.cardCycleTime = CalculateCardCycleTime(
            jiraCardResponse,
            boardColumns
          );
          matchedCards.push(jiraCardResponse);

          storyPointSum += matchedCard.fields.storyPoints
            ? matchedCard.fields.storyPoints
            : 0;
        }
      })
    );

    return {
      storyPointSum,
      cardsNumber: matchedCards.length,
      matchedCards: matchedCards,
    };
  }

  async getStoryPointsAndCycleTimeForNonDoneCards(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[] = [],
    users: string[]
  ): Promise<Cards> {
    this.saveCostumedFieldKey(model);

    let storyPointSum = 0;
    let allNonDoneCards = await this.getAllNonDoneCardsForActiveSprint(model);
    if (allNonDoneCards.length < 1) {
      allNonDoneCards = await this.getAllNonDoneCardsForKanBan(model);
    }
    const matchedNonDoneCards = Array.of<JiraCardResponse>();

    await Promise.all(
      allNonDoneCards.map(async function (nonDoneCard: any) {
        const { cycleTimeInfos, assigneeSet, originCycleTimeInfos } =
          await Jira.getCycleTimeAndAssigneeSet(
            nonDoneCard.key,
            model.token,
            model.site,
            model.treatFlagCardAsBlock
          );

        const matchedNonDoneCard = Jira.processCustomFieldsForCard(nonDoneCard);
        matchedNonDoneCard.fields.label =
          matchedNonDoneCard.fields.labels.join(",");

        const jiraCardResponse = new JiraCardResponse(
          matchedNonDoneCard,
          cycleTimeInfos,
          originCycleTimeInfos
        );

        jiraCardResponse.cardCycleTime = CalculateCardCycleTime(
          jiraCardResponse,
          boardColumns
        );
        matchedNonDoneCards.push(jiraCardResponse);

        storyPointSum += matchedNonDoneCard.fields.storyPoints
          ? matchedNonDoneCard.fields.storyPoints
          : 0;
      })
    );

    return {
      storyPointSum,
      cardsNumber: matchedNonDoneCards.length,
      matchedCards: matchedNonDoneCards,
    };
  }

  private async getAllDoneCards(
    model: StoryPointsAndCycleTimeRequest
  ): Promise<any> {
    let jql = "";
    if (model.status.length > 0) {
      switch (model.type.toLowerCase()) {
        case KanbanEnum.JIRA:
          jql = `status in ('${model.status.join("','")}')`;
          break;
        case KanbanEnum.CLASSIC_JIRA: {
          let subJql = "";
          for (let index = 0; index < model.status.length - 1; index++) {
            subJql += `status changed to '${model.status[index]}' during (${model.startTime}, ${model.endTime}) or `;
          }
          subJql += `status changed to '${
            model.status[model.status.length - 1]
          }' during (${model.startTime}, ${model.endTime})`;
          jql = `status in ('${model.status.join("','")}') AND (${subJql})`;
          break;
        }
      }
    }

    const response = await this.httpClient.get(
      `/${model.boardId}/issue?maxResults=${this.queryCount}&jql=${jql}`
    );

    const allDoneCardsResponse = response.data;
    const allDoneCards = allDoneCardsResponse.issues;
    if (allDoneCardsResponse.total > this.queryCount) {
      await this.pageQuerying(
        allDoneCardsResponse.total,
        jql,
        allDoneCards,
        model.boardId
      );
    }

    if (model.type.toLowerCase() == KanbanEnum.JIRA) {
      const allDoneCardsResult = allDoneCards.filter(
        (DoneCard: { fields: { statuscategorychangedate: string } }) =>
          Jira.matchTime(
            DoneCard.fields.statuscategorychangedate,
            model.startTime,
            model.endTime
          )
      );
      return allDoneCardsResult;
    }
    return allDoneCards;
  }

  private async getAllNonDoneCardsForActiveSprint(
    model: StoryPointsAndCycleTimeRequest
  ): Promise<any> {
    let jql = "sprint in openSprints() ";
    if (model.status.length > 0) {
      jql = `sprint in openSprints() AND status not in ('${model.status.join(
        "','"
      )}')`;
    }

    const response = await this.httpClient.get(
      `/${model.boardId}/issue?maxResults=${this.queryCount}&jql=${jql}`
    );

    const allNonDoneCardsResponse = response.data;
    const allNonDoneCards = allNonDoneCardsResponse.issues;
    if (allNonDoneCardsResponse.total > this.queryCount) {
      await this.pageQuerying(
        allNonDoneCardsResponse.total,
        jql,
        allNonDoneCards,
        model.boardId
      );
    }

    return allNonDoneCards;
  }

  private async getAllNonDoneCardsForKanBan(
    model: StoryPointsAndCycleTimeRequest
  ): Promise<any> {
    let jql = "";
    if (model.status.length > 0) {
      jql = `status not in ('${model.status.join("','")}')`;
    }

    const response = await this.httpClient.get(
      `/${model.boardId}/issue?maxResults=${this.queryCount}&jql=${jql}`
    );

    const allNonDoneCardsResponse = response.data;
    const allNonDoneCards = allNonDoneCardsResponse.issues;
    if (allNonDoneCardsResponse.total > this.queryCount) {
      await this.pageQuerying(
        allNonDoneCardsResponse.total,
        jql,
        allNonDoneCards,
        model.boardId
      );
    }

    const allNonDoneCardsResult = allNonDoneCards.filter(
      (nonDoneCard: { fields: { fixVersions: FixVersion[] } }) =>
        nonDoneCard.fields.fixVersions.length < 1
    );
    return allNonDoneCardsResult;
  }

  private async pageQuerying(
    total: any,
    jql: string,
    cards: any,
    boardId: string
  ): Promise<void> {
    const count = Math.floor((total as number) / this.queryCount);
    await Promise.all(
      [...Array(count).keys()].map(async (i) => {
        const startAt = this.queryCount * (i + 1);
        await this.httpClient
          .get(
            `/${boardId}/issue/?maxResults=${this.queryCount}&startAt=${startAt}&jql=${jql}`
          )
          .then((response) => cards.push(...response.data.issues));
      })
    );
  }

  private saveCostumedFieldKey(model: StoryPointsAndCycleTimeRequest): void {
    model.targetFields.forEach(function (value) {
      switch (value.name) {
        case CardFieldsEnum.STORY_POINTS_JIRA_CLASSIC:
          CardCustomFieldKey.STORY_POINTS = value.key;
          break;
        case CardFieldsEnum.STORY_POINTS_JIRA_NEXT_GEN:
          CardCustomFieldKey.STORY_POINTS = value.key;
          break;
        case CardFieldsEnum.SPRINT:
          CardCustomFieldKey.SPRINT = value.key;
          break;
        case CardFieldsEnum.FLAGGED:
          CardCustomFieldKey.FLAGGED = value.key;
          break;
      }
    });
  }

  private static processCustomFieldsForCard(card: any): any {
    const fields = card.fields;
    for (const key in fields) {
      switch (key) {
        case CardCustomFieldKey.STORY_POINTS:
          card.fields.storyPoints = fields[key];
          break;
        case CardCustomFieldKey.SPRINT:
          card.fields.sprint = Jira.generateSprintName(fields[key]);
          break;
      }
    }
    return card;
  }

  private static generateSprintName(sprintField: [any]): string {
    if (
      sprintField == undefined ||
      sprintField == null ||
      sprintField.length < 1
    )
      return "";

    const targetField = sprintField[sprintField.length - 1];

    if (targetField.name) return targetField.name;

    const fields = sprintField[sprintField.length - 1].split(",");
    for (const index in fields) {
      if (fields[index].split("=")[0].trim() == "name") {
        return fields[index].split("=")[1];
      }
    }

    return "";
  }

  static async getCycleTimeAndAssigneeSet(
    jiraCardKey: string,
    jiraToken: string,
    jiraSite: string,
    treatFlagCardAsBlock: boolean
  ): Promise<{
    cycleTimeInfos: CycleTimeInfo[];
    assigneeSet: Set<string>;
    originCycleTimeInfos: CycleTimeInfo[];
  }> {
    const jiraCardHistoryResponse = await axios.get(
      `https://${jiraSite}.atlassian.net/rest/internal/2/issue/${jiraCardKey}/activityfeed`,
      {
        headers: { Authorization: `${jiraToken}` },
      }
    );

    const jiraCardHistory: JiraCardHistory = jiraCardHistoryResponse.data;

    const statusChangedArray = this.putStatusChangeEventsIntoAnArray(
      jiraCardHistory,
      treatFlagCardAsBlock
    );
    const statusChangeArrayWithoutFlag = this.putStatusChangeEventsIntoAnArray(
      jiraCardHistory,
      true
    );
    const cycleTimeInfos = getCardTimeForEachStep(
      reformTimeLineForFlaggedCards(statusChangedArray)
    );
    const originCycleTimeInfos = getCardTimeForEachStep(
      reformTimeLineForFlaggedCards(statusChangeArrayWithoutFlag)
    );

    const assigneeList = jiraCardHistory.items
      .filter(
        (value) => "assignee" == value.fieldId && value.to.displayValue != null
      )
      .map((value) => {
        return value.to.displayValue;
      });

    return {
      cycleTimeInfos,
      assigneeSet: new Set<string>(assigneeList),
      originCycleTimeInfos,
    };
  }

  private static matchTime(
    cardTime: string,
    startTime: number,
    endTime: number
  ): boolean {
    return startTime <= Date.parse(cardTime) && Date.parse(cardTime) <= endTime;
  }

  private static putStatusChangeEventsIntoAnArray(
    jiraCardHistory: JiraCardHistory,
    treatFlagCardAsBlock: boolean
  ): StatusChangedArrayItem[] {
    const statusChangedArray: StatusChangedArrayItem[] = [];
    const statusActivities = jiraCardHistory.items.filter(
      (activity) => "status" == activity.fieldId
    );
    if (jiraCardHistory.items.length > 0 && statusActivities.length > 0) {
      statusChangedArray.push({
        timestamp: jiraCardHistory.items[0].timestamp - 1,
        status: statusActivities[0].from.displayValue,
      });
      jiraCardHistory.items
        .filter((activity) => "status" == activity.fieldId)
        .forEach((activity: HistoryDetail) => {
          statusChangedArray.push({
            timestamp: activity.timestamp,
            status: activity.to.displayValue,
          });
        });
    }
    if (treatFlagCardAsBlock)
      jiraCardHistory.items
        .filter((activity) => CardCustomFieldKey.FLAGGED == activity.fieldId)
        .forEach((activity: HistoryDetail) => {
          if (activity.to.displayValue == "Impediment")
            statusChangedArray.push({
              timestamp: activity.timestamp,
              status: CardStepsEnum.FLAG,
            });
          else {
            statusChangedArray.push({
              timestamp: activity.timestamp,
              status: CardStepsEnum.REMOVEFLAG,
            });
          }
        });
    return statusChangedArray;
  }

  public async getSprintStatistics(
    model: StoryPointsAndCycleTimeRequest,
    cards: Cards
  ): Promise<SprintStatistics> {
    const matchedCards = cards.matchedCards;
    const sprintCardsMap = this.mapCardsBySprintName(matchedCards!);
    const sprints = await this.getAllSprintsByBoardId(model);
    const activeAndClosedSprints = this.getActiveAndClosedSprints(sprints);

    const unorderedSprintBlockPercentageMap: Map<
      string,
      BlockedAndDevelopingPercentagePair
    > = this.calculateBlockedAndDevelopingPercentage(sprintCardsMap);
    const sprintBlockPercentageMap = this.sortBySprintStartDate(
      unorderedSprintBlockPercentageMap,
      activeAndClosedSprints
    );

    const unorderedSprintStandardDeviationMap: Map<
      string,
      StandardDeviationAndAveragePair
    > = this.calculateStandardDeviation(sprintCardsMap);
    const sprintStandardDeviationMap = this.sortBySprintStartDate(
      unorderedSprintStandardDeviationMap,
      activeAndClosedSprints
    );

    const unorderedSprintCompletedCardsNumberMap: Map<string, number> =
      this.calculateCompletedCardsNumber(sprintCardsMap);
    const sprintCompletedCardsNumberMap = this.sortBySprintStartDate(
      unorderedSprintCompletedCardsNumberMap,
      activeAndClosedSprints
    );

    const sprintBlockReasonPercentages = this.calculateBlockReasonPercentage(
      activeAndClosedSprints,
      sprintCardsMap
    );

    const cycleTimeAndBlockedTime =
      this.calculateTotalCycleTimeAndBlockedTime(sprintCardsMap);
    return this.generateJiraSprintStatistics(
      sprintCompletedCardsNumberMap,
      sprintBlockPercentageMap,
      sprintStandardDeviationMap,
      sprintBlockReasonPercentages,
      cycleTimeAndBlockedTime
    );
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

  private calculateBlockReasonPercentage(
    sprints: Sprint[],
    sprintCardsMap: Map<string, JiraCardResponse[]>
  ): Array<BlockedReason> {
    const sprintBlockedResaon: Array<BlockedReason> = [];
    for (const sprintCardEntry of sprintCardsMap) {
      if (
        !sprints.filter((sprint) => sprint.name === sprintCardEntry[0]).length
      ) {
        break;
      }
      let cycleTime = 0;
      let blockedTime = 0;
      const blockedTimeForEveryReasonMap: Map<string, number> =
        this.initBlockedTimeMap();
      for (const card of sprintCardEntry[1]) {
        cycleTime += card.getTotalOrZero();
        blockedTime += card.cardCycleTime!.steps.blocked || 0;
        let blockReason = card.baseInfo.fields.label || "";

        if (!blockedTimeForEveryReasonMap.has(blockReason)) {
          blockReason = JiraBlockReasonEnum.OTHERS;
        }

        const currentBlockTime =
          (blockedTimeForEveryReasonMap.get(blockReason) || 0) +
          card.cardCycleTime!.steps.blocked;

        blockedTimeForEveryReasonMap.set(blockReason, currentBlockTime);
      }
      if (cycleTime) {
        const blockedReasonAndPercenagePairs: Array<BlockDetails> = [];
        for (const pairEntry of blockedTimeForEveryReasonMap) {
          blockedReasonAndPercenagePairs.push({
            reasonName: pairEntry[0],
            percentage: parseFloat((pairEntry[1] / cycleTime).toFixed(2)),
            time: pairEntry[1],
          });
        }
        sprintBlockedResaon.push({
          sprintName: sprintCardEntry[0],
          totalBlockedPercentage: parseFloat(
            (blockedTime / cycleTime).toFixed(2)
          ),
          blockDetails: blockedReasonAndPercenagePairs,
        });
      }
    }
    return sprintBlockedResaon;
  }

  private mapCardsBySprintName(
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

  private calculateTotalCycleTimeAndBlockedTime(
    sprintCardMap: Map<string, JiraCardResponse[]>
  ): Array<SprintCycleTimeAndBlockedTime> {
    const sprintCycleTimeAndBlockedTime: Array<SprintCycleTimeAndBlockedTime> =
      [];
    sprintCardMap.forEach((value, key) => {
      let cycleTime = 0;
      let blockedTime = 0;
      for (const card of value) {
        cycleTime += card.getTotalOrZero();
        blockedTime += card.cardCycleTime!.steps.blocked || 0;
      }
      sprintCycleTimeAndBlockedTime.push({
        sprintName: key,
        cycleTime,
        blockedTime,
      });
    });
    return sprintCycleTimeAndBlockedTime;
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

  private calculateBlockedAndDevelopingPercentage(
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

  private calculateStandardDeviation(
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

  private calculateCompletedCardsNumber(
    sprintCardsMap: Map<string, JiraCardResponse[]>
  ): Map<string, number> {
    const sprintCompletedCardsNumberMap = new Map<string, number>();

    sprintCardsMap.forEach((cards, sprint) => {
      sprintCompletedCardsNumberMap.set(sprint, cards.length);
    });

    return sprintCompletedCardsNumberMap;
  }

  private generateJiraSprintStatistics(
    sprintCompletedCardsNumberMap: Map<string, number>,
    sprintBlockPercentageMap: Map<string, BlockedAndDevelopingPercentagePair>,
    sprintStandardDeviationMap: Map<string, StandardDeviationAndAveragePair>,
    sprintBlockReason: Array<BlockedReason>,
    cycleTimeAndBlockedTime: Array<SprintCycleTimeAndBlockedTime>
  ): SprintStatistics {
    const completedCardsNumber: Array<SprintCompletedCardsCount> = [];
    const blockedAndDevelopingPercentage: Array<BlockedAndDevelopingPercentage> =
      [];
    const standardDeviation: Array<StandardDeviation> = [];
    sprintCompletedCardsNumberMap.forEach((value, key) => {
      completedCardsNumber.push({ sprintName: key, value });
    });
    sprintBlockPercentageMap.forEach((value, key) => {
      blockedAndDevelopingPercentage.push({
        sprintName: key,
        value,
      });
    });
    sprintStandardDeviationMap.forEach((value, key) => {
      standardDeviation.push({
        sprintName: key,
        value,
      });
    });
    return new SprintStatistics(
      completedCardsNumber,
      standardDeviation,
      blockedAndDevelopingPercentage,
      sprintBlockReason,
      cycleTimeAndBlockedTime
    );
  }
}
