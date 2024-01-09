import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { useAppSelector } from '@src/hooks';
import { selectConfig } from '@src/context/config/configSlice';
import {
  CALENDAR,
  DORA_METRICS,
  METRICS_SUBTITLE,
  REPORT_PAGE,
  METRICS_TITLE,
  REQUIRED_DATA,
  SHOW_MORE,
  RETRY,
} from '@src/constants/resources';
import { ReportRequestDTO } from '@src/clients/report/dto/request';
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice';
import dayjs from 'dayjs';
import { StyledMetricsSection } from '@src/containers/ReportStep/DoraMetrics/style';
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle';
import { ReportGrid } from '@src/components/Common/ReportGrid';
import { ReportResponseDTO } from '@src/clients/report/dto/response';
import { StyledSpacing } from '@src/containers/ReportStep/style';
import { formatMillisecondsToHours, formatMinToHours } from '@src/utils/util';
import { StyledShowMore, StyledTitleWrapper } from '@src/containers/ReportStep/DoraMetrics/style';
import { StyledRetry } from '../BoradMetrics/style';
import { Nullable } from '@src/utils/types';

interface DoraMetricsProps {
  startToRequestDoraData: (request: ReportRequestDTO) => void;
  onShowDetail: () => void;
  doraReport?: ReportResponseDTO;
  csvTimeStamp: number;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  isBackFromDetail: boolean;
  timeoutError: string;
}

const DoraMetrics = ({
  isBackFromDetail,
  startToRequestDoraData,
  onShowDetail,
  doraReport,
  csvTimeStamp,
  startDate,
  endDate,
  timeoutError,
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

  const getPipelineConfig = (pipelineConfigs: IPipelineConfig[]) => {
    if (!pipelineConfigs[0].organization && pipelineConfigs.length === 1) {
      return [];
    }
    return pipelineConfigs.map(({ organization, pipelineName, step, branches }) => {
      const pipelineConfigFromPipelineList = configData.pipelineTool.verifiedResponse.pipelineList.find(
        (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organization
      );
      if (pipelineConfigFromPipelineList != undefined) {
        const { orgName, orgId, name, id, repository } = pipelineConfigFromPipelineList;
        return {
          orgId,
          orgName,
          id,
          name,
          step,
          repository,
          branches,
        };
      }
    }) as {
      id: string;
      name: string;
      orgId: string;
      orgName: string;
      repository: string;
      step: string;
      branches: string[];
    }[];
  };

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

  const errorMessage4BuildKite = _.get(doraReport, ['reportError', 'pipelineError'])
    ? `Failed to get BuildKite info_status: ${_.get(doraReport, ['reportError', 'pipelineError', 'status'])}...`
    : '';

  const errorMessage4Github = _.get(doraReport, ['reportError', 'sourceControlError'])
    ? `Failed to get Github info_status: ${_.get(doraReport, ['reportError', 'sourceControlError', 'status'])}...`
    : '';

  const showRetryButton = !!(timeoutError || errorMessage4BuildKite || errorMessage4Github);

  const [error4Github, setError4Github] = useState('');
  const [error4BuildKite, setError4BuildKite] = useState('');

  const handleRetry = () => {
    startToRequestDoraData(getDoraReportRequestBody());
    setError4Github('');
    setError4BuildKite('');
  };

  useEffect(() => {
    !isBackFromDetail && startToRequestDoraData(getDoraReportRequestBody());
  }, []);

  useEffect(() => {
    setError4Github(timeoutError || errorMessage4Github);
    setError4BuildKite(timeoutError || errorMessage4BuildKite);
  }, [timeoutError, errorMessage4Github, errorMessage4BuildKite]);

  return (
    <>
      <StyledMetricsSection>
        <StyledTitleWrapper>
          <ReportTitle title={REPORT_PAGE.DORA.TITLE} />
          {!showRetryButton && (doraReport?.pipelineMetricsCompleted || doraReport?.sourceControlMetricsCompleted) && (
            <StyledShowMore onClick={onShowDetail}>{SHOW_MORE}</StyledShowMore>
          )}
          {showRetryButton && <StyledRetry onClick={handleRetry}>{RETRY}</StyledRetry>}
        </StyledTitleWrapper>
        {shouldShowSourceControl && <ReportGrid reportDetails={getSourceControlItems()} errorMessage={error4Github} />}
        <StyledSpacing />
        <ReportGrid reportDetails={getPipelineItems()} lastGrid={true} errorMessage={error4BuildKite} />
      </StyledMetricsSection>
    </>
  );
};

export default DoraMetrics;