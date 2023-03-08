import { styled } from '@mui/material/styles'
import { Backdrop, Button, FormControl, TextField } from '@mui/material'
import { theme } from '@src/theme'

export const BoardSection = styled('div')({
  position: 'relative',
  boxShadow:
    '0 0.125rem 0.0625rem -0.0625rem rgb(0 0 0 / 20%), 0 0.125rem 0.25rem 0 rgb(0 0 0 / 14%), 0 0.0625rem 0.1875px 0 rgb(0 0 0 / 12%);',
  borderRadius: '0.25rem',
  width: '85%',
  margin: '1rem 0',
  padding: '1rem',
  fontSize: '1rem',
  lineHeight: '2rem',
})

export const BoardTitle = styled('h2')({
  margin: '0 1rem',
  fontSize: '1.5rem',
})
export const BoardForm = styled('form')({
  margin: '1rem',
})

export const BoardTypeSelections = styled(FormControl)({
  width: '20rem',
  margin: '0 4rem 1rem 0',
})

export const BoardTextField = styled(TextField)({
  width: '20rem',
  margin: '0 4rem 1rem 0',
  padding: '0.5rem 0',
})

export const BoardLoadingDrop = styled(Backdrop)({
  position: 'absolute',
  zIndex: '999',
  backgroundColor: 'rgba(199,199,199,0.43)',
  color: theme.main.backgroundColor,
})

export const BoardButtonGroup = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '1rem',
  gap: '1rem',
})

export const VerifyButton = styled(Button)({
  width: '3rem',
  fontSize: '0.8rem',
  fontWeight: '550',
})
export const ResetButton = styled(Button)({
  width: '3rem',
  fontSize: '0.8rem',
  fontWeight: '550',
  color: '#f44336',
})
