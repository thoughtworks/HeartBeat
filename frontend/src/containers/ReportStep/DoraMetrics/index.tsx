import {
  CALENDAR,
  DORA_METRICS,
  METRICS_SUBTITLE,
  METRICS_TITLE,
  REPORT_PAGE,
  REQUIRED_DATA,
  RETRY,
  SHOW_MORE,
} from '@src/constants/resources';
import { StyledMetricsSection, StyledShowMore, StyledTitleWrapper } from '@src/containers/ReportStep/DoraMetrics/style';
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice';
import { formatMillisecondsToHours, formatMinToHours } from '@src/utils/util';
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { ReportRequestDTO } from '@src/clients/report/dto/request';
import { StyledSpacing } from '@src/containers/ReportStep/style';
import { ReportGrid } from '@src/components/Common/ReportGrid';
import { selectConfig } from '@src/context/config/configSlice';
import { StyledRetry } from '../BoardMetrics/BoardMetrics';
import { Nullable } from '@src/utils/types';
import { useAppSelector } from '@src/hooks';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';

interface DoraMetricsProps {
  startToRequestDoraData: (request: ReportRequestDTO) => void;
  onShowDetail: () => void;
  doraReport?: ReportResponseDTO;
  csvTimeStamp: number;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  isBackFromDetail: boolean;
  errorMessage: string;
}

const DoraMetrics = ({
  isBackFromDetail,
  startToRequestDoraData,
  onShowDetail,
  doraReport,
  csvTimeStamp,
  startDate,
  endDate,
  errorMessage,
}: DoraMetricsProps) => {
  const configData = useAppSelector(selectConfig);
  const { pipelineTool, sourceControl } = configData;
  const { metrics, calendarType } = configData.basic;
  const { pipelineCrews, deploymentFrequencySettings, leadTimeForChanges } = useAppSelector(selectMetricsContent);
  const shouldShowSourceControl = metrics.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES);

  const getDoraReportRequestBody = (): ReportRequestDTO => {
    const doraMetrics = metrics.filter((metric) => DORA_METRICS.includes(metric));

    return {
      metrics: doraMetrics,
      startTime: dayjs(startDate).valueOf().toString(),
      endTime: dayjs(endDate).valueOf().toString(),
      considerHoliday: calendarType === CALENDAR.CHINA,
      buildKiteSetting: {
        pipelineCrews,
        ...pipelineTool.config,
        deploymentEnvList: getPipelineConfig(deploymentFrequencySettings),
      },
      codebaseSetting: {
        type: sourceControl.config.type,
        token: sourceControl.config.token,
        leadTime: getPipelineConfig(leadTimeForChanges),
      },
      csvTimeStamp: csvTimeStamp,
    };
  };

  const getPipelineConfig = (pipelineConfigs: IPipelineConfig[]) =>
    pipelineConfigs.flatMap(({ organization, pipelineName, step, branches }) => {
      const pipelineConfigFromPipelineList = configData.pipelineTool.verifiedResponse.pipelineList.find(
        (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organization,
      );
      if (pipelineConfigFromPipelineList) {
        const { orgName, orgId, name, id, repository } = pipelineConfigFromPipelineList;
        return [
          {
            orgId,
            orgName,
            id,
            name,
            step,
            repository,
            branches,
          },
        ];
      }
      return [];
    });

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
    const meanTimeToRecovery = doraReport?.meanTimeToRecovery;
    const changeFailureRate = doraReport?.changeFailureRate;

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

    const meanTimeToRecoveryList = metrics.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)
      ? [
          {
            title: METRICS_TITLE.MEAN_TIME_TO_RECOVERY,
            items: meanTimeToRecovery && [
              {
                value: formatMillisecondsToHours(meanTimeToRecovery.avgMeanTimeToRecovery.timeToRecovery),
                subtitle: METRICS_SUBTITLE.MEAN_TIME_TO_RECOVERY_HOURS,
              },
            ],
          },
        ]
      : [];

    const changeFailureRateList = metrics.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE)
      ? [
          {
            title: METRICS_TITLE.CHANGE_FAILURE_RATE,
            items: changeFailureRate && [
              {
                value: changeFailureRate.avgChangeFailureRate.failureRate * 100,
                extraValue: `% (${changeFailureRate.avgChangeFailureRate.totalFailedTimes}/${changeFailureRate.avgChangeFailureRate.totalTimes})`,
                subtitle: METRICS_SUBTITLE.FAILURE_RATE,
              },
            ],
          },
        ]
      : [];

    return [...deploymentFrequencyList, ...changeFailureRateList, ...meanTimeToRecoveryList];
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
      ? `Failed to get Github info, status: ${_.get(doraReport, [
          'reportMetricsError',
          'sourceControlMetricsError',
          'status',
        ])}`
      : '';

  const hasDoraError = !!(getErrorMessage4BuildKite() || getErrorMessage4Github());

  const shouldShowRetry = () => {
    const dataGetCompleted = doraReport?.sourceControlMetricsCompleted && doraReport?.pipelineMetricsCompleted;
    return (hasDoraError && dataGetCompleted) || errorMessage;
  };

  const handleRetry = () => {
    startToRequestDoraData(getDoraReportRequestBody());
  };

  useEffect(() => {
    !isBackFromDetail && startToRequestDoraData(getDoraReportRequestBody());
  }, []);

  return (
    <>
      <StyledMetricsSection>
        <StyledTitleWrapper>
          <ReportTitle title={REPORT_PAGE.DORA.TITLE} />
          {!hasDoraError &&
            !errorMessage &&
            (doraReport?.pipelineMetricsCompleted || doraReport?.sourceControlMetricsCompleted) && (
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
