import { Kanban } from "../Kanban";
import sortBy from "lodash/sortBy";
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
import { IssueConnection } from "@linear/sdk/dist/_generated_sdk";

export enum LinearColumnType {
  BACKLOG = "backlog",
  UNSTARTED = "unstarted",
  CANCELED = "canceled",
  COMPLETED = "completed",
  STARTED = "started",
  BLOCK = "block",
}

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
      filter: {
        updatedAt: {
          lte: new Date(model.endTime),
          gte: new Date(model.startTime),
        },
        team: { id: { eq: model.project } },
        state: {
          type: { eq: LinearColumnType.COMPLETED },
        },
      },
    });

    return this.generateCardsCycleTime(allCards, users);
  }

  async getStoryPointsAndCycleTimeForNonDoneCards(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[],
    users: string[]
  ): Promise<Cards> {
    const allCards = await this.client.issues({
      filter: {
        updatedAt: {
          lte: new Date(model.endTime),
          gte: new Date(model.startTime),
        },
        team: { id: { eq: model.project } },
        state: {
          name: { neq: LinearColumnType.COMPLETED },
        },
      },
    });

    return this.generateCardsCycleTime(allCards, users);
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

  private async generateCardsCycleTime(
    allCards: IssueConnection,
    users: string[]
  ): Promise<Cards> {
    const matchedCards: JiraCardResponse[] = [];
    let storyPointSum = 0;

    for (const card of allCards.nodes) {
      const cardHistory = await card.history();
      const assigneeSet = await Linear.getAssigneeSet(cardHistory.nodes);
      console.log(assigneeSet);
      if (confirmThisCardHasAssignedBySelectedUser(users, assigneeSet)) {
        console.log("start calculate", card.branchName);
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

    const cardsNumber = matchedCards.length;

    return { storyPointSum, cardsNumber, matchedCards };
  }

  private static async putStatusChangeEventsIntoAnArray(
    cardHistory: IssueHistory[]
  ): Promise<StatusChangedArrayItem[]> {
    const statusChangedArray: StatusChangedArrayItem[] = [];
    const statusActivities = cardHistory.filter(
      (activity) => activity.fromState
    );
    const sortedActivities = sortBy(statusActivities, (activity) => {
      return activity.createdAt;
    });
    if (cardHistory.length > 0 && sortedActivities.length > 0) {
      statusChangedArray.push({
        timestamp: cardHistory[0].createdAt.getTime(),
        status: (await sortedActivities[0].fromState)?.name || "",
      });
      for (const activity of sortedActivities) {
        statusChangedArray.push({
          timestamp: activity.createdAt.getTime(),
          status: (await activity.toState)?.name || "",
        });
      }
    }
    return statusChangedArray;
  }
}
