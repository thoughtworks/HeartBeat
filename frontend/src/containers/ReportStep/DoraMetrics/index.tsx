import {
  DORA_METRICS_MAPPING,
  METRICS_SUBTITLE,
  METRICS_TITLE,
  PIPELINE_METRICS,
  REPORT_PAGE,
  REQUIRED_DATA,
  RETRY,
  SHOW_MORE,
  SOURCE_CONTROL_METRICS,
} from '@src/constants/resources';
import { StyledMetricsSection, StyledShowMore, StyledTitleWrapper } from '@src/containers/ReportStep/DoraMetrics/style';
import { formatMillisecondsToHours, formatMinToHours } from '@src/utils/util';
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle';
import { StyledRetry } from '@src/containers/ReportStep/BoardMetrics/style';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { StyledSpacing } from '@src/containers/ReportStep/style';
import { ReportGrid } from '@src/components/Common/ReportGrid';
import { selectConfig } from '@src/context/config/configSlice';
import { useAppSelector } from '@src/hooks';
import React from 'react';
import _ from 'lodash';

interface DoraMetricsProps {
  startToRequestDoraData: () => void;
  onShowDetail: () => void;
  doraReport: ReportResponseDTO | undefined;
  errorMessage: string;
}

const DoraMetrics = ({ startToRequestDoraData, onShowDetail, doraReport, errorMessage }: DoraMetricsProps) => {
  const configData = useAppSelector(selectConfig);
  const { metrics } = configData.basic;
  const shouldShowSourceControl = metrics.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES);
  const sourceControlMetricsCompleted = metrics
    .filter((metric) => SOURCE_CONTROL_METRICS.includes(metric))
    .map((metric) => DORA_METRICS_MAPPING[metric])
    .every((metric) => doraReport?.[metric] ?? false);
  const pipelineMetricsCompleted = metrics
    .filter((metric) => PIPELINE_METRICS.includes(metric))
    .map((metric) => DORA_METRICS_MAPPING[metric])
    .every((metric) => doraReport?.[metric] ?? false);

  const getSourceControlItems = () => {
    const leadTimeForChanges = doraReport?.leadTimeForChanges;
    return [
      {
        title: METRICS_TITLE.LEAD_TIME_FOR_CHANGES,
        items: leadTimeForChanges && [
          {
            value: formatMinToHours(leadTimeForChanges.avgLeadTimeForChanges.prLeadTime),
            subtitle: METRICS_SUBTITLE.PR_LEAD_TIME,
          },
          {
            value: formatMinToHours(leadTimeForChanges.avgLeadTimeForChanges.pipelineLeadTime),
            subtitle: METRICS_SUBTITLE.PIPELINE_LEAD_TIME,
          },
          {
            value: formatMinToHours(leadTimeForChanges.avgLeadTimeForChanges.totalDelayTime),
            subtitle: METRICS_SUBTITLE.TOTAL_DELAY_TIME,
          },
        ],
      },
    ];
  };

  const getPipelineItems = () => {
    const deploymentFrequency = doraReport?.deploymentFrequency;
    const devMeanTimeToRecovery = doraReport?.devMeanTimeToRecovery;
    const devChangeFailureRate = doraReport?.devChangeFailureRate;

    const deploymentFrequencyList = metrics.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY)
      ? [
          {
            title: METRICS_TITLE.DEPLOYMENT_FREQUENCY,
            items: deploymentFrequency && [
              {
                value: deploymentFrequency?.avgDeploymentFrequency.deploymentFrequency,
                subtitle: METRICS_SUBTITLE.DEPLOYMENT_FREQUENCY,
              },
            ],
          },
        ]
      : [];

    const devMeanTimeToRecoveryList = metrics.includes(REQUIRED_DATA.DEV_MEAN_TIME_TO_RECOVERY)
      ? [
          {
            title: METRICS_TITLE.DEV_MEAN_TIME_TO_RECOVERY,
            items: devMeanTimeToRecovery && [
              {
                value: formatMillisecondsToHours(devMeanTimeToRecovery.avgDevMeanTimeToRecovery.timeToRecovery),
                subtitle: METRICS_SUBTITLE.DEV_MEAN_TIME_TO_RECOVERY_HOURS,
              },
            ],
          },
        ]
      : [];

    const devChangeFailureRateList = metrics.includes(REQUIRED_DATA.DEV_CHANGE_FAILURE_RATE)
      ? [
          {
            title: METRICS_TITLE.DEV_CHANGE_FAILURE_RATE,
            items: devChangeFailureRate && [
              {
                value: devChangeFailureRate.avgDevChangeFailureRate.failureRate * 100,
                extraValue: `% (${devChangeFailureRate.avgDevChangeFailureRate.totalFailedTimes}/${devChangeFailureRate.avgDevChangeFailureRate.totalTimes})`,
                subtitle: METRICS_SUBTITLE.FAILURE_RATE,
              },
            ],
          },
        ]
      : [];

    return [...deploymentFrequencyList, ...devChangeFailureRateList, ...devMeanTimeToRecoveryList];
  };

  const getErrorMessage4BuildKite = () =>
    _.get(doraReport, ['reportMetricsError', 'pipelineMetricsError'])
      ? `Failed to get BuildKite info, status: ${_.get(doraReport, [
          'reportMetricsError',
          'pipelineMetricsError',
          'status',
        ])}`
      : '';

  const getErrorMessage4Github = () =>
    _.get(doraReport, ['reportMetricsError', 'sourceControlMetricsError'])
      ? `Failed to get GitHub info, status: ${_.get(doraReport, [
          'reportMetricsError',
          'sourceControlMetricsError',
          'status',
        ])}`
      : '';

  const hasDoraError = !!(getErrorMessage4BuildKite() || getErrorMessage4Github());

  const shouldShowRetry = () => {
    return hasDoraError || errorMessage;
  };

  const handleRetry = () => {
    startToRequestDoraData();
  };

  return (
    <>
      <StyledMetricsSection>
        <StyledTitleWrapper>
          <ReportTitle title={REPORT_PAGE.DORA.TITLE} />
          {!hasDoraError && !errorMessage && (sourceControlMetricsCompleted || pipelineMetricsCompleted) && (
            <StyledShowMore onClick={onShowDetail}>{SHOW_MORE}</StyledShowMore>
          )}
          {shouldShowRetry() && <StyledRetry onClick={handleRetry}>{RETRY}</StyledRetry>}
        </StyledTitleWrapper>
        {shouldShowSourceControl && (
          <ReportGrid reportDetails={getSourceControlItems()} errorMessage={errorMessage || getErrorMessage4Github()} />
        )}
        <StyledSpacing />
        <ReportGrid
          reportDetails={getPipelineItems()}
          lastGrid={true}
          errorMessage={errorMessage || getErrorMessage4BuildKite()}
        />
      </StyledMetricsSection>
    </>
  );
};

export default DoraMetrics;
