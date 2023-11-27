import { styled } from '@mui/material/styles'
import { FormControl, TextField } from '@mui/material'
import { theme } from '@src/theme'
import { MetricSelectionWrapper } from '@src/components/Metrics/MetricsStep/style'

export const ConfigSectionContainer = styled(MetricSelectionWrapper)({})

export const StyledForm = styled('form')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  marginTop: '1rem',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
})

export const StyledTypeSelections = styled(FormControl)({})

export const StyledTextField = styled(TextField)({
  input: {
    padding: '0.56rem 0',
  },
})

export const StyledButtonGroup = styled('div')({
  justifySelf: 'end',
  gridColumn: '2 / 3',
})
