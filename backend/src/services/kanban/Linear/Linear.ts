import { Kanban } from "../Kanban";
import { StoryPointsAndCycleTimeRequest } from "../../../contract/kanban/KanbanStoryPointParameterVerify";
import {
  ColumnValue,
  ColumnResponse,
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
import {
  IssueConnection,
  WorkflowStateConnection,
} from "@linear/sdk/dist/_generated_sdk";
import { sortBy } from "lodash";
import { SprintStatistics } from "../../../models/kanban/SprintStatistics";
import { SprintStatisticsError } from "../../../errors/SprintStatisticsError";

export enum LinearColumnType {
  BACKLOG = "backlog",
  UNSTARTED = "unstarted",
  CANCELED = "canceled",
  COMPLETED = "completed",
  STARTED = "started",
  BLOCK = "block",
}

export function transformWorkflowToJiraColumn(
  workflows: WorkflowStateConnection
): ColumnResponse[] {
  return workflows.nodes.map((workflow) => {
    const columnValue = new ColumnValue();
    columnValue.name = workflow.name;
    columnValue.statuses = [workflow.type];
    const jiraColumn = new ColumnResponse();
    jiraColumn.key = workflow.type;
    jiraColumn.value = columnValue;
    return jiraColumn;
  });
}

export class Linear implements Kanban {
  private client: LinearClient;

  constructor(token: string) {
    this.client = new LinearClient({
      apiKey: token,
    });
  }

  async getColumns(
    model: StoryPointsAndCycleTimeRequest
  ): Promise<ColumnResponse[]> {
    const workflows = await this.client.workflowStates({
      filter: {
        team: { name: { eq: model.project } },
      },
    });
    return transformWorkflowToJiraColumn(workflows);
  }

  async getStoryPointsAndCycleTime(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[],
    users: string[]
  ): Promise<Cards> {
    const assignees = users.map((user) => ({ name: { eq: user } }));

    const allCards = await this.client.issues({
      filter: {
        completedAt: {
          gte: new Date(model.startTime),
          lte: new Date(model.endTime),
        },
        team: {
          name: { eq: model.project },
        },
        state: {
          type: { eq: LinearColumnType.COMPLETED },
        },
        assignee: {
          or: assignees,
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
        team: {
          name: { eq: model.project },
        },
        state: {
          type: { neq: LinearColumnType.COMPLETED },
        },
      },
    });
    return this.generateCardsCycleTime(allCards, users);
  }

  private static async getAssigneeSet(
    activities: IssueHistory[]
  ): Promise<Set<string>> {
    const assigneeSet = new Set<string>();
    for (const activity of activities) {
      const toAssignee = await activity.toAssignee;
      if (toAssignee) assigneeSet.add(toAssignee.name);
    }
    return assigneeSet;
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
      if (confirmThisCardHasAssignedBySelectedUser(users, assigneeSet)) {
        const statusChangedArray: StatusChangedArrayItem[] =
          await Linear.putStatusChangeEventsIntoAnArray(cardHistory.nodes);
        const cycleTimeInfo = getCardTimeForEachStep(
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
    const sortedActivities = sortBy(cardHistory, "createdAt");

    const sortedAndStateRelatedHistory = sortedActivities.filter(
      (item) => item.fromState || item.toState
    );

    const firstActivity = sortedActivities[0];

    if (sortedAndStateRelatedHistory.length === 0) {
      return [
        {
          timestamp: firstActivity.createdAt.getTime(),
          status: (await (await firstActivity.issue)?.state)?.name || "",
        },
      ];
    }

    const stateChanged = await Promise.all(
      sortedAndStateRelatedHistory.map(async (activity) => ({
        timestamp: activity.createdAt.getTime(),
        status: (await activity.toState)?.name || "",
      }))
    );

    return [
      {
        timestamp: firstActivity.createdAt.getTime(),
        status: (await sortedAndStateRelatedHistory[0].fromState)?.name || "",
      },
      ...stateChanged,
    ];
  }

  public async getSprintStatistics(
    model: StoryPointsAndCycleTimeRequest,
    cards: Cards
  ): Promise<SprintStatistics> {
    throw new SprintStatisticsError(
      "Sprint statistics for Linear is not available."
    );
  }
}
