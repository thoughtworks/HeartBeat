import Button, { ButtonProps } from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'

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

const basicStyle = {
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  margin: '2rem',
  width: '15rem',
  minWidth: '10rem',
  minHeight: '3rem',
  [theme.breakpoints.down('md')]: {
    width: '80%',
    maxWidth: '15rem',
  },
}

export const GuideButton = styled(Button)<ButtonProps>({
  ...basicStyle,
  '&:hover': {
    ...basicStyle,
  },
  '&:active': {
    ...basicStyle,
  },
  '&:focus': {
    ...basicStyle,
  },
})
