import React, { useEffect } from 'react'
import { useAppSelector } from '@src/hooks'
import { selectConfig } from '@src/context/config/configSlice'
import {
  CALENDAR,
  DORA_METRICS,
  METRICS_SUBTITLE,
  REPORT_PAGE,
  METRICS_TITLE,
  REQUIRED_DATA,
} from '@src/constants/resources'
import { ReportRequestDTO } from '@src/clients/report/dto/request'
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import dayjs from 'dayjs'
import { StyledMetricsSection } from '@src/components/Metrics/ReportStep/DoraMetrics/style'
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle'
import { ReportGrid } from '@src/components/Common/ReportGrid'
import { ReportResponseDTO } from '@src/clients/report/dto/response'
import { StyledSpacing } from '@src/components/Metrics/ReportStep/style'

interface DoraMetricsProps {
  startToRequestDoraData: (request: ReportRequestDTO) => void
  doraReport?: ReportResponseDTO
  csvTimeStamp: number
  startDate: string | null
  endDate: string | null
}

const DoraMetrics = ({ startToRequestDoraData, doraReport, csvTimeStamp, startDate, endDate }: DoraMetricsProps) => {
  const configData = useAppSelector(selectConfig)
  const { pipelineTool, sourceControl } = configData
  const { metrics, calendarType } = configData.basic
  const { pipelineCrews, deploymentFrequencySettings, leadTimeForChanges } = useAppSelector(selectMetricsContent)
  const shouldShowSourceControl = metrics.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES)

  const getDoraReportRequestBody = (): ReportRequestDTO => {
    const doraMetrics = metrics.filter((metric) => DORA_METRICS.includes(metric))

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
    }
  }

  const getPipelineConfig = (pipelineConfigs: IPipelineConfig[]) => {
    if (!pipelineConfigs[0].organization && pipelineConfigs.length === 1) {
      return []
    }
    return pipelineConfigs.map(({ organization, pipelineName, step, branches }) => {
      const pipelineConfigFromPipelineList = configData.pipelineTool.verifiedResponse.pipelineList.find(
        (pipeline) => pipeline.name === pipelineName && pipeline.orgName === organization
      )
      if (pipelineConfigFromPipelineList != undefined) {
        const { orgName, orgId, name, id, repository } = pipelineConfigFromPipelineList
        return {
          orgId,
          orgName,
          id,
          name,
          step,
          repository,
          branches,
        }
      }
    }) as {
      id: string
      name: string
      orgId: string
      orgName: string
      repository: string
      step: string
      branches: string[]
    }[]
  }

  const getSourceControlItems = () => {
    const leadTimeForChanges = doraReport?.leadTimeForChanges
    return [
      {
        title: METRICS_TITLE.LEAD_TIME_FOR_CHANGES,
        items: leadTimeForChanges && [
          {
            value: leadTimeForChanges.avgLeadTimeForChanges.prLeadTime,
            subtitle: METRICS_SUBTITLE.PR_LEAD_TIME,
          },
          {
            value: leadTimeForChanges.avgLeadTimeForChanges.pipelineLeadTime,
            subtitle: METRICS_SUBTITLE.PIPELINE_LEAD_TIME,
          },
          {
            value: leadTimeForChanges.avgLeadTimeForChanges.totalDelayTime,
            subtitle: METRICS_SUBTITLE.TOTAL_DELAY_TIME,
          },
        ],
      },
    ]
  }

  const getPipelineItems = () => {
    const deploymentFrequency = doraReport?.deploymentFrequency
    const meanTimeToRecovery = doraReport?.meanTimeToRecovery
    const changeFailureRate = doraReport?.changeFailureRate

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
      : []

    const meanTimeToRecoveryList = metrics.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)
      ? [
          {
            title: METRICS_TITLE.MEAN_TIME_TO_RECOVERY,
            items: meanTimeToRecovery && [
              {
                value: meanTimeToRecovery.avgMeanTimeToRecovery.timeToRecovery,
                subtitle: METRICS_SUBTITLE.DEPLOYMENT_FREQUENCY,
              },
            ],
          },
        ]
      : []

    const changeFailureRateList = metrics.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE)
      ? [
          {
            title: METRICS_TITLE.CHANGE_FAILURE_RATE,
            items: changeFailureRate && [
              {
                value: changeFailureRate.avgChangeFailureRate.failureRate,
                extraValue: `% (${changeFailureRate.avgChangeFailureRate.totalFailedTimes}/${changeFailureRate.avgChangeFailureRate.totalTimes})`,
                subtitle: METRICS_SUBTITLE.FAILURE_RATE,
              },
            ],
          },
        ]
      : []

    return [...deploymentFrequencyList, ...changeFailureRateList, ...meanTimeToRecoveryList]
  }

  useEffect(() => {
    startToRequestDoraData(getDoraReportRequestBody())
  }, [])

  return (
    <>
      <StyledMetricsSection>
        <ReportTitle title={REPORT_PAGE.DORA.TITLE} />
        {shouldShowSourceControl && <ReportGrid reportDetails={getSourceControlItems()} />}
        <StyledSpacing />
        <ReportGrid reportDetails={getPipelineItems()} lastGrid={true} />
      </StyledMetricsSection>
    </>
  )
}

export default DoraMetrics
