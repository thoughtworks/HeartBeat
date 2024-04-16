import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { DevMeanTimeToRecoveryResponse } from '@src/clients/report/dto/response';

export const devMeanTimeToRecoveryMapper = ({ devMeanTimeToRecoveryOfPipelines }: DevMeanTimeToRecoveryResponse) => {
  const minutesPerHour = 60;
  const milliscondMinute = 60000;
  const formatDuration = (duration: number) => {
    const minutesDuration = duration / milliscondMinute;
    return (minutesDuration / minutesPerHour).toFixed(2);
  };

  const mappedDevMeanTimeToRecoveryValue: ReportDataWithTwoColumns[] = [];

  devMeanTimeToRecoveryOfPipelines.map((item, index) => {
    const devMeanTimeToRecoveryValue: ReportDataWithTwoColumns = {
      id: index,
      name: `${item.name}/${item.step}`,
      valueList: [
        {
          value: formatDuration(item.timeToRecovery),
        },
      ],
    };
    mappedDevMeanTimeToRecoveryValue.push(devMeanTimeToRecoveryValue);
  });

  return mappedDevMeanTimeToRecoveryValue;
};
