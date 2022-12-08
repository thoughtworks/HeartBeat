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
} from "../../../models/kanban/JiraCardHistory";
import { CalculateCardCycleTime } from "../CalculateCycleTime";
import { RequestKanbanColumnSetting } from "../../../contract/GenerateReporter/GenerateReporterRequestBody";
import { Cards } from "../../../models/kanban/RequestKanbanResults";
import {
  CardCustomFieldKey,
  FixVersion,
} from "../../../models/kanban/JiraCard";
import { CardFieldsEnum } from "../../../models/kanban/CardFieldsEnum";
import { CardStepsEnum } from "../../../models/kanban/CardStepsEnum";
import {
  confirmThisCardHasAssignedBySelectedUser,
  getCardTimeForEachStep,
  reformTimeLineForFlaggedCards,
  StatusChangedArrayItem,
} from "../util";

export class Jira implements Kanban {
  private readonly queryCount: number = 100;
  private readonly httpClient: AxiosInstance;

  constructor(token: string, site: string) {
    this.httpClient = axios.create({
      baseURL: `https://${site}.atlassian.net/rest/agile/1.0/board`,
    });
    this.httpClient.defaults.headers.common["Authorization"] = token;
  }

  async getColumns(
    model: StoryPointsAndCycleTimeRequest
  ): Promise<ColumnResponse[]> {
    const jiraColumnNames = Array.of<ColumnResponse>();
    //column
    const configurationUrl = `https://${model.site}.atlassian.net/rest/agile/1.0/board/${model.boardId}/configuration`;
    console.log(`Start to query configuration_url:${configurationUrl}`);
    const configurationResponse = await axios.get(configurationUrl, {
      headers: { Authorization: `${model.token}` },
    });
    console.log(
      `Successfully queried configuration_data:${JSON.stringify(
        configurationResponse.data
      )}`
    );

    const configuration = configurationResponse.data;
    const columns = configuration.columnConfig.columns;

    columns.map(async (column: any) => {
      if (column.statuses.length != 0) {
        const columnValue: ColumnValue = new ColumnValue();
        columnValue.name = column.name;

        const jiraColumnResponse = new ColumnResponse();
        await Promise.all(
          column.statuses.map(async (status: { self: string }) => {
            const queryStatusUri = status.self;
            const statusResponse = await Jira.queryStatus(
              queryStatusUri,
              model.token
            );
            const cardStatusName = (
              statusResponse as StatusSelf
            ).untranslatedName.toUpperCase();
            columnValue.statuses.push(cardStatusName);
          })
        ).then(() => {
          jiraColumnResponse.value = columnValue;
          jiraColumnNames.push(jiraColumnResponse);
        });
      }
    });
    return jiraColumnNames;
  }

  private static async queryStatus(
    url: string,
    token: string
  ): Promise<StatusSelf> {
    console.log(`Start to query card status_url:${url}`);
    const http = axios.create();
    http.defaults.headers.common["Authorization"] = token;
    const result = await http.get(url);
    console.log(
      `Successfully queried card status_data:${JSON.stringify(result.data)}`
    );
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
          jql = `status in ('${model.status.join(
            "','"
          )}') AND statusCategoryChangedDate >= ${
            model.startTime
          } AND statusCategoryChangedDate <= ${model.endTime}`;
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
}
