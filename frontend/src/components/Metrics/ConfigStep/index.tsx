import { ConfigStepWrapper } from './style'
import { MetricsTypeCheckbox } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox'
import BasicInfo from '@src/components/Metrics/ConfigStep/BasicInfo'

const ConfigStep = () => {
  return (
    <ConfigStepWrapper>
      <BasicInfo></BasicInfo>
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  )
}

export default ConfigStep
