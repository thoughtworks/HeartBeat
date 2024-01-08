import React from 'react'
import { ReportResponseDTO } from '@src/clients/report/dto/response'
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns'
import { NAME, PIPELINE_STEP } from '@src/constants/resources'
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
      {showSection('Deployment frequency', mappedData.deploymentFrequencyList)}
      {showSection('Lead time for changes', mappedData.leadTimeForChangesList)}
      {showSection('Change failure rate', mappedData.changeFailureRateList)}
      {showSection('Mean Time To Recovery', mappedData.meanTimeToRecoveryList)}
    </>
  )
})
