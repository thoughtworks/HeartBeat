import { styled } from '@mui/material/styles'
import { Checkbox } from '@mui/material'
import { PipelineMetricSelectionWrapper } from '@src/components/Metrics/MetricsStep/DeploymentFrequencySettings/PipelineMetricSelection/style'

export const FlagCardItem = styled('div')({
  display: 'flex',
  margin: '0.5rem 0',
})

export const ItemText = styled('div')({
  padding: '0',
  fontSize: '1rem',
  lineHeight: '1.5rem',
  fontWeight: '400',
})

export const ItemCheckbox = styled(Checkbox)({
  padding: 0,
  marginRight: '0.5rem',
})

export const FormSelectPartContainer = styled('div')({
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(2,1fr)',
  gap: '1rem',
})

export const CycleTimeContainer = styled(PipelineMetricSelectionWrapper)({
  padding: '1rem',
  boxSizing: 'border-box',
})
