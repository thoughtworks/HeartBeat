import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { MeanTimeToRecoveryResponse } from '@src/clients/report/dto/response';
import { MEAN_TIME_TO_RECOVERY_NAME } from '@src/constants/resources';

export const meanTimeToRecoveryMapper = ({
  avgMeanTimeToRecovery,
  meanTimeRecoveryPipelines,
}: MeanTimeToRecoveryResponse) => {
  const minutesPerHour = 60;
  const milliscondMinute = 60000;
  const formatDuration = (duration: number) => {
    const minutesDuration = duration / milliscondMinute;
    return (minutesDuration / minutesPerHour).toFixed(2);
  };

  const mappedMeanTimeToRecoveryValue: ReportDataWithThreeColumns[] = [];

  meanTimeRecoveryPipelines.map((item, index) => {
    const meanTimeToRecoveryValue: ReportDataWithThreeColumns = {
      id: index,
      name: `${item.name}/${item.step}`,
      valuesList: [
        {
          name: MEAN_TIME_TO_RECOVERY_NAME,
          value: formatDuration(item.timeToRecovery),
        },
      ],
    };
    mappedMeanTimeToRecoveryValue.push(meanTimeToRecoveryValue);
  });
  mappedMeanTimeToRecoveryValue.push({
    id: mappedMeanTimeToRecoveryValue.length,
    name: avgMeanTimeToRecovery.name,
    valuesList: [
      {
        name: MEAN_TIME_TO_RECOVERY_NAME,
        value: formatDuration(avgMeanTimeToRecovery.timeToRecovery),
      },
    ],
  });

  return mappedMeanTimeToRecoveryValue;
};
