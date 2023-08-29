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
  const formatNameDisplay = (name: string) => {
    if (name == 'pipelineLeadTime') return 'Pipeline Lead Time'
    if (name == 'prLeadTime') return 'PR Lead Time'
    if (name == 'totalDelayTime') return 'Total Lead Time'
  }
  const calculateTotalTime = (prLeadTime: number, pipelineLeadTime: number): string => {
    const prLeadTimeMinutes = prLeadTime % minutesPerHour
    const formatPrLeadTimeMinutes = 0 < prLeadTimeMinutes && prLeadTimeMinutes <= 1 ? 1 : Math.floor(prLeadTimeMinutes)

    const pipelineLeadTimeMinutes = pipelineLeadTime % minutesPerHour
    const formatPipelineLeadTimeMinutes =
      0 < pipelineLeadTimeMinutes && pipelineLeadTimeMinutes <= 1 ? 1 : Math.floor(pipelineLeadTimeMinutes)

    let totalDays: number = Math.floor(prLeadTime / minutesPerDay) + Math.floor(pipelineLeadTime / minutesPerDay)
    let totalHours: number =
      Math.floor((prLeadTime % minutesPerDay) / minutesPerHour) +
      Math.floor((pipelineLeadTime % minutesPerDay) / minutesPerHour)
    let totalMinutes: number = formatPrLeadTimeMinutes + formatPipelineLeadTimeMinutes

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
          name: formatNameDisplay(name) as string,
          value: index == 2 ? calculateTotalTime(item.prLeadTime, item.pipelineLeadTime) : formatDuration(value),
        })),
    }
  })

  mappedLeadTimeForChangesValue.push({
    id: mappedLeadTimeForChangesValue.length,
    name: avgLeadTimeForChanges.name,
    valuesList: Object.entries(avgLeadTimeForChanges)
      .slice(-3)
      .map(([name, value]) => ({
        name: formatNameDisplay(name) as string,
        value: formatDuration(value),
      })),
  })

  return mappedLeadTimeForChangesValue
}
