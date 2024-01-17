import React from 'react';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns';
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns';
import { reportMapper } from '@src/hooks/reportMapper/report';
import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import { Optional } from '@src/utils/types';
import { withGoBack } from './withBack';
import { METRICS_TITLE, REQUIRED_DATA } from '@src/constants/resources';
import { useAppSelector } from '@src/hooks';
import { selectMetrics } from '@src/context/config/configSlice';

interface Property {
  data: ReportResponseDTO;
  onBack: () => void;
}

const showSectionWith2Columns = (title: string, value: Optional<ReportDataWithTwoColumns[]>) =>
  value && <ReportForTwoColumns title={title} data={value} />;

export const BoardDetail = withGoBack(({ data }: Property) => {
  const metrics = useAppSelector(selectMetrics);
  const mappedData = reportMapper(data);

  return (
    <>
      {showSectionWith2Columns(METRICS_TITLE.VELOCITY, mappedData.velocityList)}
      {showSectionWith2Columns(METRICS_TITLE.CYCLE_TIME, mappedData.cycleTimeList)}
      {metrics.includes(REQUIRED_DATA.CLASSIFICATION) && (
        <ReportForThreeColumns
          title={METRICS_TITLE.CLASSIFICATION}
          fieldName={'Field Name'}
          listName={'Subtitle'}
          data={mappedData.classification}
        />
      )}
    </>
  );
});
