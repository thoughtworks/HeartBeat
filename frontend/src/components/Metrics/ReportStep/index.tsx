import { ROUTE } from '@src/constants/router'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { useNavigate } from 'react-router-dom'
import { ErrorNotification } from '@src/components/ErrorNotification'
import React, { useLayoutEffect, useState } from 'react'
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'
import { MESSAGE, REQUIRED_DATA, TIPS } from '@src/constants/resources'
import { ReportGrid } from '@src/components/Common/ReportGrid'
import {
  StyledErrorNotification,
  StyledMetricsSection,
  StyledMetricsSign,
  StyledMetricsTitle,
  StyledMetricsTitleSection,
  StyledSpacing,
} from '@src/components/Metrics/ReportStep/style'
import { ButtonGroupStyle, ExportButton } from '@src/components/Metrics/ReportStep/ReportDetail/style'
import { Tooltip } from '@mui/material'
import { BackButton, SaveButton } from '@src/components/Metrics/MetricsStepper/style'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { COMMON_BUTTONS, DOWNLOAD_TYPES } from '@src/constants/commons'
import { backStep, selectTimeStamp } from '@src/context/stepper/StepperSlice'
import { useExportCsvEffect } from '@src/hooks/useExportCsvEffect'
import { useAppDispatch } from '@src/hooks/useAppDispatch'
import { CSVReportRequestDTO } from '@src/clients/report/dto/request'
import { useAppSelector } from '@src/hooks'
import { selectConfig, selectMetrics } from '@src/context/config/configSlice'
import { ExpiredDialog } from '@src/components/Metrics/ReportStep/ExpiredDialog'
import CollectionDuration from '@src/components/Common/CollectionDuration'
import { ReportTitle } from '@src/components/Common/ReportGrid/ReportTitle/ReportTitle'

const board = [
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
  const { isServerError, errorMessage: reportErrorMsg } = useGenerateReportEffect()
  const [exportValidityTimeMin] = useState<number | undefined>(undefined)
  const configData = useAppSelector(selectConfig)
  const requiredData = useAppSelector(selectMetrics)
  const csvTimeStamp = useAppSelector(selectTimeStamp)

  const { dateRange } = configData.basic
  const { fetchExportData, errorMessage: csvErrorMsg, isExpired } = useExportCsvEffect()
  const { updateProps } = notification
  const { startDate, endDate } = dateRange

  const isShowExportBoardButton =
    requiredData.includes(REQUIRED_DATA.VELOCITY) ||
    requiredData.includes(REQUIRED_DATA.CYCLE_TIME) ||
    requiredData.includes(REQUIRED_DATA.CLASSIFICATION)
  const isShowExportPipelineButton =
    requiredData.includes(REQUIRED_DATA.DEPLOYMENT_FREQUENCY) ||
    requiredData.includes(REQUIRED_DATA.CHANGE_FAILURE_RATE) ||
    requiredData.includes(REQUIRED_DATA.LEAD_TIME_FOR_CHANGES) ||
    requiredData.includes(REQUIRED_DATA.MEAN_TIME_TO_RECOVERY)

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

  const handleBack = () => {
    dispatch(backStep())
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

  return (
    <>
      {isServerError ? (
        navigate(ROUTE.ERROR_PAGE)
      ) : (
        <>
          {startDate && endDate && <CollectionDuration startDate={startDate} endDate={endDate} />}
          {reportErrorMsg && (
            <StyledErrorNotification>
              <ErrorNotification message={reportErrorMsg} />
            </StyledErrorNotification>
          )}
          {csvErrorMsg && (
            <StyledErrorNotification>
              <ErrorNotification message={csvErrorMsg} />
            </StyledErrorNotification>
          )}
          <div>
            <StyledMetricsSection>
              <ReportTitle title='Board Metrics' />
              <ReportGrid reportDetails={board} />
            </StyledMetricsSection>

            <StyledMetricsSection>
              <ReportTitle title='DORA Metrics' />
              <ReportGrid reportDetails={dora1} />
              <StyledSpacing />
              <ReportGrid reportDetails={dora2} lastGrid={true} />
            </StyledMetricsSection>
          </div>

          <ButtonGroupStyle>
            <Tooltip title={TIPS.SAVE_CONFIG} placement={'right'}>
              <SaveButton variant='text' onClick={handleSave} startIcon={<SaveAltIcon />}>
                {COMMON_BUTTONS.SAVE}
              </SaveButton>
            </Tooltip>
            <div>
              <BackButton onClick={handleBack} variant='outlined'>
                {COMMON_BUTTONS.BACK}
              </BackButton>
              <ExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.METRICS, startDate, endDate)}>
                {COMMON_BUTTONS.EXPORT_METRIC_DATA}
              </ExportButton>
              {isShowExportBoardButton && (
                <ExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.BOARD, startDate, endDate)}>
                  {COMMON_BUTTONS.EXPORT_BOARD_DATA}
                </ExportButton>
              )}
              {isShowExportPipelineButton && (
                <ExportButton onClick={() => handleDownload(DOWNLOAD_TYPES.PIPELINE, startDate, endDate)}>
                  {COMMON_BUTTONS.EXPORT_PIPELINE_DATA}
                </ExportButton>
              )}
            </div>
          </ButtonGroupStyle>
          {<ExpiredDialog isExpired={isExpired} handleOk={handleBack} />}
        </>
      )}
    </>
  )
}

export default ReportStep
