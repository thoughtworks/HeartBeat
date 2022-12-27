import { KanbanVerifyToken } from "../KanbanVerifyToken";
import axios, { AxiosInstance } from "axios";
import { KanbanTokenVerifyModel } from "../../../contract/kanban/KanbanTokenVerify";
import {
  ColumnValue,
  ColumnResponse,
  KanbanTokenVerifyResponse,
  TargetField,
} from "../../../contract/kanban/KanbanTokenVerifyResponse";
import { fieldsIgonre } from "../../../models/kanban/JiraCardtype";
import { JiraCardHistory } from "../../../models/kanban/JiraCardHistory";
import { StatusSelf } from "../../../models/kanban/JiraBoard/StatusSelf";
import { KanbanEnum } from "../Kanban";
import { ThereIsNoCardsInDoneColumn } from "../../../types/ThereIsNoCardsInDoneColumn";
import logger from "../../../utils/loggerUtils";

export class JiraVerifyToken implements KanbanVerifyToken {
  private readonly queryCount: number = 100;
  private readonly httpClient: AxiosInstance;

  constructor(token: string, site: string) {
    this.httpClient = axios.create({
      baseURL: `https://${site}.atlassian.net/rest/api/2`,
    });
    this.httpClient.defaults.headers.common["Authorization"] = token;
  }

  async verifyTokenAndGetColumnsAndUser(
    model: KanbanTokenVerifyModel
  ): Promise<KanbanTokenVerifyResponse> {
    const jiraColumnNames = Array.of<ColumnResponse>();

    const doneColumn = Array.of<string>();

    //column
    const boardConfigurationUrl = `https://${model.site}.atlassian.net/rest/agile/1.0/board/${model.boardId}/configuration`;
    logger.info(
      `Start to get configuration for board_url: ${boardConfigurationUrl}`
    );

    const configurationResponse = await axios.get(boardConfigurationUrl, {
      headers: { Authorization: `${model.token}` },
    });

    logger.info(
      `Successfully get configuration_data: ${JSON.stringify(
        configurationResponse.data
      )}`
    );

    const configuration = configurationResponse.data;

    const columns = configuration.columnConfig.columns;

    await Promise.all(
      columns.map((column: any) =>
        this.getJiraColumnNames(column, model, doneColumn, jiraColumnNames)
      )
    );

    //user
    const userNames = await this.queryUsersByCards(model, doneColumn);

    //targetField
    const fieldResponse = await this.httpClient.get(
      `/issue/createmeta?projectKeys=${model.projectKey}&expand=projects.issuetypes.fields`
    );
    const jiraCardTypeResponse: any[] = fieldResponse.data.projects;
    const issuetypes = jiraCardTypeResponse[0].issuetypes;
    const targetFields: Map<string, TargetField> = new Map();
    issuetypes.forEach(function (issuetype: any) {
      const fields = issuetype.fields;
      Object.values(fields).forEach((field) => {
        const obj: any = field;
        if (!fieldsIgonre.includes(obj.key) && !targetFields.has(obj.key)) {
          targetFields.set(obj.key, {
            key: obj.key,
            name: obj.name,
            flag: false,
          });
        }
      });
    });

    const response = new KanbanTokenVerifyResponse();
    response.targetFields = Array.from(targetFields.values());
    response.jiraColumns = jiraColumnNames;
    response.users = userNames;
    return response;
  }

  private async getJiraColumnNames(
    column: any,
    model: KanbanTokenVerifyModel,
    doneColumn: string[],
    jiraColumnNames: ColumnResponse[]
  ) {
    if (column.statuses.length == 0) {
      return;
    }

    const columnValue: ColumnValue = new ColumnValue();
    columnValue.name = column.name;

    const jiraColumnResponse = new ColumnResponse();
    let anyDoneKey = false;
    await Promise.all(
      column.statuses.map((status: { self: string }) =>
        JiraVerifyToken.queryStatus(status.self, model.token)
      )
    ).then((responses) => {
      responses.map((response) => {
        if (!anyDoneKey) {
          jiraColumnResponse.key = (response as StatusSelf).statusCategory.key;
        }
        columnValue.statuses.push(
          (response as StatusSelf).untranslatedName.toUpperCase()
        );
        if ((response as StatusSelf).statusCategory.key == "done") {
          doneColumn.push(
            (response as StatusSelf).untranslatedName.toUpperCase()
          );
          anyDoneKey = true;
        }
      });
      jiraColumnResponse.value = columnValue;
      jiraColumnNames.push(jiraColumnResponse);
    });
  }

  private static async queryStatus(
    url: string,
    token: string
  ): Promise<StatusSelf> {
    logger.info(`Start to query status_url:${url}`);
    const http = axios.create();
    http.defaults.headers.common["Authorization"] = token;
    const result = await http.get(url);
    logger.info(
      `Successfully queried status_data:${JSON.stringify(result.data)}`
    );
    return result.data;
  }

  private async queryUsersByCards(
    model: KanbanTokenVerifyModel,
    doneColumn: Array<string>
  ): Promise<Array<string>> {
    const userNames = new Set<string>();
    const users = Array.of<string>();

    const allDoneCards = await this.getAllDoneCards(model, doneColumn);

    if (allDoneCards.length == 0) {
      throw new ThereIsNoCardsInDoneColumn();
    }

    await Promise.all(
      allDoneCards.map(async function (DoneCard: any) {
        const assigneeSet = await JiraVerifyToken.getAssigneeSet(
          DoneCard.key,
          model.token,
          model.site
        );

        assigneeSet.forEach((assignee) => {
          userNames.add(assignee);
        });

        //fix the assignee not in the card history, only in the card field issue.
        if (
          assigneeSet.size == 0 &&
          DoneCard.fields.assignee &&
          DoneCard.fields.assignee.displayName
        ) {
          userNames.add(DoneCard.fields.assignee.displayName);
        }
      })
    );

    userNames.forEach((user) => {
      users.push(user);
    });
    return users;
  }

  private async getAllDoneCards(
    model: KanbanTokenVerifyModel,
    doneColumn: Array<string>
  ): Promise<any> {
    let jql = "";
    if (doneColumn.length > 0) {
      switch (model.type.toLowerCase()) {
        case KanbanEnum.JIRA:
          jql = `status in ('${doneColumn.join(
            "','"
          )}') AND statusCategoryChangedDate >= ${
            model.startTime
          } AND statusCategoryChangedDate <= ${model.endTime}`;
          break;
        case KanbanEnum.CLASSIC_JIRA: {
          let subJql = "";
          for (let index = 0; index < doneColumn.length - 1; index++) {
            subJql += `status changed to '${doneColumn[index]}' during (${model.startTime}, ${model.endTime}) or `;
          }
          subJql += `status changed to '${
            doneColumn[doneColumn.length - 1]
          }' during (${model.startTime}, ${model.endTime})`;
          jql = `status in ('${doneColumn.join("','")}') AND (${subJql})`;
          break;
        }
      }
    }

    const response = await axios.get(
      `https://${model.site}.atlassian.net/rest/agile/1.0/board/${model.boardId}/issue?maxResults=${this.queryCount}&jql=${jql}`,
      {
        headers: { Authorization: `${model.token}` },
      }
    );

    const allDoneCardsResponse = response.data;
    const allDoneCards = allDoneCardsResponse.issues;
    if (allDoneCardsResponse.total > this.queryCount) {
      await this.pageQuerying(
        model,
        allDoneCardsResponse.total,
        jql,
        allDoneCards
      );
    }
    return allDoneCards;
  }

  private async pageQuerying(
    model: KanbanTokenVerifyModel,
    total: number,
    jql: string,
    cards: any
  ): Promise<void> {
    const count = Math.floor(total / this.queryCount);
    await Promise.all(
      [...Array(count).keys()].map(async (i) => {
        const startAt = this.queryCount * (i + 1);
        await axios
          .get(
            `https://${model.site}.atlassian.net/rest/agile/1.0/board/${model.boardId}/issue?maxResults=${this.queryCount}&startAt=${startAt}&jql=${jql}`,
            {
              headers: { Authorization: `${model.token}` },
            }
          )
          .then((response) => cards.push(...response.data.issues));
      })
    );
  }

  static async getAssigneeSet(
    jiraCardKey: string,
    jiraToken: string,
    jiraSite: string
  ): Promise<Set<string>> {
    const jiraCardHistoryResponse = await axios.get(
      `https://${jiraSite}.atlassian.net/rest/internal/2/issue/${jiraCardKey}/activityfeed`,
      {
        headers: { Authorization: `${jiraToken}` },
      }
    );

    const jiraCardHistory: JiraCardHistory = jiraCardHistoryResponse.data;

    const assigneeList = jiraCardHistory.items
      .filter(
        (value) => "assignee" == value.fieldId && value.to.displayValue != null
      )
      .map((value) => {
        return value.to.displayValue;
      });

    return new Set<string>(assigneeList);
  }
}
