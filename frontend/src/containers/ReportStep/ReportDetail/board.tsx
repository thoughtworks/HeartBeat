import { isOnlySelectClassification, selectMetrics } from '@src/context/config/configSlice';
import { ReportDataWithTwoColumns } from '@src/hooks/reportMapper/reportUIDataStructure';
import ReportForThreeColumns from '@src/components/Common/ReportForThreeColumns';
import { MESSAGE, METRICS_TITLE, REQUIRED_DATA } from '@src/constants/resources';
import { addNotification } from '@src/context/notification/NotificationSlice';
import ReportForTwoColumns from '@src/components/Common/ReportForTwoColumns';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { reportMapper } from '@src/hooks/reportMapper/report';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { Optional } from '@src/utils/types';
import { useAppSelector } from '@src/hooks';
import React, { useEffect } from 'react';
import { withGoBack } from './withBack';

interface Property {
  data: ReportResponseDTO | undefined;
  onBack: () => void;
  errorMessage: string;
}

const showSectionWith2Columns = (title: string, value: Optional<ReportDataWithTwoColumns[]>) =>
  value && <ReportForTwoColumns title={title} data={value} />;

export const BoardDetail = withGoBack(({ data, errorMessage }: Property) => {
  const dispatch = useAppDispatch();
  const metrics = useAppSelector(selectMetrics);
  const onlySelectClassification = useAppSelector(isOnlySelectClassification);
  const mappedData = data && reportMapper(data);

  useEffect(() => {
    if (onlySelectClassification && errorMessage) {
      dispatch(
        addNotification({
          message: MESSAGE.FAILED_TO_GET_CLASSIFICATION_DATA,
          type: 'error',
        }),
      );
    }
  }, [dispatch, onlySelectClassification, errorMessage]);

  return (
    <>
      {showSectionWith2Columns(METRICS_TITLE.VELOCITY, mappedData?.velocityList)}
      {showSectionWith2Columns(METRICS_TITLE.CYCLE_TIME, mappedData?.cycleTimeList)}
      {showSectionWith2Columns(METRICS_TITLE.REWORK, mappedData?.reworkList)}
      {metrics.includes(REQUIRED_DATA.CLASSIFICATION) && (
        <ReportForThreeColumns
          title={METRICS_TITLE.CLASSIFICATION}
          fieldName={'Field Name'}
          listName={'Subtitle'}
          data={mappedData?.classification}
          errorMessage={errorMessage}
        />
      )}
    </>
  );
});
