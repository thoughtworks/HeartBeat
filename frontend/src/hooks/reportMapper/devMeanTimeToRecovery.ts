import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { DevMeanTimeToRecoveryResponse } from '@src/clients/report/dto/response';
import { DEV_MEAN_TIME_TO_RECOVERY_NAME } from '@src/constants/resources';

export const devMeanTimeToRecoveryMapper = ({
  avgDevMeanTimeToRecovery,
  devMeanTimeToRecoveryOfPipelines,
}: DevMeanTimeToRecoveryResponse) => {
  const minutesPerHour = 60;
  const milliscondMinute = 60000;
  const formatDuration = (duration: number) => {
    const minutesDuration = duration / milliscondMinute;
    return (minutesDuration / minutesPerHour).toFixed(2);
  };

  const mappedDevMeanTimeToRecoveryValue: ReportDataWithThreeColumns[] = [];

  devMeanTimeToRecoveryOfPipelines.map((item, index) => {
    const devMeanTimeToRecoveryValue: ReportDataWithThreeColumns = {
      id: index,
      name: `${item.name}/${item.step}`,
      valuesList: [
        {
          name: DEV_MEAN_TIME_TO_RECOVERY_NAME,
          value: formatDuration(item.timeToRecovery),
        },
      ],
    };
    mappedDevMeanTimeToRecoveryValue.push(devMeanTimeToRecoveryValue);
  });
  mappedDevMeanTimeToRecoveryValue.push({
    id: mappedDevMeanTimeToRecoveryValue.length,
    name: avgDevMeanTimeToRecovery.name,
    valuesList: [
      {
        name: DEV_MEAN_TIME_TO_RECOVERY_NAME,
        value: formatDuration(avgDevMeanTimeToRecovery.timeToRecovery),
      },
    ],
  });

  return mappedDevMeanTimeToRecoveryValue;
};
