import { ROUTE } from '@src/constants/router'
import { useGenerateReportEffect } from '@src/hooks/useGenerateReportEffect'
import { useNavigate } from 'react-router-dom'
import { ErrorNotification } from '@src/components/ErrorNotification'
import React, { useLayoutEffect, useState } from 'react'
import { useNotificationLayoutEffectInterface } from '@src/hooks/useNotificationLayoutEffect'
import { MESSAGE } from '@src/constants/resources'
import { ReportGrid } from '@src/components/Common/ReportGrid'
import { ErrorNotificationContainer } from '@src/components/Metrics/ReportStep/style'

const ReportStep = ({ updateProps }: useNotificationLayoutEffectInterface) => {
  const navigate = useNavigate()
  const { isServerError, errorMessage: reportErrorMsg } = useGenerateReportEffect()
  const [exportValidityTimeMin] = useState<number | undefined>(undefined)

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
          {reportErrorMsg && (
            <ErrorNotificationContainer>
              <ErrorNotification message={reportErrorMsg} />
            </ErrorNotificationContainer>
          )}
          <ReportGrid />
        </>
      )}
    </>
  )
}

export default ReportStep
