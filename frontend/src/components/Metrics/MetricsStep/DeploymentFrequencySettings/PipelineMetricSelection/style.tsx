import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import { StyledSection } from '@src/components/Common/ConfigForms'
import { theme } from '@src/theme'
import { FormControl } from '@mui/material'

export const PipelineMetricSelectionWrapper = styled(StyledSection)`
  width: 100%;
`

export const ButtonWrapper = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-end',
})

export const RemoveButton = styled(Button)({
  width: '5rem',
  fontSize: '0.8rem',
  fontWeight: '550',
})

export const WarningMessage = styled('p')({
  fontFamily: theme.typography.fontFamily,
  color: '#d32f2f',
  margin: '0 0 0 2.5%',
  width: '95%',
})

export const FormControlWrapper = styled(FormControl)({
  margin: '0 0 2rem 2.5%',
  width: '95%',
  height: '2.5rem',
})
