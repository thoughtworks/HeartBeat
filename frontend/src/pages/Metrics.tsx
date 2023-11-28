import Header from '@src/layouts/Header'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext'
import { useNotificationLayoutEffect } from '@src/hooks/useNotificationLayoutEffect'

const Metrics = () => {
  const props = useNotificationLayoutEffect()

  return (
    <>
      <Header {...props} />
      <ContextProvider>
        <MetricsStepper {...props} />
      </ContextProvider>
    </>
  )
}

export default Metrics
