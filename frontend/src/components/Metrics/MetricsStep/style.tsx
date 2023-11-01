import { styled } from '@mui/material/styles'
import { Divider } from '@src/components/Common/MetricsSettingTitle/style'

export const MetricSelectionWrapper = styled('div')({
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '1.5rem',
  marginBottom: '1.5rem',
  borderRadius: '0.75rem',
  border: '0.1rem',
  boxShadow: '0 0.25rem 1rem 0 rgba(0, 0, 0, 0.08)',
})

export const MetricsSelectionTitle = styled(Divider)({
  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
  fontSize: '1rem',
  lineHeight: '1.25rem',
  fontWeight: '600',
})

export const ReportSelectionTitle = styled(MetricsSelectionTitle)({
  marginBottom: '1rem',
})
