import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'
import { Dialog } from '@mui/material'

export const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    padding: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
  }
`

export const OkButton = styled('button')({
  width: '4rem',
  height: '2rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '0.3rem',
  color: 'White',
  backgroundColor: theme.main.backgroundColor,
})
