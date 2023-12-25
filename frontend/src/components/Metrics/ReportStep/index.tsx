import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { useAppSelector } from '@src/hooks'
import { selectConfig } from '@src/context/config/configSlice'
import { DORA_METRICS, MESSAGE, REQUIRED_DATA } from '@src/constants/resources'
import { StyledErrorNotification } from '@src/components/Metrics/ReportStep/style'
import { ErrorNotification } from '@src/components/ErrorNotification'
import { useNavigate } from 'react-router-dom'
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'
import { ROUTE } from '@src/constants/router'
import { ReportButtonGroup } from '@src/components/Metrics/ReportButtonGroup'
import BoardMetrics from '@src/components/Metrics/ReportStep/BoradMetrics'
import DoraMetrics from '@src/components/Metrics/ReportStep/DoraMetrics'
import { selectTimeStamp } from '@src/context/stepper/StepperSlice'

export interface ReportStepProps {
  notification: useNotificationLayoutEffectInterface
  handleSave: () => void
}

const ReportStep = ({ notification, handleSave }: ReportStepProps) => {
  const navigate = useNavigate()
  const {
    isServerError,
    errorMessage: reportErrorMsg,
    startToRequestBoardData,
    startToRequestDoraData,
    reportData,
    stopPollingReports,
  } = useGenerateReportEffect()

  const [exportValidityTimeMin] = useState<number | undefined>(undefined)
  const configData = useAppSelector(selectConfig)
  const csvTimeStamp = useAppSelector(selectTimeStamp)

  const { startDate, endDate } = configData.basic.dateRange
  const { updateProps } = notification
  const [errorMessage, setErrorMessage] = useState<string>()

  const { metrics } = configData.basic
  const shouldShowBoardMetrics = metrics.includes(REQUIRED_DATA.VELOCITY) || metrics.includes(REQUIRED_DATA.CYCLE_TIME)
  const shouldShowDoraMetrics = metrics.some((metric) => DORA_METRICS.includes(metric))

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
    setErrorMessage(reportErrorMsg)
  }, [reportErrorMsg])

  useLayoutEffect(() => {
    return () => {
      stopPollingReports()
    }
  }, [])

  return (
    <>
      {isServerError ? (
        navigate(ROUTE.ERROR_PAGE)
      ) : (
        <>
          {errorMessage && (
            <StyledErrorNotification>
              <ErrorNotification message={errorMessage} />
            </StyledErrorNotification>
          )}
          <>
            {shouldShowBoardMetrics && (
              <BoardMetrics
                startDate={startDate}
                endDate={endDate}
                startToRequestBoardData={startToRequestBoardData}
                boardReport={reportData}
                csvTimeStamp={csvTimeStamp}
              />
            )}
            {shouldShowDoraMetrics && (
              <DoraMetrics
                startDate={startDate}
                endDate={endDate}
                startToRequestDoraData={startToRequestDoraData}
                doraReport={reportData}
                csvTimeStamp={csvTimeStamp}
              />
            )}
          </>
          <ReportButtonGroup
            handleSave={() => handleSave()}
            reportData={reportData}
            startDate={startDate}
            endDate={endDate}
            csvTimeStamp={csvTimeStamp}
            setErrorMessage={(message) => {
              setErrorMessage(message)
            }}
          />
        </>
      )}
    </>
  )
}

export default ReportStep
