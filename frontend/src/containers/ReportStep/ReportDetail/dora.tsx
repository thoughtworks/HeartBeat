import { ReportDataWithThreeColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns';
import { METRICS_TITLE, NAME, PIPELINE_STEP } from '@src/constants/resources';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { reportMapper } from '@src/hooks/reportMapper/report';
import { Optional } from '@src/utils/types';
import { withGoBack } from './withBack';
import React from 'react';

interface Property {
  data: ReportResponseDTO;
  onBack: () => void;
}
const showSection = (title: string, value: Optional<ReportDataWithThreeColumns[]>) =>
  value && <ReportForThreeColumns title={title} fieldName={PIPELINE_STEP} listName={NAME} data={value} />;

export const DoraDetail = withGoBack(({ data }: Property) => {
  const mappedData = reportMapper(data);

  return (
    <>
      {showSection(METRICS_TITLE.DEPLOYMENT_FREQUENCY, mappedData.deploymentFrequencyList)}
      {showSection(METRICS_TITLE.LEAD_TIME_FOR_CHANGES, mappedData.leadTimeForChangesList)}
      {showSection(METRICS_TITLE.CHANGE_FAILURE_RATE, mappedData.changeFailureRateList)}
      {showSection(METRICS_TITLE.MEAN_TIME_TO_RECOVERY, mappedData.meanTimeToRecoveryList)}
    </>
  );
});
