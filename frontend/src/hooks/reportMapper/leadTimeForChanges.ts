import { LeadTimeForChangesResponse } from '@src/clients/report/dto/response'

export const leadTimeForChangesMapper = ({
  leadTimeForChangesOfPipelines,
  avgLeadTimeForChanges,
}: LeadTimeForChangesResponse) => {
  const formatDuration = (duration: number) => {
    const minutesPerDay = 1440
    const minutesPerHour = 60
    const days = Math.floor(duration / minutesPerDay)
    const hours = Math.floor((duration % minutesPerDay) / minutesPerHour)
    const minutes = Math.floor(duration % minutesPerHour)
    return (
      (days ? days + 'day ' : '') +
      (hours ? hours + 'hours ' : '') +
      (0 < minutes && minutes <= 1 ? '1minutes' : minutes + 'minutes').trim()
    )
  }

  const calculateTotalTime = (mergeDelayTime: number, pipelineDelayTime: number): string => {
    const formatMergeDelayTime = formatDuration(mergeDelayTime)
    const formatPipelineDelayTime = formatDuration(pipelineDelayTime)

    const [mergeDelayDays, mergeDelayHours, mergeDelayMinutes] = formatMergeDelayTime.match(/\d+/g) || ['0', '0', '0']
    const [pipelineDelayDays, pipelineDelayHours, pipelineDelayMinutes] = formatPipelineDelayTime.match(/\d+/g) || [
      '0',
      '0',
      '0',
    ]

    let totalDays: number = parseInt(mergeDelayDays, 10) + parseInt(pipelineDelayDays, 10)
    let totalHours: number = parseInt(mergeDelayHours, 10) + parseInt(pipelineDelayHours, 10)
    let totalMinutes: number = parseInt(mergeDelayMinutes, 10) + parseInt(pipelineDelayMinutes, 10)

    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60)
      totalMinutes %= 60
    }

    if (totalHours >= 24) {
      totalDays += Math.floor(totalHours / 24)
      totalHours %= 24
    }

    return `${totalDays}day ${totalHours}hours ${totalMinutes}minutes`
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
