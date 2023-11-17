import { ConfigStepWrapper } from './style'
import { MetricsTypeCheckbox } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox'
import BasicInfo from '@src/components/Metrics/ConfigStep/BasicInfo'
import { useNotificationContext } from '@src/hooks/useNotificationContext'
import { useEffect } from 'react'

const ConfigStep = () => {
  const { setNotificationProps } = useNotificationContext()

  useEffect(() => {
    setNotificationProps({ title: '222222', open: true })
  }, [])

  return (
    <ConfigStepWrapper>
      <BasicInfo></BasicInfo>
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  )
}

export default ConfigStep
