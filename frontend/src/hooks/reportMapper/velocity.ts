import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { VelocityResponse } from '@src/clients/report/dto/response';
import { VELOCITY_METRICS_NAME } from '@src/constants/resources';

export const velocityMapper = ({ velocityForSP, velocityForCards }: VelocityResponse) => {
  const mappedVelocityValue: ReportDataWithTwoColumns[] = [];

  const velocityValue: { [key: string]: number } = {
    VELOCITY_SP: velocityForSP,
    THROUGHPUT_CARDS_COUNT: velocityForCards,
  };

  Object.entries(VELOCITY_METRICS_NAME).map(([key, velocityName], index) => {
    mappedVelocityValue.push({
      id: index,
      name: velocityName,
      valueList: [{ value: velocityValue[key] }],
    });
  });

  return mappedVelocityValue;
};
