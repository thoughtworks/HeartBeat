import { ReportDataWithThreeColumns, ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { METRICS_TITLE, PIPELINE_STEP, SUBTITLE } from '@src/constants/resources';
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns';
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { reportMapper } from '@src/hooks/reportMapper/report';
import { Optional } from '@src/utils/types';
import { withGoBack } from './withBack';
import React from 'react';

interface Property {
  data: ReportResponseDTO;
  onBack: () => void;
}

const showTwoColumnSection = (title: string, value: Optional<ReportDataWithTwoColumns[]>) =>
  value && <ReportForTwoColumns title={title} data={value} />;

const showThreeColumnSection = (title: string, value: Optional<ReportDataWithThreeColumns[]>) =>
  value && <ReportForThreeColumns title={title} fieldName={PIPELINE_STEP} listName={SUBTITLE} data={value} />;

export const DoraDetail = withGoBack(({ data }: Property) => {
  const mappedData = reportMapper(data);

  return (
    <>
      {showTwoColumnSection(METRICS_TITLE.DEPLOYMENT_FREQUENCY, mappedData.deploymentFrequencyList)}
      {showThreeColumnSection(METRICS_TITLE.LEAD_TIME_FOR_CHANGES, mappedData.leadTimeForChangesList)}
      {showTwoColumnSection(METRICS_TITLE.DEV_CHANGE_FAILURE_RATE, mappedData.devChangeFailureRateList)}
      {showTwoColumnSection(METRICS_TITLE.DEV_MEAN_TIME_TO_RECOVERY, mappedData.devMeanTimeToRecoveryList)}
    </>
  );
});
