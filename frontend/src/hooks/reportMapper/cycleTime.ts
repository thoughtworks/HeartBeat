import { CYCLE_TIME_METRICS_NAME, METRICS_CONSTANTS, REPORT_SUFFIX_UNITS } from '@src/constants/resources';
import { ReportDataWithTwoColumns, ValueWithUnits } from '@src/hooks/reportMapper/reportUIDataStructure';
import { CycleTimeResponse, Swimlane } from '@src/clients/report/dto/response';

export const cycleTimeMapper = ({
  swimlaneList,
  totalTimeForCards,
  averageCycleTimePerSP,
  averageCycleTimePerCard,
}: CycleTimeResponse) => {
  const mappedCycleTimeValue: ReportDataWithTwoColumns[] = [];

  const getSwimlaneByItemName = (itemName: string) => {
    return swimlaneList.find((item: Swimlane) => item.optionalItemName === itemName);
  };
  const calPerColumnTotalTimeDivTotalTime = (itemName: string): ValueWithUnits[] => {
    const swimlane = getSwimlaneByItemName(itemName);
    return swimlane ? [{ value: `${parseFloat(((swimlane.totalTime / totalTimeForCards) * 100).toFixed(2))}%` }] : [];
  };
  const getAverageTimeForPerColumn = (itemName: string) => {
    const swimlane = getSwimlaneByItemName(itemName);
    return swimlane
      ? [
          { value: swimlane.averageTimeForSP.toFixed(2), unit: REPORT_SUFFIX_UNITS.PER_SP },
          {
            value: swimlane.averageTimeForCards.toFixed(2),
            unit: REPORT_SUFFIX_UNITS.PER_CARD,
          },
        ]
      : [];
  };

  const cycleTimeValue: { [key: string]: ValueWithUnits[] } = {
    AVERAGE_CYCLE_TIME: [
      { value: Number(averageCycleTimePerSP.toFixed(2)), unit: REPORT_SUFFIX_UNITS.PER_SP },
      {
        value: averageCycleTimePerCard.toFixed(2),
        unit: REPORT_SUFFIX_UNITS.PER_CARD,
      },
    ],
    DEVELOPMENT_PROPORTION: calPerColumnTotalTimeDivTotalTime(METRICS_CONSTANTS.inDevValue),
    WAITING_PROPORTION: calPerColumnTotalTimeDivTotalTime(METRICS_CONSTANTS.waitingValue),
    BLOCK_PROPORTION: calPerColumnTotalTimeDivTotalTime(METRICS_CONSTANTS.blockValue),
    REVIEW_PROPORTION: calPerColumnTotalTimeDivTotalTime(METRICS_CONSTANTS.reviewValue),
    TESTING_PROPORTION: calPerColumnTotalTimeDivTotalTime(METRICS_CONSTANTS.testingValue),
    AVERAGE_DEVELOPMENT_TIME: getAverageTimeForPerColumn(METRICS_CONSTANTS.inDevValue),
    AVERAGE_WAITING_TIME: getAverageTimeForPerColumn(METRICS_CONSTANTS.waitingValue),
    AVERAGE_BLOCK_TIME: getAverageTimeForPerColumn(METRICS_CONSTANTS.blockValue),
    AVERAGE_REVIEW_TIME: getAverageTimeForPerColumn(METRICS_CONSTANTS.reviewValue),
    AVERAGE_TESTING_TIME: getAverageTimeForPerColumn(METRICS_CONSTANTS.testingValue),
  };

  Object.entries(CYCLE_TIME_METRICS_NAME).map(([key, cycleName]) => {
    if (cycleTimeValue[key].length > 0) {
      mappedCycleTimeValue.push({ id: mappedCycleTimeValue.length, name: cycleName, valueList: cycleTimeValue[key] });
    }
  });

  return mappedCycleTimeValue;
};
