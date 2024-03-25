import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { REWORK_BOARD_STATUS, REWORK_TIME_MAPPING } from '@src/constants/resources';
import { ReworkTimeResponse } from '@src/clients/report/dto/response';
import { StyledBoldText } from '@src/containers/style';
import { ReactNode } from 'react';

const getUnit = (value: string) => {
  const UNIT_TIME = [...REWORK_BOARD_STATUS, REWORK_TIME_MAPPING.totalReworkTimes];
  if (UNIT_TIME.includes(value)) return ' (times)';
  if (value === REWORK_TIME_MAPPING.reworkCardsRatio) return '% (rework cards/throughput)';
  if (value === REWORK_TIME_MAPPING.totalReworkCards) return ' (cards)';
};
const getRowName = (value: string, reworkState: string): ReactNode => {
  if (REWORK_BOARD_STATUS.includes(value)) {
    return (
      <>
        From <StyledBoldText>{`${value}`}</StyledBoldText> to
        <StyledBoldText>{` ${reworkState.toLowerCase()}`}</StyledBoldText>
      </>
    );
  } else {
    return <>{value}</>;
  }
};

const reworkMapper = (reworkTimeResponse: ReworkTimeResponse) => {
  const result: ReportDataWithTwoColumns[] = [];
  Object.entries(REWORK_TIME_MAPPING).map(([key, value], index) => {
    reworkTimeResponse[key as keyof ReworkTimeResponse] !== null &&
      reworkTimeResponse[key as keyof ReworkTimeResponse] !== undefined &&
      result.push({
        id: index,
        name: getRowName(value, reworkTimeResponse.reworkState),
        valueList: [
          {
            value:
              key === 'reworkCardsRatio'
                ? (Number(reworkTimeResponse[key as keyof ReworkTimeResponse]) * 100).toFixed(2)
                : reworkTimeResponse[key as keyof ReworkTimeResponse]!,
            unit: getUnit(value),
          },
        ],
      });
  });
  return result;
};
export default reworkMapper;
