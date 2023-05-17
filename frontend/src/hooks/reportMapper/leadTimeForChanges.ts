import { LeadTimeForChangesResponse } from '@src/clients/report/dto/response'
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure'

export const leadTimeForChangesMapper = ({
  leadTimeForChangesOfPipelines,
  avgLeadTimeForChanges,
}: LeadTimeForChangesResponse) => {
  const mappedLeadTimeForChangesValue: ReportDataWithThreeColumns[] = []

  const formatDuration = (duration: number) => {
    const minutesPerDay = 1440
    const minutesPerHour = 60
    const days = Math.floor(duration / minutesPerDay)
    const hours = Math.floor((duration % minutesPerDay) / minutesPerHour)
    const minutes = Math.floor(duration % minutesPerHour)
    let result = ''
    if (days > 0) {
      result += days + 'day '
    }
    if (hours > 0) {
      result += hours + 'hours '
    }
    if (minutes > 0) {
      result += minutes + 'minutes'
    }
    return result.trim()
  }
  leadTimeForChangesOfPipelines.map((item, index) => {
    const deploymentFrequencyValue: ReportDataWithThreeColumns = {
      id: index,
      name: `${item.name}/${item.step}`,
      valuesList: Object.entries(item)
        .slice(-3)
        .map(([name, value]) => ({
          name: name,
          value: formatDuration(value),
        })),
    }
    mappedLeadTimeForChangesValue.push(deploymentFrequencyValue)
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
