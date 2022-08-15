import { StoryPointsAndCycleTimeRequest } from "../../contract/kanban/KanbanStoryPointParameterVerify";
import { Jira } from "./Jira/Jira";
import { PlatformTypeError } from "../../types/PlatformTypeError";
import { RequestKanbanColumnSetting } from "../../contract/GenerateReporter/GenerateReporterRequestBody";
import { Cards } from "../../models/kanban/RequestKanbanResults";
import { ColumnResponse } from "../../contract/kanban/KanbanTokenVerifyResponse";
import { Linear } from "./Linear/Linear";
import { SprintStatistics } from "../../models/kanban/SprintStatistics";

export interface Kanban {
  // verifyTokenAndGetColumnsAndUser(model: KanbanTokenVerifyModel): Promise<KanbanTokenVerifyResponse>;

  getColumns(model: StoryPointsAndCycleTimeRequest): Promise<ColumnResponse[]>;

  getStoryPointsAndCycleTime(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[],
    users: string[]
  ): Promise<Cards>;

  getStoryPointsAndCycleTimeForNonDoneCards(
    model: StoryPointsAndCycleTimeRequest,
    boardColumns: RequestKanbanColumnSetting[],
    users: string[]
  ): Promise<Cards>;
  getSprintStatistics(
    model: StoryPointsAndCycleTimeRequest,
    cards: Cards
  ): Promise<SprintStatistics>;
}

export enum KanbanEnum {
  JIRA = "jira",
  CLASSIC_JIRA = "classic jira",
  LINEAR = "linear",
}

export class KanbanFactory {
  static getKanbanInstantiateObject(
    type: string,
    token: string,
    site: string = ""
  ): Kanban {
    switch (type.toLowerCase()) {
      case KanbanEnum.JIRA:
      case KanbanEnum.CLASSIC_JIRA:
        return new Jira(token, site);
      case KanbanEnum.LINEAR:
        return new Linear(token);
      default:
        throw new PlatformTypeError(type);
    }
  }
}
