import { VelocityMetricsName } from '@src/constants'
import { ReportDataWithTwoColumns } from '@src/models/reportUIDataStructure'
import { VelocityResp } from '@src/models/response/reportResp'

export const velocityMapper = ({ velocityForSP, velocityForCards }: VelocityResp) => {
  const mappedVelocityValue: ReportDataWithTwoColumns[] = []

  const velocityValue: { [key: string]: string } = {
    VELOCITY_SP: velocityForSP,
    THROUGHPUT_CARDS_COUNT: velocityForCards,
  }

  Object.entries(VelocityMetricsName).map(([key, velocityName]) => {
    mappedVelocityValue.push({
      id: mappedVelocityValue.length + 1,
      name: velocityName,
      value: [velocityValue[key]],
    })
  })

  return mappedVelocityValue
}
