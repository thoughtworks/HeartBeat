import Header from '@src/layouts/Header'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext'
import { useState } from 'react'

const Metrics = () => {
  const [notificationProps, setNotificationProps] = useState({ open: false, title: '' })
  return (
    <>
      <Header notificationProps={notificationProps} setNotificationProps={setNotificationProps} />
      <ContextProvider>
        <MetricsStepper notificationProps={notificationProps} setNotificationProps={setNotificationProps} />
      </ContextProvider>
    </>
  )
}

export default Metrics
