import { MeanTimeToRecoveryResponse } from '@src/clients/report/dto/response'
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { MEAN_TIME_TO_RECOVERY_NAME } from '@src/constants'

export const meanTimeToRecoveryMapper = ({
  avgMeanTimeToRecovery,
  meanTimeRecoveryPipelines,
}: MeanTimeToRecoveryResponse) => {
  const minutesPerDay = 1440
  const minutesPerHour = 60
  const formatDuration = (duration: number) => {
    const days = Math.floor(duration / minutesPerDay)
    const hours = Math.floor((duration % minutesPerDay) / minutesPerHour)
    const minutes = duration % minutesPerHour
    return (
      (days ? days + 'day ' : '') +
      (hours ? hours + 'hours ' : '') +
      (0 < minutes && minutes <= 1 ? '1minutes' : Math.floor(minutes) + 'minutes').trim()
    )
  }

  const mappedMeanTimeToRecoveryValue: ReportDataWithThreeColumns[] = []

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
    }
    mappedMeanTimeToRecoveryValue.push(meanTimeToRecoveryValue)
  })
  mappedMeanTimeToRecoveryValue.push({
    id: mappedMeanTimeToRecoveryValue.length,
    name: avgMeanTimeToRecovery.name,
    valuesList: [
      {
        name: MEAN_TIME_TO_RECOVERY_NAME,
        value: formatDuration(avgMeanTimeToRecovery.timeToRecovery),
      },
    ],
  })

  return mappedMeanTimeToRecoveryValue
}
