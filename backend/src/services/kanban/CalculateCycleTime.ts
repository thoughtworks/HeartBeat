import {
  CycleTimeInfo,
  JiraCardResponse,
} from "../../contract/kanban/KanbanStoryPointResponse";
import {
  CycleTime,
  CycleTimeOptionalItem,
} from "../../contract/GenerateReporter/GenerateReporterResponse";
import { RequestKanbanColumnSetting } from "../../contract/GenerateReporter/GenerateReporterRequestBody";
import { CardCycleTime, StepsDay } from "../../models/kanban/CardCycleTime";
import { CardStepsEnum } from "../../models/kanban/CardStepsEnum";
import { Cards } from "../../models/kanban/RequestKanbanResults";

function selectedStepsArrayToMap(
  boardColumns: RequestKanbanColumnSetting[]
): Map<string, string> {
  const map = new Map<string, string>();
  boardColumns.forEach((boardColumn: RequestKanbanColumnSetting) => {
    map.set(boardColumn.name.toUpperCase(), boardColumn.value);
  });
  return map;
}

function aggregateResultBySelectedSteps(
  totalTimeOfEachStepsMap: Map<string, number>,
  selectedStepsMap: Map<string, string>
): Map<string, number> {
  const aggregateMap = new Map<string, number>();

  totalTimeOfEachStepsMap.forEach((value, key) => {
    const aggregateTime = aggregateMap.get(selectedStepsMap.get(key)!);
    aggregateMap.set(
      selectedStepsMap.get(key)!,
      aggregateTime ? aggregateTime + value : value
    );
  });
  return aggregateMap;
}

function addAllCardsTimeUpForEachStep(
  cards: Cards,
  selectedStepsMap: Map<string, string>
): Map<string, number> {
  const tempSwimlaneMap = new Map<string, number>();
  cards.matchedCards.forEach((jiraCardResponse) => {
    jiraCardResponse.cycleTime.forEach((p1: CycleTimeInfo) => {
      const column = p1.column;
      if (column == CardStepsEnum.FLAG) {
        selectedStepsMap.set(column, CardStepsEnum.BLOCK);
      }
      if (selectedStepsMap.has(column)) {
        const day = tempSwimlaneMap.get(column);
        tempSwimlaneMap.set(column, day ? day + p1.day : p1.day);
      }
    });
  });
  return tempSwimlaneMap;
}

export function dealNaN(result: number, unit: string): string {
  if (isNaN(result) || result == Infinity) return "None";
  return result.toFixed(2) + unit;
}

const calculateAverageTimeAndTotalTime = (
  aggregatedMap: Map<string, number>,
  cards: Cards
) => {
  const cycleTimeForSelectedStepsList = Array.of<CycleTimeOptionalItem>();
  let totalTime = 0;
  aggregatedMap.forEach((value: number, key: string) => {
    cycleTimeForSelectedStepsList.push(
      new CycleTimeOptionalItem({
        optionalItemName: key,
        averageTimeForSP: dealNaN(value / cards.storyPointSum, ""),
        averageTimeForCards: dealNaN(value / cards.cardsNumber, ""),
        totalTime: value.toFixed(2).toString(),
      })
    );
    if (
      key != CardStepsEnum.ANALYSE &&
      key != CardStepsEnum.TODO &&
      key != CardStepsEnum.DONE
    )
      totalTime += value;
  });
  return { cycleTimeForSelectedStepsList, totalTime };
};

export function CalculateCycleTime(
  cards: Cards,
  selectedStepsArray: RequestKanbanColumnSetting[]
): CycleTime {
  const selectedStepsMap = selectedStepsArrayToMap(selectedStepsArray);

  const totalTimeOfEachStepsMap = addAllCardsTimeUpForEachStep(
    cards,
    selectedStepsMap
  );
  const aggregatedMap = aggregateResultBySelectedSteps(
    totalTimeOfEachStepsMap,
    selectedStepsMap
  );
  const {
    cycleTimeForSelectedStepsList,
    totalTime,
  } = calculateAverageTimeAndTotalTime(aggregatedMap, cards);

  return new CycleTime(
    Number(totalTime.toFixed(2)),
    dealNaN(totalTime / cards.cardsNumber, ""),
    dealNaN(totalTime / cards.storyPointSum, ""),
    cycleTimeForSelectedStepsList
  );
}

export function CalculateCardCycleTime(
  jiraCardResponse: JiraCardResponse,
  boardColumns: RequestKanbanColumnSetting[]
): CardCycleTime {
  const boardMap = selectedStepsArrayToMap(boardColumns);
  const stepsDay = new StepsDay();
  let total = 0;
  jiraCardResponse.cycleTime.forEach((cycleTimeInfo: CycleTimeInfo) => {
    const swimLane = cycleTimeInfo.column;
    if (swimLane == CardStepsEnum.FLAG) {
      boardMap.set(swimLane.toUpperCase(), CardStepsEnum.BLOCK);
    }
    if (boardMap.has(swimLane.toUpperCase())) {
      const cardStep = boardMap.get(swimLane);
      switch (cardStep) {
        case CardStepsEnum.TODO:
          break;
        case CardStepsEnum.DONE:
          break;
        case CardStepsEnum.ANALYSE:
          break;
        case CardStepsEnum.DEVELOPMENT:
          stepsDay.development = +(
            stepsDay.development + cycleTimeInfo.day
          ).toFixed(2);
          total += cycleTimeInfo.day;
          break;
        case CardStepsEnum.WAITING:
          stepsDay.waiting = +(stepsDay.waiting + cycleTimeInfo.day).toFixed(2);
          total += cycleTimeInfo.day;
          break;
        case CardStepsEnum.TESTING:
          stepsDay.testing = +(stepsDay.testing + cycleTimeInfo.day).toFixed(2);
          total += cycleTimeInfo.day;
          break;
        case CardStepsEnum.BLOCK:
          stepsDay.blocked = +(stepsDay.blocked + cycleTimeInfo.day).toFixed(2);
          total += cycleTimeInfo.day;
          break;
        case CardStepsEnum.REVIEW:
          stepsDay.review = +(stepsDay.review + cycleTimeInfo.day).toFixed(2);
          total += cycleTimeInfo.day;
          break;
        case CardStepsEnum.UNKNOWN:
          break;
      }
    }
  });
  return new CardCycleTime(
    jiraCardResponse.baseInfo.key,
    stepsDay,
    +total.toFixed(2)
  );
}
