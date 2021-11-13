import { Kanban } from "../Kanban";
import { StoryPointsAndCycleTimeRequest } from "../../../contract/kanban/KanbanStoryPointParameterVerify";
import {
  ColumnValue,
  JiraColumnResponse,
} from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { Cards } from "../../../models/kanban/RequestKanbanResults";
import { RequestKanbanColumnSetting } from "../../../contract/GenerateReporter/GenerateReporterRequestBody";
import { IssueHistory, LinearClient } from "@linear/sdk";
import { JiraCardResponse } from "../../../contract/kanban/KanbanStoryPointResponse";
import {
  confirmThisCardHasAssignedBySelectedUser,
  getCardTimeForEachStep,
  sortStatusChangedArray,
  StatusChangedArrayItem,
  transformLinearCardToJiraCard,
} from "../util";

export class Linear implements Kanban {
  private client: LinearClient;

  constructor(token: string) {
    this.client = new LinearClient({
      apiKey: token,
    });
  }

  async getColumns(): Promise<JiraColumnResponse[]> {
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
    console.log("start get cards");
    const allCards = await this.client.issues({
      includeArchived: false,
    });

    console.log("all cards", allCards.nodes.length);

    const matchedCards: JiraCardResponse[] = [];
    let storyPointSum = 0;

    for (const card of allCards.nodes) {
      const cardCreateTime = card.createdAt.getTime();
      console.log(card.branchName, cardCreateTime);
      if (cardCreateTime > model.startTime && cardCreateTime < model.endTime) {
        const cardHistory = await card.history();
        const assigneeSet = await Linear.getAssigneeSet(cardHistory.nodes);
        if (confirmThisCardHasAssignedBySelectedUser(users, assigneeSet)) {
          console.log(card.branchName);
          const statusChangedArray: StatusChangedArrayItem[] = await Linear.putStatusChangeEventsIntoAnArray(
            cardHistory.nodes
          );
          const cycleTimeInfo = getCardTimeForEachStep(
            statusChangedArray,
            sortStatusChangedArray(statusChangedArray)
          );
          const cardResponse = new JiraCardResponse(
            await transformLinearCardToJiraCard(card),
            cycleTimeInfo,
            cycleTimeInfo
          );
          matchedCards.push(cardResponse);
          storyPointSum += card.estimate || 0;
        }
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
    return Promise.resolve({
      matchedCards: [],
      storyPointSum: 0,
      cardsNumber: 0,
    } as any);
  }

  private static async putStatusChangeEventsIntoAnArray(
    cardHistory: IssueHistory[]
  ): Promise<StatusChangedArrayItem[]> {
    const statusChangedArray: StatusChangedArrayItem[] = [];
    const statusActivities = cardHistory.filter(
      (activity) => activity.fromState
    );
    if (cardHistory.length > 0 && statusActivities.length > 0) {
      statusChangedArray.push({
        timestamp: cardHistory[0].createdAt.getTime(),
        status: (await statusActivities[0].fromState)?.name || "",
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

  private static async getAssigneeSet(
    cardHistory: IssueHistory[]
  ): Promise<Set<string>> {
    const assigneeArray = new Set<string>();
    for (const activity of cardHistory) {
      const assignee = await activity.toAssignee;
      if (assignee) {
        assigneeArray.add(assignee.displayName);
      }
    }
    return assigneeArray;
  }
}

export enum LinearColumnType {
  BACKLOG = "backlog",
  UNSTARTED = "unstarted",
  CANCELED = "canceled",
  COMPLETED = "completed",
  STARTED = "started",
}
