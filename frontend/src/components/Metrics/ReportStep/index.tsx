import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectJiraColumns, selectMetrics } from '@src/context/config/configSlice'
import { CALENDAR, MESSAGE, REQUIRED_DATA, TIPS } from '@src/constants/resources'
import { COMMON_BUTTONS, DOWNLOAD_TYPES } from '@src/constants/commons'
import { BoardReportRequestDTO, CSVReportRequestDTO } from '@src/clients/report/dto/request'
import { selectMetricsContent } from '@src/context/Metrics/metricsSlice'
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

const board1 = [
  {
    title: 'Velocity',
    items: [
      {
        value: '0.12',
        subtitle: 'Average Cycle Time(Days/SP)',
      },
      {
        value: '1.73',
        subtitle: 'Total Lead Time',
      },
      {
        value: '0.93',
        subtitle: 'Pipeline Lead Time',
      },
    ],
  },
  {
    title: 'Cycle Time',
    items: [
      {
        value: '0.12',
        subtitle: 'Average Cycle Time(Days/SP)',
      },
    ],
  },
]

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
  const { startPollingBoardReport, isServerError, errorMessage: reportErrorMsg } = useGenerateReportEffect()
  const { fetchExportData, errorMessage: csvErrorMsg, isExpired } = useExportCsvEffect()
  const [exportValidityTimeMin] = useState<number | undefined>(undefined)
  const csvTimeStamp = useAppSelector(selectTimeStamp)
  const configData = useAppSelector(selectConfig)
  const { cycleTimeSettings, treatFlagCardAsBlock, users, targetFields, doneColumn, assigneeFilter } =
    useAppSelector(selectMetricsContent)
  const { metrics, calendarType, dateRange } = configData.basic
  const { board } = configData
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

  const getBoardReportRequestBody = (): BoardReportRequestDTO => ({
    metrics: metrics,
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
  })

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
    startPollingBoardReport(getBoardReportRequestBody())
  }, [])

  useEffect(() => {
    setErrorMessage([reportErrorMsg, csvErrorMsg])
  }, [reportErrorMsg, csvErrorMsg])

  return (
    <>
      {isServerError ? (
        navigate(ROUTE.ERROR_PAGE)
      ) : (
        <>
          {startDate && endDate && <CollectionDuration startDate={startDate} endDate={endDate} />}
          {handleErrorNotification()}
          <>
            <StyledMetricsSection>
              <ReportTitle title='Board Metrics' />
              <ReportGrid reportDetails={board1} />
            </StyledMetricsSection>

            <StyledMetricsSection>
              <ReportTitle title='DORA Metrics' />
              <ReportGrid reportDetails={dora1} />
              <StyledSpacing />
              <ReportGrid reportDetails={dora2} lastGrid={true} />
            </StyledMetricsSection>
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
