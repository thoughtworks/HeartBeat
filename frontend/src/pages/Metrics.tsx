import Header from '@src/layouts/Header'
import MetricsStepper from '@src/components/Metrics/MetricsStepper'
import { ContextProvider } from '@src/hooks/useMetricsStepValidationCheckContext'

const Metrics = () => (
  <>
    <Header />
    <ContextProvider>
      <MetricsStepper />
    </ContextProvider>
  </>
)

export default Metrics
