import {
  MetricSelectionHeader,
  MetricSelectionWrapper,
  MetricsSelectionTitle,
} from '@src/containers/MetricsStep/style';
import { selectDateRange, selectJiraColumns, selectMetrics, selectUsers } from '@src/context/config/configSlice';
import { DeploymentFrequencySettings } from '@src/containers/MetricsStep/DeploymentFrequencySettings';
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect';
import { CYCLE_TIME_SETTINGS_TYPES, DONE, REQUIRED_DATA } from '@src/constants/resources';
import { Classification } from '@src/containers/MetricsStep/Classification';
import { selectMetricsContent } from '@src/context/Metrics/metricsSlice';
import DateRangeViewer from '@src/components/Common/DateRangeViewer';
import { CycleTime } from '@src/containers/MetricsStep/CycleTime';
import { RealDone } from '@src/containers/MetricsStep/RealDone';
import { Crews } from '@src/containers/MetricsStep/Crews';
import { useAppSelector } from '@src/hooks';
import { useLayoutEffect } from 'react';

const MetricsStep = ({ closeAllNotifications }: useNotificationLayoutEffectInterface) => {
  const requiredData = useAppSelector(selectMetrics);
  const users = useAppSelector(selectUsers);
  const jiraColumns = useAppSelector(selectJiraColumns);
  const targetFields = useAppSelector(selectMetricsContent).targetFields;
  const { cycleTimeSettings, cycleTimeSettingsType } = useAppSelector(selectMetricsContent);
  const { startDate, endDate } = useAppSelector(selectDateRange);
  const isShowCrewsAndRealDone =
    requiredData.includes(REQUIRED_DATA.VELOCITY) ||
    requiredData.includes(REQUIRED_DATA.CYCLE_TIME) ||
    requiredData.includes(REQUIRED_DATA.CLASSIFICATION);
  const isShowRealDone =
    cycleTimeSettingsType === CYCLE_TIME_SETTINGS_TYPES.BY_COLUMN && cycleTimeSettings.some((e) => e.value === DONE);

  useLayoutEffect(() => {
    closeAllNotifications();
  }, []);

  return (
    <>
      {startDate && endDate && (
        <MetricSelectionHeader>
          <DateRangeViewer startDate={startDate} endDate={endDate} />
        </MetricSelectionHeader>
      )}
      <MetricSelectionWrapper>
        <MetricsSelectionTitle>Board configuration</MetricsSelectionTitle>

        {isShowCrewsAndRealDone && <Crews options={users} title={'Crew settings'} label={'Included Crews'} />}

        {requiredData.includes(REQUIRED_DATA.CYCLE_TIME) && <CycleTime />}

        {isShowCrewsAndRealDone && isShowRealDone && (
          <RealDone columns={jiraColumns} title={'Real done setting'} label={'Consider as Done'} />
        )}

        {requiredData.includes(REQUIRED_DATA.CLASSIFICATION) && (
          <Classification targetFields={targetFields} title={'Classification setting'} label={'Distinguished By'} />
        )}
      </MetricSelectionWrapper>

      {(requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
        requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
        requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
        requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)) && (
        <MetricSelectionWrapper>
          <MetricsSelectionTitle>Pipeline configuration</MetricsSelectionTitle>
          <DeploymentFrequencySettings />
        </MetricSelectionWrapper>
      )}
    </>
  );
};

export default MetricsStep;
