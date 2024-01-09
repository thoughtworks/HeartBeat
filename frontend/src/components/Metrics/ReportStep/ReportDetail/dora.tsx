import React from 'react'
import { ReportResponseDTO } from '@src/clients/report/dto/response'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import { NAME, PIPELINE_STEP, REQUIRED_DATA } from '@src/constants/resources'
import { reportMapper } from '@src/hooks/reportMapper/report'
import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure'
import { Optional } from '@src/utils/types'
import { withGoBack } from './withBack'

interface Property {
  data: ReportResponseDTO
  onBack: () => void
}
const showSection = (title: string, value: Optional<ReportDataWithThreeColumns[]>) =>
  value && <ReportForThreeColumns title={title} fieldName={PIPELINE_STEP} listName={NAME} data={value} />

export const DoraDetail = withGoBack(({ data }: Property) => {
  const mappedData = reportMapper(data)

  return (
    <>
      {showSection(REQUIRED_DATA.DEPLOYMENT_FREQUENCY, mappedData.deploymentFrequencyList)}
      {showSection(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES, mappedData.leadTimeForChangesList)}
      {showSection(REQUIRED_DATA.CHANGE_FAILURE_RATE, mappedData.changeFailureRateList)}
      {showSection(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY, mappedData.meanTimeToRecoveryList)}
    </>
  )
})
