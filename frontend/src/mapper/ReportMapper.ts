import { ClassificationResp, CycleTimeResp, VelocityResp } from '@src/models/response/reportResp'
import { velocityMapper } from '@src/mapper/VelocityMapper'
import { cycleTimeMapper } from '@src/mapper/CycleTimeMapper'
import { classificationMapper } from '@src/mapper/ClassificationMapper'

export const reportResponseMapper = (response: {
  velocity: VelocityResp
  cycleTime: CycleTimeResp
  classification: Array<ClassificationResp>
}) => {
  const { velocity, cycleTime, classification } = response

  const velocityValues = velocityMapper(velocity)

  const cycleValues = cycleTimeMapper(cycleTime)

  const classificationValues = classificationMapper(classification)

  return { velocityValues, cycleValues, classificationValues }
}
