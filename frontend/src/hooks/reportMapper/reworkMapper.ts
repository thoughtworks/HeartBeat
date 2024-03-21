import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { BOARD_COLUMN_STATE, REWORK_TIME_METRICS_NAME } from '@src/constants/resources';
import { ReworkTimeResponse } from '@src/clients/report/dto/response';

const getUnit = (value: string) => {
  const UNIT_TIME = [...BOARD_COLUMN_STATE, REWORK_TIME_METRICS_NAME.totalReworkTimes];
  if (UNIT_TIME.includes(value)) return ' (times)';
  if (value === REWORK_TIME_METRICS_NAME.reworkCardsRatio) return ' (rework cards/throughput)';
  if (value === REWORK_TIME_METRICS_NAME.totalReworkCards) return ' (cards)';
};

const reworkMapper = (reworkTimeResponse: ReworkTimeResponse) => {
  const result: ReportDataWithTwoColumns[] = [];
  const reworkState = reworkTimeResponse.reworkState.toLowerCase();

  Object.entries(REWORK_TIME_METRICS_NAME).map(([key, value], index) => {
    reworkTimeResponse[key as keyof ReworkTimeResponse] !== null &&
      result.push({
        id: index,
        name: `${BOARD_COLUMN_STATE.includes(value) ? `${value} ${reworkState}` : `${value}`} `,
        valueList: [
          {
            value: reworkTimeResponse[key as keyof ReworkTimeResponse]!,
            unit: getUnit(value),
          },
        ],
      });
  });
  return result;
};
export default reworkMapper;
