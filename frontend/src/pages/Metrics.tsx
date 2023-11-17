import Header from '@src/layouts/Header'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext'
import { NotificationProvider } from '@src/hooks/useNotificationContext'

const Metrics = () => (
  <>
    <NotificationProvider>
      <Header />
      <ContextProvider>
        <MetricsStepper />
      </ContextProvider>
    </NotificationProvider>
  </>
)

export default Metrics
