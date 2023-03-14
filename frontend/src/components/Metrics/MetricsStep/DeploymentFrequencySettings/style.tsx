import { styled } from '@mui/material/styles'
import { theme } from '@src/theme'
import Button from '@mui/material/Button'
import { basicButtonStyle } from '../../MetricsStepper/style'

export const Divider = styled('div')({
  padding: '0.4rem',
  borderLeft: `0.4rem solid ${theme.main.backgroundColor}`,
  margin: '1rem 0',
})

export const Title = styled('span')({
  fontFamily: theme.typography.fontFamily,
})

export const RemoveButton = styled(Button)({
  ...basicButtonStyle,
  width: '15rem',
  color: theme.main.secondColor,
  marginBottom: '1rem',
})

export const AddButton = styled(Button)({
  ...basicButtonStyle,
  width: '15rem',
  backgroundColor: theme.main.backgroundColor,
  color: theme.main.color,
  marginTop: '0.5rem',
  '&:hover': {
    ...basicButtonStyle,
    backgroundColor: theme.main.backgroundColor,
    color: theme.main.color,
  },
})
