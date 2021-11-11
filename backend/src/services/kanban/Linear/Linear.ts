import { Kanban } from "../Kanban";
import { StoryPointsAndCycleTimeRequest } from "../../../contract/kanban/KanbanStoryPointParameterVerify";
import {
  ColumnValue,
  JiraColumnResponse,
} from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { Cards } from "../../../models/kanban/RequestKanbanResults";
import { RequestKanbanColumnSetting } from "../../../contract/GenerateReporter/GenerateReporterRequestBody";
import { IssueHistory, LinearClient } from "@linear/sdk";
import { statusChangedArrayItem } from "../Jira/Jira";
import { calculateWorkDaysBy24Hours } from "../../common/WorkDayCalculate";
import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../../contract/kanban/KanbanStoryPointResponse";

export class Linear implements Kanban {
  private client: LinearClient;

  constructor(token: string) {
    this.client = new LinearClient({
      apiKey: token,
    });
  }

  async getJiraColumns(): Promise<JiraColumnResponse[]> {
    const workflows = await this.client.workflowStates();
    const columns = workflows.nodes.map((workflow) => {
      const columnValue = new ColumnValue();
      columnValue.statuses = [workflow.type];
      const columnResponse = new JiraColumnResponse();
      columnResponse.key = workflow.type;
      columnResponse.value = columnValue;
      return columnResponse;
    });
    return Promise.resolve(columns);
  }

  async getStoryPointsAndCycleTime(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[],
    users: string[]
  ): Promise<Cards> {
    const allCards = await this.client.issues({
      includeArchived: false,
    });

    const matchedCards: JiraCardResponse[] = [];
    let storyPointSum = 0;

    for (const card of allCards.nodes) {
      const cardCreateTime = card.createdAt.getTime();
      if (cardCreateTime > model.startTime && cardCreateTime < model.endTime) {
        const cardHistory = await card.history();
        const cycleTimeInfo = await Linear.getCardTimeForEachStep(
          cardHistory.nodes
        );
        const cardResponse = new JiraCardResponse(
          card,
          cycleTimeInfo,
          cycleTimeInfo
        );
        matchedCards.push(cardResponse);
        storyPointSum += card.estimate || 0;
      }
    }

    const cardsNumber = matchedCards.length;

    return Promise.resolve({ storyPointSum, cardsNumber, matchedCards });
  }

  getStoryPointsAndCycleTimeForNonDoneCards(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[],
    users: string[]
  ): Promise<Cards> {
    return Promise.resolve(undefined as any);
  }

  private static async putStatusChangeEventsIntoAnArray(
    cardHistory: IssueHistory[]
  ): Promise<statusChangedArrayItem[]> {
    const statusChangedArray: statusChangedArrayItem[] = [];
    const statusActivities = cardHistory.filter((activity) => activity.toState);
    if (cardHistory.length > 0 && statusActivities.length > 0) {
      statusChangedArray.push({
        timestamp: cardHistory[0].createdAt.getTime(),
        status: (await statusActivities[0].toState)?.name || "",
      });
      for (const activity of statusActivities) {
        statusChangedArray.push({
          timestamp: activity.createdAt.getTime(),
          status: (await statusActivities[0].toState)?.name || "",
        });
      }
    }
    return statusChangedArray;
  }

  private static getAssigneeArray(cardHistory: IssueHistory[]) {
    const assigneeArray = new Set();
    cardHistory.forEach((activity) => {
      if (activity.fromAssignee) {
        assigneeArray.add(activity.fromAssignee);
        assigneeArray.add(activity.toAssignee);
      }
    });
    return assigneeArray;
  }

  private static async getCardTimeForEachStep(
    cardHistory: IssueHistory[]
  ): Promise<CycleTimeInfo[]> {
    const statusChangedArray: statusChangedArrayItem[] = await this.putStatusChangeEventsIntoAnArray(
      cardHistory
    );

    const timeLine = statusChangedArray.sort(
      (a, b) => a.timestamp - b.timestamp
    );

    const result = new Map<string, number>();
    timeLine.forEach(
      (statusChangedArrayItem, index, statusChangedArrayItems) => {
        const addedTime = result.get(
          statusChangedArrayItem.status.toUpperCase()
        );
        const costedTime = Linear.getThisStepCostTime(
          index,
          statusChangedArrayItems
        );
        const value = addedTime
          ? +(costedTime + addedTime).toFixed(2)
          : +costedTime.toFixed(2);
        result.set(statusChangedArrayItem.status.toUpperCase(), value);
      }
    );
    const cycleTimeInfos: CycleTimeInfo[] = [];
    result.forEach(function (value, key) {
      cycleTimeInfos.push(new CycleTimeInfo(key, value));
    });
    return cycleTimeInfos;
  }

  private static getThisStepCostTime(
    index: number,
    statusChangedArrayItems: statusChangedArrayItem[]
  ): number {
    if (index < statusChangedArrayItems.length - 1)
      return calculateWorkDaysBy24Hours(
        statusChangedArrayItems[index].timestamp,
        statusChangedArrayItems[index + 1].timestamp
      );
    return calculateWorkDaysBy24Hours(
      statusChangedArrayItems[index].timestamp,
      Date.now()
    );
  }
}

export enum LinearColumnType {
  BACKLOG = "backlog",
  UNSTARTED = "unstarted",
  CANCELED = "canceled",
  COMPLETED = "completed",
  STARTED = "started",
}
