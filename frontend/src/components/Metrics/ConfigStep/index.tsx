import { ConfigStepWrapper } from './style'
import { MetricsTypeCheckbox } from '@src/components/Metrics/ConfigStep/MetricsTypeCheckbox'
import BasicInfo from '@src/components/Metrics/ConfigStep/BasicInfo'
import { useEffect, useLayoutEffect } from 'react'
import { NotificationButtonProps } from '@src/components/Common/NotificationButton/NotificationButton'

const ConfigStep = (props: NotificationButtonProps) => {
  const { setNotificationProps } = props

  useLayoutEffect(() => {
    setNotificationProps?.({
      open: false,
      title: '',
    })
  }, [])

  return (
    <ConfigStepWrapper>
      <BasicInfo></BasicInfo>
      <MetricsTypeCheckbox />
    </ConfigStepWrapper>
  )
}

export default ConfigStep
