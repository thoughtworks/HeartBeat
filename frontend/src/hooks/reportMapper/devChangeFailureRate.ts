import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { DevChangeFailureRateResponse } from '@src/clients/report/dto/response';
import { DEV_FAILURE_RATE_NAME } from '@src/constants/resources';

export const devChangeFailureRateMapper = ({
  avgDevChangeFailureRate,
  devChangeFailureRateOfPipelines,
}: DevChangeFailureRateResponse) => {
  const mappedDevChangeFailureRateValue: ReportDataWithThreeColumns[] = [];

  devChangeFailureRateOfPipelines.map((item, index) => {
    const devChangeFailureRateValue: ReportDataWithThreeColumns = {
      id: index,
      name: `${item.name}/${item.step}`,
      valuesList: [
        {
          name: DEV_FAILURE_RATE_NAME,
          value: `${(item.failureRate * 100).toFixed(2)}%(${item.failedTimesOfPipeline}/${item.totalTimesOfPipeline})`,
        },
      ],
    };
    mappedDevChangeFailureRateValue.push(devChangeFailureRateValue);
  });
  mappedDevChangeFailureRateValue.push({
    id: mappedDevChangeFailureRateValue.length,
    name: avgDevChangeFailureRate.name,
    valuesList: [
      {
        name: DEV_FAILURE_RATE_NAME,
        value: `${(avgDevChangeFailureRate.failureRate * 100).toFixed(2)}%(${avgDevChangeFailureRate.totalFailedTimes}/${
          avgDevChangeFailureRate.totalTimes
        })`,
      },
    ],
  });

  return mappedDevChangeFailureRateValue;
};
