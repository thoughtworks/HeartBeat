import { styled, css } from '@mui/material/styles'
import { FormControlLabel, TextField } from '@mui/material'
import { theme } from '@src/theme'

export const ConfigStepWrapper = styled('div')({
  width: '100%',
})

export const ProjectNameInput = styled(TextField)({
  width: '100%',
})

export const StyledFormControlLabel = styled(FormControlLabel)`
  ${css`
    ${theme.breakpoints.down('sm')} {
      & .MuiFormControlLabel-label {
        font-size: 0.8rem;
      }
    }
  `}
`
