import { calculateWorkDaysBy24Hours } from "../common/WorkDayCalculate";
import { CycleTimeInfo } from "../../contract/kanban/KanbanStoryPointResponse";
import { CardStepsEnum } from "../../models/kanban/CardStepsEnum";
import { Issue } from "@linear/sdk";
import { JiraCard } from "../../models/kanban/JiraBoard/JiraCard";

export type StatusChangedArrayItem = {
  timestamp: number;
  status: string;
};

export function getThisStepCostTime(
  index: number,
  statusChangedArrayItems: StatusChangedArrayItem[]
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

export function getCardTimeForEachStep(
  timeLine: StatusChangedArrayItem[]
): CycleTimeInfo[] {
  const result = new Map<string, number>();
  timeLine.forEach((statusChangedArrayItem, index, statusChangedArrayItems) => {
    const addedTime = result.get(statusChangedArrayItem.status.toUpperCase());
    const costedTime = getThisStepCostTime(index, statusChangedArrayItems);
    const value = addedTime
      ? +(costedTime + addedTime).toFixed(2)
      : +costedTime.toFixed(2);
    result.set(statusChangedArrayItem.status.toUpperCase(), value);
  });
  const cycleTimeInfos: CycleTimeInfo[] = [];
  result.forEach(function (value, key) {
    cycleTimeInfos.push(new CycleTimeInfo(key, value));
  });
  return cycleTimeInfos;
}

export function sortStatusChangedArray(
  statusChangedArray: StatusChangedArrayItem[]
): StatusChangedArrayItem[] {
  return statusChangedArray.sort((a, b) => a.timestamp - b.timestamp);
}

export function reformTimeLineForFlaggedCards(
  statusChangedArray: StatusChangedArrayItem[]
): StatusChangedArrayItem[] {
  const needToFilterArray: number[] = [];
  const timeLine = sortStatusChangedArray(statusChangedArray);
  timeLine.forEach(function (
    statusChangedArrayItem,
    index,
    statusChangedArrayItems
  ) {
    if (statusChangedArrayItem.status == CardStepsEnum.FLAG) {
      let statusNameAfterBlock: string = CardStepsEnum.UNKNOWN;
      if (index > 0)
        statusNameAfterBlock = statusChangedArrayItems[index - 1].status;
      for (index++; index < statusChangedArrayItems.length; index++) {
        if (timeLine[index].status == CardStepsEnum.REMOVEFLAG) {
          timeLine[index].status = statusNameAfterBlock;
          break;
        }
        statusNameAfterBlock = statusChangedArrayItems[index].status;
        needToFilterArray.push(statusChangedArrayItems[index].timestamp);
      }
    }
  });
  return timeLine.filter(
    (activity) => !needToFilterArray.includes(activity.timestamp)
  );
}

export function confirmThisCardHasAssignedBySelectedUser(
  selectedUsers: string[],
  cardIncludeUsers: Set<string>
): boolean {
  return selectedUsers.some((user: string) => cardIncludeUsers.has(user));
}

export async function transformLinearCardToJiraCard(
  linearCard: Issue
): Promise<JiraCard> {
  const jiraCard = new JiraCard();
  jiraCard.key = linearCard.identifier;
  const stateName = (await linearCard.state)?.name;
  jiraCard.fields.status = stateName ? { name: stateName } : undefined;
  jiraCard.fields.priority = { name: linearCard.priority.toString() };
  return jiraCard;
}
