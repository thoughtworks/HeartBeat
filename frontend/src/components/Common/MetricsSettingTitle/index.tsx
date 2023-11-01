import styled from '@emotion/styled'

export const MetricsSettingTitleContainer = styled.div({
  margin: '1.25rem 0',
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontSize: '1rem',
  lineHeight: '1.25rem',
  fontWeight: '600',
})

export const MetricsSettingTitle = (props: { title: string }) => (
  <MetricsSettingTitleContainer>{props.title}</MetricsSettingTitleContainer>
)
