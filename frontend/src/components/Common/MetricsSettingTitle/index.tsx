import styled from '@emotion/styled'
import { Divider } from '@src/components/Common/MetricsSettingTitle/style'

export const MetricsSettingTitle = (props: { title: string }) => (
  <Divider>
    <h4>{props.title}</h4>
  </Divider>
)

export const MetricsSettingButtonContainer = styled.div({
  display: 'flex',
  justifyContent: 'center',
})
