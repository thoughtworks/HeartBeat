import { CycleTimeResp, Swimlane } from '../models/response/reportResp'
import { CycleTimeMetricsName, METRICS_CONSTANTS, Unit } from '@src/constants'
import { ReportDataWithTwoColumns } from '@src/models/reportUIDataStructure'

export const cycleTimeMapper = ({
  swimlaneList,
  totalTimeForCards,
  averageCycleTimePerSP,
  averageCircleTimePerCard,
}: CycleTimeResp) => {
  const mappedCycleTimeValue: ReportDataWithTwoColumns[] = []

  const getSwimlaneByItemName = (itemName: string) => {
    return swimlaneList.find((item: Swimlane) => item.optionalItemName === itemName)
  }
  const calPerColumnTotalTimeDivTotalTime = (itemName: string) => {
    const swimlane = getSwimlaneByItemName(itemName)
    return swimlane ? [(parseFloat(swimlane.totalTime) / totalTimeForCards).toFixed(2)] : []
  }
  const getAverageTimeForPerColumn = (itemName: string) => {
    const swimlane = getSwimlaneByItemName(itemName)
    return swimlane
      ? [`${swimlane.averageTimeForSP}${Unit.PER_SP}`, `${swimlane.averageTimeForCards}${Unit.PER_CARD}`]
      : []
  }

  const cycleTimeValue: { [key: string]: string[] } = {
    AVERAGE_CYCLE_TIME: [`${averageCycleTimePerSP}${Unit.PER_SP}`, `${averageCircleTimePerCard}${Unit.PER_CARD}`],
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
  }

  Object.entries(CycleTimeMetricsName).map(([key, cycleName]) => {
    mappedCycleTimeValue.push({ id: mappedCycleTimeValue.length + 1, name: cycleName, value: cycleTimeValue[key] })
  })

  return mappedCycleTimeValue
}
