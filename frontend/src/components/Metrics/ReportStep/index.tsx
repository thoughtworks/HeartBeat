import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectJiraColumns, selectMetrics } from '@src/context/config/configSlice'
import { BOARD_METRICS, CALENDAR, DORA_METRICS, MESSAGE, REQUIRED_DATA, TIPS } from '@src/constants/resources'
import { COMMON_BUTTONS, DOWNLOAD_TYPES } from '@src/constants/commons'
import { BoardReportRequestDTO, CSVReportRequestDTO, ReportRequestDTO } from '@src/clients/report/dto/request'
import { IPipelineConfig, selectMetricsContent } from '@src/context/Metrics/metricsSlice'
import dayjs from 'dayjs'
import { BackButton, SaveButton } from '@src/components/Metrics/MetricsStepper/style'
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect'
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import {
  StyledButtonGroup,
  StyledErrorNotification,
  StyledExportButton,
  StyledMetricsSection,
  StyledSpacing,
} from '@src/components/Metrics/ReportStep/style'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { useNavigate } from 'react-router-dom'
import CollectionDuration from '@src/components/Common/CollectionDuration'
import { ExpiredDialog } from '@src/components/Metrics/ReportStep/ExpiredDialog'
import { filterAndMapCycleTimeSettings, getJiraBoardToken } from '@src/utils/util'
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'
import { ROUTE } from '@src/constants/router'
import { Tooltip } from '@mui/material'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle/ReportTitle'
import { ReportGrid } from '@src/components/Common/ReportGrid'

const dora1 = [
  {
    title: 'Lead Time For Change',
    items: [
      {
        value: '7.34',
        subtitle: 'PR Lead Time',
      },
      {
        value: '0,03',
        subtitle: 'Pipeline Lead Time',
      },
      {
        value: '7.22',
        subtitle: 'Total Lead Time',
      },
    ],
  },
]

const dora2 = [
  {
    title: 'Deployment Frequency',
    items: undefined,
  },
  {
    title: 'Change Failure Rate',
    items: [
      {
        value: '102.33',
        subtitle: 'Deployment',
      },
      {
        value: '7.34',
        subtitle: 'PR Lead Time',
      },
    ],
  },
  {
    title: 'Mean Time To Recovery',
    items: [
      {
        value: '99.33',
        subtitle: 'Average Cycle Time(Days/SP)',
      },
    ],
  },
]

export interface ReportStepProps {
  notification: useNotificationLayoutEffectInterface
  handleSave: () => void
}
const ReportStep = ({ notification, handleSave }: ReportStepProps) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {
    isServerError,
    errorMessage: reportErrorMsg,
    startPollingReports,
    stopPollingReports,
    reportData = {
      velocity: {
        velocityForSP: 0,
        velocityForCards: 0,
      },
      cycleTime: {
        averageCycleTimePerCard: 0,
        averageCycleTimePerSP: 0,
        totalTimeForCards: 0,
        swimlaneList: [
          {
            optionalItemName: '',
            averageTimeForSP: 0,
            averageTimeForCards: 0,
            totalTime: 0,
          },
        ],
      },
      classificationList: [
        {
          fieldName: '',
          pairList: [],
        },
      ],
      deploymentFrequency: undefined,
      leadTimeForChanges: {
        leadTimeForChangesOfPipelines: [],
        avgLeadTimeForChanges: {
          name: '',
          prLeadTime: 1,
          pipelineLeadTime: 1,
          totalDelayTime: 1,
        },
      },
      changeFailureRate: {
        avgChangeFailureRate: {
          name: '',
          totalTimes: 0,
          totalFailedTimes: 0,
          failureRate: 0.0,
        },
        changeFailureRateOfPipelines: [],
      },
      meanTimeToRecovery: {
        avgMeanTimeToRecovery: { name: 'Average', timeToRecovery: 0 },
        meanTimeRecoveryPipelines: [{ timeToRecovery: 0, name: 'Heartbeat', step: ':lock: Check Security' }],
      },
    },
  } = useGenerateReportEffect()
  const { fetchExportData, errorMessage: csvErrorMsg, isExpired } = useExportCsvEffect()
  const [exportValidityTimeMin] = useState<number | undefined>(undefined)
  const csvTimeStamp = useAppSelector(selectTimeStamp)
  const configData = useAppSelector(selectConfig)
  const {
    cycleTimeSettings,
    treatFlagCardAsBlock,
    users,
    pipelineCrews,
    targetFields,
    doneColumn,
    deploymentFrequencySettings,
    leadTimeForChanges,
    assigneeFilter,
  } = useAppSelector(selectMetricsContent)
  const { metrics, calendarType, dateRange } = configData.basic
  const { board, pipelineTool, sourceControl } = configData
  const { token, type, site, projectKey, boardId, email } = board.config
  const { startDate, endDate } = dateRange
  const requiredData = useAppSelector(selectMetrics)
  const isShowExportBoardButton =
    requiredData.includes(REQUIRED_DATA.VELOCITY) ||
    requiredData.includes(REQUIRED_DATA.CYCLE_TIME) ||
    requiredData.includes(REQUIRED_DATA.CLASSIFICATION)
  const isShowExportPipelineButton =
    requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
    requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
    requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
    requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)
  const { updateProps } = notification
  const [errorMessage, setErrorMessage] = useState([reportErrorMsg, csvErrorMsg])
  const jiraToken = getJiraBoardToken(token, email)
  const jiraColumns = useAppSelector(selectJiraColumns)
  const jiraColumnsWithValue = jiraColumns?.map(
    (obj: { key: string; value: { name: string; statuses: string[] } }) => obj.value
  )

  const handleDownload = (dataType: DOWNLOAD_TYPES, startDate: string | null, endDate: string | null) => {
    fetchExportData(getExportCSV(dataType, startDate, endDate))
  }

  const getExportCSV = (
    dataType: DOWNLOAD_TYPES,
    startDate: string | null,
    endDate: string | null
  ): CSVReportRequestDTO => ({
    dataType: dataType,
    csvTimeStamp: csvTimeStamp,
    startDate: startDate ?? '',
    endDate: endDate ?? '',
  })

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

  const getBoardReportRequestBody = (): BoardReportRequestDTO => {
    const boardMetrics = metrics.filter((metric) => BOARD_METRICS.includes(metric))
    return {
      metrics: boardMetrics,
      startTime: dayjs(startDate).valueOf().toString(),
      endTime: dayjs(endDate).valueOf().toString(),
      considerHoliday: calendarType === CALENDAR.CHINA,
      jiraBoardSetting: {
        token: jiraToken,
        type: type.toLowerCase().replace(' ', '-'),
        site,
        projectKey,
        boardId,
        boardColumns: filterAndMapCycleTimeSettings(cycleTimeSettings, jiraColumnsWithValue),
        treatFlagCardAsBlock,
        users,
        assigneeFilter,
        targetFields,
        doneColumn,
      },
      csvTimeStamp: csvTimeStamp,
    }
  }

  const handleBack = () => {
    dispatch(backStep())
  }

  const handleErrorNotification = () => {
    {
      return errorMessage.map((message: string) => {
        if (message === '') return
        return (
          <StyledErrorNotification key={message}>
            <ErrorNotification message={message} />
          </StyledErrorNotification>
        )
      })
    }
  }

  useLayoutEffect(() => {
    exportValidityTimeMin &&
      updateProps?.({
        open: true,
        title: MESSAGE.NOTIFICATION_FIRST_REPORT.replace('%s', exportValidityTimeMin.toString()),
        closeAutomatically: true,
      })
  }, [exportValidityTimeMin])

  useLayoutEffect(() => {
    if (exportValidityTimeMin) {
      const startTime = Date.now()
      const timer = setInterval(() => {
        const currentTime = Date.now()
        const elapsedTime = currentTime - startTime

        const remainingExpireTime = 5 * 60 * 1000
        const remainingTime = exportValidityTimeMin * 60 * 1000 - elapsedTime
        if (remainingTime <= remainingExpireTime) {
          updateProps?.({
            open: true,
            title: MESSAGE.EXPIRE_IN_FIVE_MINUTES,
            closeAutomatically: true,
          })
          clearInterval(timer)
        }
      }, 1000)

      return () => {
        clearInterval(timer)
      }
    }
  }, [exportValidityTimeMin])

  useEffect(() => {
    startPollingReports(getBoardReportRequestBody(), getDoraReportRequestBody())
  }, [])

  useEffect(() => {
    setErrorMessage([reportErrorMsg, csvErrorMsg])
  }, [reportErrorMsg, csvErrorMsg])

  useEffect(() => {
    return () => {
      stopPollingReports()
    }
  })

  const getBoardItems = () => {
    const { velocity, cycleTime } = reportData
    return [
      {
        title: 'Velocity',
        items: [
          {
            value: velocity?.velocityForSP,
            subtitle: 'Average Cycle Time',
            unit: '(Days/SP)',
          },
          {
            value: velocity?.velocityForCards,
            subtitle: 'Throughput',
            unit: '(Cards Count)',
          },
        ],
      },
      {
        title: 'Cycle Time',
        items: [
          {
            value: cycleTime?.averageCycleTimePerSP,
            subtitle: 'Average Cycle Time',
            unit: '(Days/SP)',
          },
          {
            value: cycleTime?.averageCycleTimePerCard,
            subtitle: 'Average Cycle Time',
            unit: '(Days/Card)',
          },
        ],
      },
    ]
  }

  const getSourceControlItems = () => {
    const { leadTimeForChanges } = reportData
    return [
      {
        title: 'Lead Time For Change',
        items: leadTimeForChanges && [
          {
            value: leadTimeForChanges.avgLeadTimeForChanges.prLeadTime,
            subtitle: 'PR Lead Time',
          },
          {
            value: leadTimeForChanges.avgLeadTimeForChanges.pipelineLeadTime,
            subtitle: 'Pipeline Lead Time',
          },
          {
            value: leadTimeForChanges.avgLeadTimeForChanges.totalDelayTime,
            subtitle: 'Total Lead Time',
          },
        ],
      },
    ]
  }

  const getPipelineItems = () => {
    const { deploymentFrequency, meanTimeToRecovery, changeFailureRate } = reportData

    const deploymentFrequencyList = metrics.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY)
      ? [
          {
            title: 'Deployment Frequency',
            items: deploymentFrequency && [
              {
                value: deploymentFrequency?.avgDeploymentFrequency.deploymentFrequency,
                subtitle: 'Deployment Frequency(Deployments/Day)',
              },
            ],
          },
        ]
      : []

    const meanTimeToRecoveryList = metrics.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)
      ? [
          {
            title: 'Mean Time To Recovery',
            items: meanTimeToRecovery && [
              {
                value: meanTimeToRecovery.avgMeanTimeToRecovery.timeToRecovery,
                subtitle: 'Deployment Frequency(Deployments/Day)',
              },
            ],
          },
        ]
      : []

    const changeFailureRateList = metrics.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE)
      ? [
          {
            title: 'Change Failure Rate',
            items: changeFailureRate && [
              {
                value: changeFailureRate.avgChangeFailureRate.failureRate,
                extraValue: `${changeFailureRate.avgChangeFailureRate.totalFailedTimes}/${changeFailureRate.avgChangeFailureRate.totalTimes}`,
                subtitle: 'Fallurerate',
              },
            ],
          },
        ]
      : []

    return [...deploymentFrequencyList, ...changeFailureRateList, ...meanTimeToRecoveryList]
  }

  const shouldShowDoraMetrics = metrics.some((metric) => DORA_METRICS.includes(metric))
  const shouldShowSourceControl = metrics.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES)

  return (
    <>
      {isServerError ? (
        navigate(ROUTE.ERROR_PAGE)
      ) : (
        <>
          {startDate && endDate && <CollectionDuration startDate={startDate} endDate={endDate} />}
          {handleErrorNotification()}
          <>
            {reportData && (
              <StyledMetricsSection>
                <ReportTitle title='Board Metrics' />
                <ReportGrid reportDetails={getBoardItems()} />
              </StyledMetricsSection>
            )}

            {shouldShowDoraMetrics && (
              <StyledMetricsSection>
                <ReportTitle title='DORA Metrics' />
                {shouldShowSourceControl && <ReportGrid reportDetails={getSourceControlItems()} />}
                <StyledSpacing />
                <ReportGrid reportDetails={getPipelineItems()} lastGrid={true} />
              </StyledMetricsSection>
            )}
          </>

          <StyledButtonGroup>
            <Tooltip title={TIPS.SAVE_CONFIG} placement={'right'}>
              <SaveButton variant='text' onClick={handleSave} startIcon={<SaveAltIcon />}>
                {COMMON_BUTTONS.SAVE}
              </SaveButton>
            </Tooltip>
            <div>
              <BackButton onClick={handleBack} variant='outlined'>
                {COMMON_BUTTONS.BACK}
              </BackButton>
              <StyledExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.METRICS, startDate, endDate)}>
                {COMMON_BUTTONS.EXPORT_METRIC_DATA}
              </StyledExportButton>
              {isShowExportBoardButton && (
                <StyledExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.BOARD, startDate, endDate)}>
                  {COMMON_BUTTONS.EXPORT_BOARD_DATA}
                </StyledExportButton>
              )}
              {isShowExportPipelineButton && (
                <StyledExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.PIPELINE, startDate, endDate)}>
                  {COMMON_BUTTONS.EXPORT_PIPELINE_DATA}
                </StyledExportButton>
              )}
            </div>
          </StyledButtonGroup>
          {<ExpiredDialog isExpired={isExpired} handleOk={handleBack} />}
        </>
      )}
    </>
  )
}

export default ReportStep
