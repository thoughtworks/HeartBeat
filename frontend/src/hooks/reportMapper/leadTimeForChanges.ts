import { LeadTimeForChangesResponse } from '@src/clients/report/dto/response'

export const leadTimeForChangesMapper = ({
  leadTimeForChangesOfPipelines,
  avgLeadTimeForChanges,
}: LeadTimeForChangesResponse) => {
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

  const calculateTotalTime = (mergeDelayTime: number, pipelineDelayTime: number): string => {
    const mergeDelayTimeMinutes = mergeDelayTime % minutesPerHour
    const formatMergeDelayTimeMinutes =
      0 < mergeDelayTimeMinutes && mergeDelayTimeMinutes <= 1 ? 1 : Math.floor(mergeDelayTimeMinutes)

    const pipelineDelayTimeMinutes = pipelineDelayTime % minutesPerHour
    const formatPipelineDelayTimeMinutes =
      0 < pipelineDelayTimeMinutes && pipelineDelayTimeMinutes <= 1 ? 1 : Math.floor(pipelineDelayTimeMinutes)

    let totalDays: number = Math.floor(mergeDelayTime / minutesPerDay) + Math.floor(pipelineDelayTime / minutesPerDay)
    let totalHours: number =
      Math.floor((mergeDelayTime % minutesPerDay) / minutesPerHour) +
      Math.floor((pipelineDelayTime % minutesPerDay) / minutesPerHour)
    let totalMinutes: number = formatMergeDelayTimeMinutes + formatPipelineDelayTimeMinutes

    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60)
      totalMinutes %= 60
    }

    if (totalHours >= 24) {
      totalDays += Math.floor(totalHours / 24)
      totalHours %= 24
    }

    return (
      (totalDays ? totalDays + 'day ' : '') + (totalHours ? totalHours + 'hours ' : '') + (totalMinutes + 'minutes')
    )
  }

  const mappedLeadTimeForChangesValue = leadTimeForChangesOfPipelines.map((item, index) => {
    return {
      id: index,
      name: `${item.name}/${item.step}`,
      valuesList: Object.entries(item)
        .slice(-3)
        .map(([name, value], index) => ({
          name: name,
          value: index == 2 ? calculateTotalTime(item.mergeDelayTime, item.pipelineDelayTime) : formatDuration(value),
        })),
    }
  })

  mappedLeadTimeForChangesValue.push({
    id: mappedLeadTimeForChangesValue.length,
    name: avgLeadTimeForChanges.name,
    valuesList: Object.entries(avgLeadTimeForChanges)
      .slice(-3)
      .map(([name, value]) => ({
        name: name,
        value: formatDuration(value),
      })),
  })

  return mappedLeadTimeForChangesValue
}
